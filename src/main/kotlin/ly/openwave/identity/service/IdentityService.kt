package ly.openwave.identity.service

import ly.openwave.identity.entity.IdentityEntity
import ly.openwave.identity.entity.IdentityStatus
import ly.openwave.identity.entity.LinkedAccountEntity
import ly.openwave.identity.exception.*
import ly.openwave.identity.repository.BankRepository
import ly.openwave.identity.repository.IdentityRepository
import ly.openwave.identity.repository.LinkedAccountRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

private val HANDLE_REGEX = Regex("^[a-z0-9_.\\-]{3,32}$")

@Service
class IdentityService(
    private val identityRepo: IdentityRepository,
    private val linkedAccountRepo: LinkedAccountRepository,
    private val bankRepo: BankRepository
) {

    @Transactional
    fun claimHandle(
        nptHandle: String,
        bankHandle: String,
        iban: String,
        displayName: String,
        bankCustomerRef: String,
        setAsDefault: Boolean,
        nationalId: String? = null,
        phone: String? = null
    ): IdentityEntity {
        if (!HANDLE_REGEX.matches(nptHandle)) throw HandleInvalidFormatException(nptHandle)

        // Validate national_id format if provided (Libya: 12 digits)
        if (nationalId != null && !nationalId.matches(Regex("^[0-9]{12}$"))) {
            throw HandleInvalidFormatException("National ID must be exactly 12 digits: $nationalId")
        }

        bankRepo.findByBankHandle(bankHandle) ?: throw BankNotFoundException(bankHandle)

        val existing = identityRepo.findByNptHandle(nptHandle)
        if (existing != null) {
            // Identity exists — check if this IBAN is already linked (idempotent)
            if (linkedAccountRepo.existsByIdentityIdAndIban(existing.id, iban)) return existing

            // CRITICAL: If existing identity has a national_id, new bank MUST provide the same one.
            // This prevents bank B from hijacking a handle that belongs to a different person.
            if (existing.nationalId != null && nationalId != null && existing.nationalId != nationalId) {
                throw ForbiddenException(
                    "National ID mismatch: handle '$nptHandle' is already registered to a different national ID. " +
                    "Cross-bank enrollment requires the same customer identity."
                )
            }
            // If existing has no national_id yet and new bank provides one, store it
            if (existing.nationalId == null && nationalId != null) {
                existing.nationalId = nationalId
                existing.updatedAt = Instant.now()
            }
            if (existing.phone == null && phone != null) {
                existing.phone = phone
                existing.updatedAt = Instant.now()
            }

            val isFirstForBank = !linkedAccountRepo.existsByIdentityIdAndBankHandle(existing.id, bankHandle)
            val isDefaultForBank = isFirstForBank || setAsDefault

            if (setAsDefault || isFirstForBank) {
                linkedAccountRepo.clearBankDefaults(existing.id, bankHandle)
            }
            linkedAccountRepo.save(
                LinkedAccountEntity(
                    identity        = existing,
                    bankHandle      = bankHandle,
                    iban            = iban,
                    bankCustomerRef = bankCustomerRef,
                    isDefault       = isDefaultForBank
                )
            )
            if (setAsDefault && existing.defaultBankHandle == null) {
                existing.defaultBankHandle = bankHandle
            }
            existing.updatedAt = Instant.now()
            identityRepo.save(existing)
            return existing
        }

        // Brand new identity — save with national_id and phone
        val identity = IdentityEntity(
            nptHandle         = nptHandle,
            displayName       = displayName,
            defaultBankHandle = if (setAsDefault) bankHandle else null,
            nationalId        = nationalId,
            phone             = phone
        )
        identityRepo.save(identity)

        linkedAccountRepo.save(
            LinkedAccountEntity(
                identity        = identity,
                bankHandle      = bankHandle,
                iban            = iban,
                bankCustomerRef = bankCustomerRef,
                isDefault       = true   // first IBAN for this bank is always default
            )
        )
        return identity
    }

    @Transactional
    fun linkAccount(
        nptHandle: String,
        bankHandle: String,
        iban: String,
        bankCustomerRef: String,
        setAsDefault: Boolean
    ): LinkedAccountEntity {
        bankRepo.findByBankHandle(bankHandle) ?: throw BankNotFoundException(bankHandle)
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)

        if (linkedAccountRepo.existsByIdentityIdAndIban(identity.id, iban))
            throw AccountAlreadyLinkedException(iban)

        val isFirstForBank = !linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, bankHandle)
        val makeDefault   = setAsDefault || isFirstForBank

        // Clear existing default for this bank if we're setting a new one
        if (makeDefault) linkedAccountRepo.clearBankDefaults(identity.id, bankHandle)

        val link = linkedAccountRepo.save(
            LinkedAccountEntity(
                identity        = identity,
                bankHandle      = bankHandle,
                iban            = iban,
                bankCustomerRef = bankCustomerRef,
                isDefault       = makeDefault
            )
        )

        if (setAsDefault || identity.defaultBankHandle == null) {
            identity.defaultBankHandle = bankHandle
            identity.updatedAt = Instant.now()
            identityRepo.save(identity)
        }
        return link
    }

    @Transactional
    fun updateLinkedAccount(nptHandle: String, iban: String, bankHandle: String, callerBankHandle: String, newIban: String): LinkedAccountEntity {
        if (callerBankHandle != bankHandle) throw ForbiddenException("Bank '$callerBankHandle' does not own the '$bankHandle' account link")
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        val link = linkedAccountRepo.findByIdentityIdAndIban(identity.id, iban)
            ?: throw AccountNotFoundException(iban)
        if (linkedAccountRepo.existsByIdentityIdAndIban(identity.id, newIban))
            throw AccountAlreadyLinkedException(newIban)
        link.iban = newIban
        link.updatedAt = Instant.now()
        return linkedAccountRepo.save(link)
    }

    @Transactional
    fun unlinkAccount(nptHandle: String, iban: String, bankHandle: String, callerBankHandle: String) {
        if (callerBankHandle != bankHandle) throw ForbiddenException("Bank '$callerBankHandle' does not own the '$bankHandle' account link")
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        val link = linkedAccountRepo.findByIdentityIdAndIban(identity.id, iban)
            ?: throw AccountNotFoundException(iban)

        val wasDefault = link.isDefault
        linkedAccountRepo.delete(link)

        // If we removed the default for this bank, promote the next IBAN at same bank
        if (wasDefault) {
            val remaining = linkedAccountRepo.findAllByIdentityIdAndBankHandle(identity.id, bankHandle)
            remaining.firstOrNull()?.let {
                it.isDefault = true
                it.updatedAt = Instant.now()
                linkedAccountRepo.save(it)
            }
        }

        // If no accounts left at all, suspend identity
        val allRemaining = linkedAccountRepo.findAllByIdentityId(identity.id)
        if (allRemaining.isEmpty()) {
            identity.status = IdentityStatus.SUSPENDED
            identity.defaultBankHandle = null
        } else if (identity.defaultBankHandle == bankHandle &&
            linkedAccountRepo.findAllByIdentityIdAndBankHandle(identity.id, bankHandle).isEmpty()) {
            identity.defaultBankHandle = allRemaining.firstOrNull()?.bankHandle
        }
        identity.updatedAt = Instant.now()
        identityRepo.save(identity)
    }

    @Transactional
    fun setDefaultIban(nptHandle: String, iban: String, bankHandle: String, callerBankHandle: String): LinkedAccountEntity {
        if (callerBankHandle != bankHandle) throw ForbiddenException("Bank '$callerBankHandle' does not own the '$bankHandle' account link")
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        val link = linkedAccountRepo.findByIdentityIdAndIban(identity.id, iban)
            ?: throw AccountNotFoundException(iban)
        // Clear existing default for this bank, then set new one
        linkedAccountRepo.clearBankDefaults(identity.id, bankHandle)
        link.isDefault = true
        link.updatedAt = Instant.now()
        return linkedAccountRepo.save(link)
    }

    @Transactional
    fun setDefaultBank(nptHandle: String, bankHandle: String, callerBankHandle: String): IdentityEntity {
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        if (!linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, bankHandle))
            throw AccountNotFoundException(bankHandle)
        if (!linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, callerBankHandle))
            throw ForbiddenException("Bank '$callerBankHandle' is not linked to this identity")
        identity.defaultBankHandle = bankHandle
        identity.updatedAt = Instant.now()
        return identityRepo.save(identity)
    }

    @Transactional
    fun deleteIdentity(nptHandle: String, callerBankHandle: String) {
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        if (!linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, callerBankHandle))
            throw ForbiddenException("Bank '$callerBankHandle' has no linked account for identity '$nptHandle'")
        identity.status = IdentityStatus.DELETED
        identity.updatedAt = Instant.now()
        identityRepo.save(identity)
    }

    fun getIdentity(nptHandle: String): IdentityEntity =
        identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)

    fun getIdentityOrNull(nptHandle: String): IdentityEntity? =
        identityRepo.findByNptHandle(nptHandle)

    fun getLinkedAccounts(nptHandle: String, callerBankHandle: String): List<LinkedAccountEntity> {
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        if (!linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, callerBankHandle))
            throw ForbiddenException("Bank '$callerBankHandle' is not linked to this identity")
        return linkedAccountRepo.findAllByIdentityId(identity.id)
    }

    fun getLinkedAccountsForBank(nptHandle: String, bankHandle: String, callerBankHandle: String): List<LinkedAccountEntity> {
        if (callerBankHandle != bankHandle) throw ForbiddenException("Bank '$callerBankHandle' cannot view '$bankHandle' accounts")
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        return linkedAccountRepo.findAllByIdentityIdAndBankHandle(identity.id, bankHandle)
    }

    fun countActiveIdentities(): Long =
        identityRepo.countByStatusNot(IdentityStatus.DELETED)
}
