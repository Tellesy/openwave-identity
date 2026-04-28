package ly.openwave.identity.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "registered_banks")
class BankEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "bank_handle", nullable = false, unique = true, length = 20)
    val bankHandle: String,

    @Column(name = "display_name", nullable = false, length = 100)
    var displayName: String,

    @Column(name = "country", nullable = false, length = 2)
    val country: String,

    @Column(name = "core_url", nullable = false, length = 500)
    var coreUrl: String,

    @Column(name = "contact_email", nullable = false, length = 255)
    var contactEmail: String,

    @Column(name = "api_key_hash", nullable = false, length = 64)
    val apiKeyHash: String,

    @Column(name = "active", nullable = false)
    var active: Boolean = true,

    @Column(name = "registered_at", nullable = false, updatable = false)
    val registeredAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
)

enum class IdentityStatus { ACTIVE, SUSPENDED, DELETED }

@Entity
@Table(name = "npt_identities")
class IdentityEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "npt_handle", nullable = false, unique = true, length = 32)
    val nptHandle: String,

    @Column(name = "display_name", nullable = false, length = 100)
    var displayName: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    var status: IdentityStatus = IdentityStatus.ACTIVE,

    @Column(name = "default_bank_handle", length = 20)
    var defaultBankHandle: String? = null,

    @Column(name = "national_id", length = 12, unique = true)
    var nationalId: String? = null,

    @Column(name = "phone", length = 20)
    var phone: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),

    @OneToMany(mappedBy = "identity", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val linkedAccounts: MutableList<LinkedAccountEntity> = mutableListOf()
)

@Entity
@Table(
    name = "linked_accounts",
    uniqueConstraints = [UniqueConstraint(columnNames = ["identity_id", "iban"])]
)
class LinkedAccountEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "identity_id", nullable = false)
    val identity: IdentityEntity,

    @Column(name = "bank_handle", nullable = false, length = 20)
    val bankHandle: String,

    @Column(name = "iban", nullable = false, length = 34)
    var iban: String,

    @Column(name = "bank_customer_ref", nullable = false, length = 100)
    val bankCustomerRef: String,

    @Column(name = "display_name", nullable = true, length = 100)
    var displayName: String? = null,

    @Column(name = "currency", nullable = false, length = 3)
    var currency: String = "LYD",

    @Column(name = "is_default", nullable = false)
    var isDefault: Boolean = false,

    @Column(name = "linked_at", nullable = false, updatable = false)
    val linkedAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
)
