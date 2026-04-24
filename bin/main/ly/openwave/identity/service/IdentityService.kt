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
        setAsDefault: Boolean
    ): IdentityEntity {
        if (!HANDLE_REGEX.matches(nptHandle)) throw HandleInvalidFormatException(nptHandle)

        bankRepo.findByBankHandle(bankHandle) ?: throw BankNotFoundException(bankHandle)

        val existing = identityRepo.findByNptHandle(nptHandle)
        if (existing != null) {
            // Idempotent: same bank re-claiming
            val alreadyLinked = linkedAccountRepo.findByIdentityIdAndBankHandle(existing.id, bankHandle)
            if (alreadyLinked != null) return existing
            throw HandleTakenException(nptHandle)
        }

        val identity = IdentityEntity(
            nptHandle = nptHandle,
            displayName = displayName,
            defaultBankHandle = if (setAsDefault) bankHandle else null
        )
        identityRepo.save(identity)

        linkedAccountRepo.save(
            LinkedAccountEntity(
                identity = identity,
                bankHandle = bankHandle,
                iban = iban,
                bankCustomerRef = bankCustomerRef,
                isDefault = setAsDefault
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

        if (linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, bankHandle))
            throw AccountAlreadyLinkedException(bankHandle)

        val link = linkedAccountRepo.save(
            LinkedAccountEntity(
                identity = identity,
                bankHandle = bankHandle,
                iban = iban,
                bankCustomerRef = bankCustomerRef,
                isDefault = setAsDefault
            )
        )

        if (setAsDefault) {
            identity.defaultBankHandle = bankHandle
            identity.updatedAt = Instant.now()
            identityRepo.save(identity)
        }
        return link
    }

    @Transactional
    fun updateLinkedAccount(nptHandle: String, bankHandle: String, callerBankHandle: String, newIban: String): LinkedAccountEntity {
        if (callerBankHandle != bankHandle) throw ForbiddenException("Bank '$callerBankHandle' does not own the '$bankHandle' account link")
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        val link = linkedAccountRepo.findByIdentityIdAndBankHandle(identity.id, bankHandle)
            ?: throw AccountNotFoundException(bankHandle)
        link.iban = newIban
        link.updatedAt = Instant.now()
        return linkedAccountRepo.save(link)
    }

    @Transactional
    fun unlinkAccount(nptHandle: String, bankHandle: String, callerBankHandle: String) {
        if (callerBankHandle != bankHandle) throw ForbiddenException("Bank '$callerBankHandle' does not own the '$bankHandle' account link")
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        val link = linkedAccountRepo.findByIdentityIdAndBankHandle(identity.id, bankHandle)
            ?: throw AccountNotFoundException(bankHandle)

        linkedAccountRepo.delete(link)

        if (identity.defaultBankHandle == bankHandle) {
            val remaining = linkedAccountRepo.findAllByIdentityId(identity.id)
            identity.defaultBankHandle = remaining.firstOrNull()?.bankHandle
            identity.updatedAt = Instant.now()
            if (remaining.isEmpty()) identity.status = IdentityStatus.SUSPENDED
            identityRepo.save(identity)
        }
    }

    @Transactional
    fun setDefault(nptHandle: String, bankHandle: String, callerBankHandle: String): IdentityEntity {
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        linkedAccountRepo.findByIdentityIdAndBankHandle(identity.id, bankHandle)
            ?: throw AccountNotFoundException(bankHandle)
        // caller must be linked to this identity
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

    fun getLinkedAccounts(nptHandle: String, callerBankHandle: String): List<LinkedAccountEntity> {
        val identity = identityRepo.findByNptHandle(nptHandle) ?: throw IdentityNotFoundException(nptHandle)
        if (!linkedAccountRepo.existsByIdentityIdAndBankHandle(identity.id, callerBankHandle))
            throw ForbiddenException("Bank '$callerBankHandle' is not linked to this identity")
        return linkedAccountRepo.findAllByIdentityId(identity.id)
    }

    fun countActiveIdentities(): Long =
        identityRepo.countByStatusNot(IdentityStatus.DELETED)
}
