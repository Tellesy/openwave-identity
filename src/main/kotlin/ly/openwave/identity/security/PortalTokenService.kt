package ly.openwave.identity.security

import ly.openwave.identity.config.RegistryProperties
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.Base64
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

data class PortalSessionPrincipal(
    val subject: String,
    val role: String,
    val bankHandle: String?,
    val portalRole: String?,
    val expiresAt: Long
)

@Service
class PortalTokenService(private val props: RegistryProperties) {
    fun issue(subject: String, role: String, bankHandle: String?, portalRole: String? = null, ttlSeconds: Long = 28_800): String {
        val expiresAt = Instant.now().epochSecond + ttlSeconds
        val payload = listOf(subject, role, bankHandle ?: "", portalRole ?: "", expiresAt.toString()).joinToString("|")
        val encodedPayload = b64(payload.toByteArray())
        val signature = sign(encodedPayload)
        return "$encodedPayload.$signature"
    }

    fun verify(token: String?): PortalSessionPrincipal? {
        if (token.isNullOrBlank() || !token.contains(".")) return null
        val encodedPayload = token.substringBefore(".")
        val signature = token.substringAfter(".")
        if (sign(encodedPayload) != signature) return null
        val parts = String(Base64.getUrlDecoder().decode(encodedPayload)).split("|")
        if (parts.size !in setOf(4, 5)) return null
        val expiresAt = parts.last().toLongOrNull() ?: return null
        if (expiresAt <= Instant.now().epochSecond) return null
        return PortalSessionPrincipal(
            subject = parts[0],
            role = parts[1],
            bankHandle = parts[2].takeIf { it.isNotBlank() },
            portalRole = if (parts.size == 5) parts[3].takeIf { it.isNotBlank() } else null,
            expiresAt = expiresAt
        )
    }

    private fun sign(value: String): String {
        val secret = (props.adminKey.ifBlank { "openwave-identity-dev-secret" }).toByteArray()
        val mac = Mac.getInstance("HmacSHA256")
        mac.init(SecretKeySpec(secret, "HmacSHA256"))
        return b64(mac.doFinal(value.toByteArray()))
    }

    private fun b64(bytes: ByteArray): String =
        Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
}
