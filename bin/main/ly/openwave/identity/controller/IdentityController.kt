package ly.openwave.identity.controller

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Digits
import ly.openwave.identity.entity.IdentityEntity
import ly.openwave.identity.entity.LinkedAccountEntity
import ly.openwave.identity.security.callerBankHandle
import ly.openwave.identity.service.IdentityService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/identity")
class IdentityController(private val identityService: IdentityService) {

    @PostMapping("/claim")
    fun claim(@Valid @RequestBody req: ClaimHandleRequest): ResponseEntity<IdentityResponse> {
        val callerBank = callerBankHandle()
        val wasNew = identityService.getIdentityOrNull(req.nptHandle) == null
        val identity = identityService.claimHandle(
            nptHandle       = req.nptHandle,
            bankHandle      = callerBank,
            iban            = req.iban,
            displayName     = req.customerDisplayName,
            bankCustomerRef = req.bankCustomerRef,
            setAsDefault    = req.setAsDefault ?: true,
            nationalId      = req.nationalId,
            phone           = req.phone
        )
        return ResponseEntity.status(if (wasNew) HttpStatus.CREATED else HttpStatus.OK).body(identity.toResponse())
    }

    @GetMapping("/{nptHandle}")
    fun getProfile(@PathVariable nptHandle: String): PublicProfileResponse {
        val identity = identityService.getIdentity(nptHandle)
        val accountCount = identityService.getLinkedAccounts(nptHandle, identity.linkedAccounts.firstOrNull()?.bankHandle ?: "").size
        return identity.toPublicProfile(accountCount)
    }

    @DeleteMapping("/{nptHandle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteIdentity(@PathVariable nptHandle: String) {
        identityService.deleteIdentity(nptHandle, callerBankHandle())
    }

    @GetMapping("/{nptHandle}/accounts")
    fun listAccounts(@PathVariable nptHandle: String): LinkedAccountsResponse {
        val accounts = identityService.getLinkedAccounts(nptHandle, callerBankHandle())
        return LinkedAccountsResponse(
            nptHandle = nptHandle,
            accounts  = accounts.map { it.toResponse() }
        )
    }

    @PostMapping("/{nptHandle}/accounts")
    @ResponseStatus(HttpStatus.CREATED)
    fun linkAccount(
        @PathVariable nptHandle: String,
        @Valid @RequestBody req: LinkAccountRequest
    ): LinkedAccountResponse {
        return identityService.linkAccount(
            nptHandle       = nptHandle,
            bankHandle      = callerBankHandle(),
            iban            = req.iban,
            bankCustomerRef = req.bankCustomerRef,
            setAsDefault    = req.setAsDefault ?: false
        ).toResponse()
    }

    @GetMapping("/{nptHandle}/accounts/{bankHandle}")
    fun listBankAccounts(
        @PathVariable nptHandle: String,
        @PathVariable bankHandle: String
    ): LinkedAccountsResponse {
        val accounts = identityService.getLinkedAccountsForBank(nptHandle, bankHandle, callerBankHandle())
        return LinkedAccountsResponse(nptHandle = nptHandle, accounts = accounts.map { it.toResponse() })
    }

    @PatchMapping("/{nptHandle}/accounts/iban/{iban}")
    fun updateAccount(
        @PathVariable nptHandle: String,
        @PathVariable iban: String,
        @Valid @RequestBody req: UpdateAccountRequest
    ): LinkedAccountResponse {
        return identityService.updateLinkedAccount(
            nptHandle        = nptHandle,
            iban             = iban,
            bankHandle       = req.bankHandle,
            callerBankHandle = callerBankHandle(),
            newIban          = req.newIban
        ).toResponse()
    }

    @DeleteMapping("/{nptHandle}/accounts/iban/{iban}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun unlinkAccount(
        @PathVariable nptHandle: String,
        @PathVariable iban: String,
        @RequestParam bankHandle: String
    ) {
        identityService.unlinkAccount(nptHandle, iban, bankHandle, callerBankHandle())
    }

