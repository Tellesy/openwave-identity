package ly.openwave.identity.security

import ly.openwave.identity.config.RegistryProperties
import ly.openwave.identity.service.BankService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

const val ROLE_ADMIN       = "ROLE_ADMIN"
const val ROLE_BANK        = "ROLE_BANK"

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val props: RegistryProperties,
    private val bankService: BankService
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                // Public endpoints — no auth
                it.requestMatchers(
                    "/identity/resolve",
                    "/banks",
                    "/banks/*",
                    "/registry/info",
                    "/actuator/health"
                ).permitAll()
                // Admin only
                it.requestMatchers("POST:/banks").hasRole("ADMIN")
                it.requestMatchers("PATCH:/banks/*").hasRole("ADMIN")
                // Bank-authenticated
                it.anyRequest().hasAnyRole("BANK", "ADMIN")
            }
            .addFilterBefore(ApiKeyFilter(props, bankService), UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}

class ApiKeyFilter(
    private val props: RegistryProperties,
    private val bankService: BankService
) : OncePerRequestFilter() {

    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain) {
        val adminKey = req.getHeader("X-OpenWave-Registry-Key")
        val bankKey  = req.getHeader("X-OpenWave-Bank-Key")

        when {
            adminKey != null && adminKey == props.adminKey -> {
                val auth = UsernamePasswordAuthenticationToken(
                    "registry-admin", null, listOf(SimpleGrantedAuthority(ROLE_ADMIN))
                )
                SecurityContextHolder.getContext().authentication = auth
            }
            bankKey != null -> {
                val bank = bankService.resolveByApiKey(bankKey)
                if (bank != null && bank.active) {
                    val auth = UsernamePasswordAuthenticationToken(
                        bank.bankHandle, null, listOf(SimpleGrantedAuthority(ROLE_BANK))
                    )
                    auth.details = bank
                    SecurityContextHolder.getContext().authentication = auth
                }
            }
        }
        chain.doFilter(req, res)
    }
}

fun callerBankHandle(): String =
    (SecurityContextHolder.getContext().authentication?.details as? ly.openwave.identity.entity.BankEntity)?.bankHandle
        ?: throw ly.openwave.identity.exception.ForbiddenException()
