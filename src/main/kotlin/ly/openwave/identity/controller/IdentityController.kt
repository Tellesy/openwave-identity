package ly.openwave.identity.controller

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
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
        val identity = identityService.claimHandle(
            nptHandle       = req.nptHandle,
            bankHandle      = callerBank,
            iban            = req.iban,
            displayName     = req.customerDisplayName,
            bankCustomerRef = req.bankCustomerRef,
            setAsDefault    = req.setAsDefault ?: true
        )
        val status = if (identityService.getLinkedAccounts(req.nptHandle, callerBank).size > 1)
            HttpStatus.OK else HttpStatus.CREATED
        return ResponseEntity.status(status).body(identity.toResponse())
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

    @PatchMapping("/{nptHandle}/accounts/{bankHandle}")
    fun updateAccount(
        @PathVariable nptHandle: String,
        @PathVariable bankHandle: String,
        @Valid @RequestBody req: UpdateAccountRequest
    ): LinkedAccountResponse {
        return identityService.updateLinkedAccount(
            nptHandle       = nptHandle,
            bankHandle      = bankHandle,
            callerBankHandle = callerBankHandle(),
            newIban         = req.iban
        ).toResponse()
    }

    @DeleteMapping("/{nptHandle}/accounts/{bankHandle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun unlinkAccount(@PathVariable nptHandle: String, @PathVariable bankHandle: String) {
        identityService.unlinkAccount(nptHandle, bankHandle, callerBankHandle())
    }

    @PatchMapping("/{nptHandle}/default")
    fun setDefault(
        @PathVariable nptHandle: String,
        @Valid @RequestBody req: SetDefaultRequest
    ): SetDefaultResponse {
        val identity = identityService.setDefault(nptHandle, req.bankHandle, callerBankHandle())
        return SetDefaultResponse(
            nptHandle          = identity.nptHandle,
            defaultBankHandle  = identity.defaultBankHandle,
            updatedAt          = identity.updatedAt
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
    val setAsDefault: Boolean? = true
)

data class LinkAccountRequest(
    @field:NotBlank val iban: String,
    @field:NotBlank val bankCustomerRef: String,
    val setAsDefault: Boolean? = false
)

data class UpdateAccountRequest(@field:NotBlank val iban: String)

data class SetDefaultRequest(@field:NotBlank val bankHandle: String)

data class IdentityResponse(
    val nptHandle: String,
    val displayName: String,
    val status: String,
    val defaultBankHandle: String?,
    val linkedBanks: List<String>,
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
    val ibanMasked: String,
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
    linkedBanks       = linkedAccounts.map { it.bankHandle },
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
    ibanMasked  = maskIban(iban),
    isDefault   = isDefault,
    linkedAt    = linkedAt
)

private fun maskIban(iban: String): String =
    if (iban.length <= 10) iban
    else "${iban.take(6)}...${iban.takeLast(4)}"
