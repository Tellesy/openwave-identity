package ly.openwave.identity.controller

import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import ly.openwave.identity.entity.BankEntity
import ly.openwave.identity.service.BankService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/banks")
class BankController(private val bankService: BankService) {

    @GetMapping
    fun listBanks(
        @RequestParam(required = false) country: String?,
        @RequestParam(required = false, defaultValue = "true") activeOnly: Boolean
    ): BankListResponse {
        val banks = bankService.listBanks(country, activeOnly)
        return BankListResponse(
            banks       = banks.map { it.toPublicResponse() },
            total       = banks.size,
            generatedAt = Instant.now()
        )
    }

    @GetMapping("/{bankHandle}")
    fun getBank(@PathVariable bankHandle: String): BankPublicResponse =
        bankService.getBank(bankHandle).toPublicResponse()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun registerBank(@Valid @RequestBody req: RegisterBankRequest): BankRegistrationResponse {
        val result = bankService.registerBank(
            bankHandle   = req.bankHandle,
            displayName  = req.displayName,
            country      = req.country,
            coreUrl      = req.coreUrl,
            contactEmail = req.contactEmail
        )
        return BankRegistrationResponse(
            bankHandle   = result.bank.bankHandle,
            displayName  = result.bank.displayName,
            bankApiKey   = result.rawApiKey,
            registeredAt = result.bank.registeredAt
        )
    }

    @PatchMapping("/{bankHandle}")
    fun updateBank(
        @PathVariable bankHandle: String,
        @Valid @RequestBody req: UpdateBankRequest
    ): BankResponse =
        bankService.updateBank(
            bankHandle   = bankHandle,
            coreUrl      = req.coreUrl,
            displayName  = req.displayName,
            contactEmail = req.contactEmail,
            active       = req.active
        ).toResponse()
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

data class RegisterBankRequest(
    @field:NotBlank
    @field:Pattern(regexp = "^[a-z0-9-]{2,20}$", message = "Bank handle must be 2-20 lowercase alphanumeric or hyphen characters")
    val bankHandle: String,

    @field:NotBlank @field:Size(min = 2, max = 100) val displayName: String,
    @field:NotBlank @field:Size(min = 2, max = 2)   val country: String,
    @field:NotBlank                                  val coreUrl: String,
    @field:NotBlank @field:Email                     val contactEmail: String
)

data class UpdateBankRequest(
    val coreUrl: String?,
    val displayName: String?,
    @field:Email val contactEmail: String?,
    val active: Boolean?
)

data class BankResponse(
    val bankHandle: String,
    val displayName: String,
    val country: String,
    val coreUrl: String,
    val contactEmail: String,
    val active: Boolean,
    val registeredAt: Instant
)

data class BankPublicResponse(
    val bankHandle: String,
    val displayName: String,
    val country: String,
    val active: Boolean,
    val registeredAt: Instant
)

data class BankListResponse(
    val banks: List<BankPublicResponse>,
    val total: Int,
    val generatedAt: Instant
)

data class BankRegistrationResponse(
    val bankHandle: String,
    val displayName: String,
    val bankApiKey: String,
    val registeredAt: Instant
)

fun BankEntity.toPublicResponse() = BankPublicResponse(
    bankHandle   = bankHandle,
    displayName  = displayName,
    country      = country,
    active       = active,
    registeredAt = registeredAt
)

fun BankEntity.toResponse() = BankResponse(
    bankHandle   = bankHandle,
    displayName  = displayName,
    country      = country,
    coreUrl      = coreUrl,
    contactEmail = contactEmail,
    active       = active,
    registeredAt = registeredAt
)
