package ly.openwave.identity.repository

import ly.openwave.identity.entity.BankEntity
import ly.openwave.identity.entity.IdentityEntity
import ly.openwave.identity.entity.LinkedAccountEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
interface BankRepository : JpaRepository<BankEntity, Long> {
    fun findByBankHandle(handle: String): BankEntity?
    fun existsByBankHandle(handle: String): Boolean
    fun findByApiKeyHash(hash: String): BankEntity?
    fun findAllByActiveTrue(): List<BankEntity>
    fun findAllByCountryAndActiveTrue(country: String): List<BankEntity>
}

@Repository
interface IdentityRepository : JpaRepository<IdentityEntity, Long> {
    fun findByNptHandle(handle: String): IdentityEntity?
    fun existsByNptHandle(handle: String): Boolean
    fun countByStatusNot(status: ly.openwave.identity.entity.IdentityStatus): Long
}

@Repository
interface LinkedAccountRepository : JpaRepository<LinkedAccountEntity, Long> {
    fun findAllByIdentityIdAndBankHandle(identityId: Long, bankHandle: String): List<LinkedAccountEntity>
    fun findByIdentityIdAndBankHandleAndIsDefaultTrue(identityId: Long, bankHandle: String): LinkedAccountEntity?
    fun findByIdentityIdAndIban(identityId: Long, iban: String): LinkedAccountEntity?
    fun existsByIdentityIdAndIban(identityId: Long, iban: String): Boolean
    fun findAllByIdentityId(identityId: Long): List<LinkedAccountEntity>
    fun existsByIdentityIdAndBankHandle(identityId: Long, bankHandle: String): Boolean

    @Modifying
    @Query("UPDATE LinkedAccountEntity l SET l.isDefault = false WHERE l.identity.id = :identityId AND l.bankHandle = :bankHandle")
    fun clearBankDefaults(identityId: Long, bankHandle: String)

    @Modifying
    @Query("UPDATE LinkedAccountEntity l SET l.updatedAt = :now WHERE l.id = :id")
    fun touchUpdatedAt(id: Long, now: Instant)
}