    @PatchMapping("/{nptHandle}/accounts/iban/{iban}/set-default")
    fun setDefaultIban(
        @PathVariable nptHandle: String,
        @PathVariable iban: String,
        @RequestParam bankHandle: String
    ): LinkedAccountResponse {
        return identityService.setDefaultIban(nptHandle, iban, bankHandle, callerBankHandle()).toResponse()
    }

    @PatchMapping("/{nptHandle}/default-bank")
    fun setDefaultBank(
        @PathVariable nptHandle: String,
        @Valid @RequestBody req: SetDefaultBankRequest
    ): SetDefaultResponse {
        val identity = identityService.setDefaultBank(nptHandle, req.bankHandle, callerBankHandle())
        return SetDefaultResponse(
            nptHandle         = identity.nptHandle,
            defaultBankHandle = identity.defaultBankHandle,
            updatedAt         = identity.updatedAt
        )
    }
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

data class ClaimHandleRequest(
    @field:NotBlank
    @field:Pattern(regexp = "^[a-z0-9_.\\-]{3,32}$", message = "Handle must be 3-32 lowercase alphanumeric characters, dots, underscores, or hyphens")
    val nptHandle: String,

    @field:NotBlank val iban: String,
    @field:NotBlank @field:Size(min = 2, max = 100) val customerDisplayName: String,
    @field:NotBlank val bankCustomerRef: String,
    val setAsDefault: Boolean? = true,

    @field:Pattern(regexp = "^[0-9]{12}$", message = "National ID must be exactly 12 digits")
    val nationalId: String? = null,

    @field:Pattern(regexp = "^[0-9+\\-]{7,20}$", message = "Invalid phone number format")
    val phone: String? = null
)

data class LinkAccountRequest(
    @field:NotBlank val iban: String,
    @field:NotBlank val bankCustomerRef: String,
    val setAsDefault: Boolean? = false
)

data class UpdateAccountRequest(
    @field:NotBlank val bankHandle: String,
    @field:NotBlank val newIban: String
)

data class SetDefaultBankRequest(@field:NotBlank val bankHandle: String)

data class IdentityResponse(
    val nptHandle: String,
    val displayName: String,
    val status: String,
    val defaultBankHandle: String?,
    val linkedBanks: List<String>,
    val nationalIdPresent: Boolean,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class PublicProfileResponse(
    val nptHandle: String,
    val displayName: String,
    val hasDefault: Boolean,
    val linkedBankCount: Int,
    val status: String
)

data class LinkedAccountsResponse(
    val nptHandle: String,
    val accounts: List<LinkedAccountResponse>
)

data class LinkedAccountResponse(
    val bankHandle: String,
    val iban: String,
    val ibanMasked: String,
    val displayName: String?,
    val currency: String,
    val isDefault: Boolean,
    val linkedAt: Instant
)

data class SetDefaultResponse(
    val nptHandle: String,
    val defaultBankHandle: String?,
    val updatedAt: Instant
)

// ─── Mappers ─────────────────────────────────────────────────────────────────

fun IdentityEntity.toResponse() = IdentityResponse(
    nptHandle         = nptHandle,
    displayName       = displayName,
    status            = status.name,
    defaultBankHandle = defaultBankHandle,
    linkedBanks       = linkedAccounts.map { it.bankHandle }.distinct(),
    nationalIdPresent = nationalId != null,
    createdAt         = createdAt,
    updatedAt         = updatedAt
)

fun IdentityEntity.toPublicProfile(accountCount: Int) = PublicProfileResponse(
    nptHandle        = nptHandle,
    displayName      = displayName,
    hasDefault       = defaultBankHandle != null,
    linkedBankCount  = accountCount,
    status           = status.name
)

fun LinkedAccountEntity.toResponse() = LinkedAccountResponse(
    bankHandle  = bankHandle,
    iban        = iban,
    ibanMasked  = maskIban(iban),
    displayName = displayName,
    currency    = currency,
    isDefault   = isDefault,
    linkedAt    = linkedAt
)

private fun maskIban(iban: String): String =
    if (iban.length <= 10) iban
    else "${iban.take(6)}...${iban.takeLast(4)}"
