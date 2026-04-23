package ly.openwave.identity.service

import ly.openwave.identity.entity.BankEntity
import ly.openwave.identity.exception.BankHandleTakenException
import ly.openwave.identity.exception.BankNotFoundException
import ly.openwave.identity.repository.BankRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.util.*

data class BankRegistrationResult(val bank: BankEntity, val rawApiKey: String)

@Service
class BankService(private val bankRepo: BankRepository) {

    @Transactional
    fun registerBank(
        bankHandle: String,
        displayName: String,
        country: String,
        coreUrl: String,
        contactEmail: String
    ): BankRegistrationResult {
        if (bankRepo.existsByBankHandle(bankHandle)) throw BankHandleTakenException(bankHandle)
        val rawKey = generateKey(bankHandle)
        val hash = sha256(rawKey)
        val bank = bankRepo.save(
            BankEntity(
                bankHandle = bankHandle,
                displayName = displayName,
                country = country.uppercase(),
                coreUrl = coreUrl,
                contactEmail = contactEmail,
                apiKeyHash = hash
            )
        )
        return BankRegistrationResult(bank, rawKey)
    }

    fun getBank(bankHandle: String): BankEntity =
        bankRepo.findByBankHandle(bankHandle) ?: throw BankNotFoundException(bankHandle)

    fun listBanks(country: String?, activeOnly: Boolean): List<BankEntity> =
        if (country != null) bankRepo.findAllByCountryAndActiveTrue(country.uppercase())
        else if (activeOnly) bankRepo.findAllByActiveTrue()
        else bankRepo.findAll()

    @Transactional
    fun updateBank(bankHandle: String, coreUrl: String?, displayName: String?, contactEmail: String?, active: Boolean?): BankEntity {
        val bank = getBank(bankHandle)
        coreUrl?.let { bank.coreUrl = it }
        displayName?.let { bank.displayName = it }
        contactEmail?.let { bank.contactEmail = it }
        active?.let { bank.active = it }
        bank.updatedAt = Instant.now()
        return bankRepo.save(bank)
    }

    fun resolveByApiKey(apiKey: String): BankEntity? = bankRepo.findByApiKeyHash(sha256(apiKey))

    fun count(): Long = bankRepo.count()

    private fun generateKey(bankHandle: String): String {
        val random = ByteArray(32).also { SecureRandom().nextBytes(it) }
        return "owbk_${bankHandle}_${Base64.getUrlEncoder().withoutPadding().encodeToString(random)}"
    }

    private fun sha256(input: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(input.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
