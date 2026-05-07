package ly.openwave.identity.controller

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import ly.openwave.identity.config.RegistryProperties
import ly.openwave.identity.entity.PortalRole
import ly.openwave.identity.security.PortalTokenService
import ly.openwave.identity.service.BankService
import ly.openwave.identity.service.PortalUserService
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController(
    private val props: RegistryProperties,
    private val bankService: BankService,
    private val portalUserService: PortalUserService,
    private val portalTokenService: PortalTokenService
) {
    private val encoder = BCryptPasswordEncoder()

    @PostMapping("/login")
    fun login(@Valid @RequestBody req: LoginRequest): LoginResponse {
        val role = req.role.uppercase()
        portalUserService.resolveLogin(req.username, req.password)?.let { result ->
            val user = result.user
            val coarseRole = if (user.role.name.startsWith("REGISTRY_")) "ADMIN" else "BANK"
            if (role == coarseRole) {
                return LoginResponse(
                    role = coarseRole,
                    username = user.username,
                    bankHandle = user.bankHandle,
                    portalRole = user.role.name,
                    sessionToken = portalTokenService.issue(user.username, coarseRole, user.bankHandle, user.role.name),
                    expiresIn = 28_800
                )
            }
        }

        if (role == "ADMIN") {
            val configuredPassword = props.adminPassword
            val matches = configuredPassword.isNotBlank() && (
                configuredPassword == req.password || encoder.matches(req.password, configuredPassword)
            )
            if (req.username == props.adminUsername && matches) {
                return LoginResponse(
                    role = "ADMIN",
                    username = req.username,
                    bankHandle = null,
                    portalRole = PortalRole.REGISTRY_ADMIN.name,
                    sessionToken = portalTokenService.issue(req.username, "ADMIN", null, PortalRole.REGISTRY_ADMIN.name),
                    expiresIn = 28_800
                )
            }
        }

        if (role == "BANK") {
            val bank = bankService.resolveByPortalLogin(req.username, req.password)
            if (bank != null) {
                return LoginResponse(
                    role = "BANK",
                    username = req.username,
                    bankHandle = bank.bankHandle,
                    portalRole = PortalRole.BANK_ADMIN.name,
                    sessionToken = portalTokenService.issue(req.username, "BANK", bank.bankHandle, PortalRole.BANK_ADMIN.name),
                    expiresIn = 28_800
                )
            }
        }

        throw org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password")
    }
}

data class LoginRequest(
    @field:NotBlank val username: String,
    @field:NotBlank val password: String,
    @field:NotBlank val role: String
)

data class LoginResponse(
    val role: String,
    val username: String,
    val bankHandle: String?,
    val portalRole: String,
    val sessionToken: String,
    val expiresIn: Long
)
