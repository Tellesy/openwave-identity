package ly.openwave.identity.controller

import ly.openwave.identity.service.ResolutionService
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.concurrent.TimeUnit

@RestController
class ResolutionController(private val resolutionService: ResolutionService) {

    @GetMapping("/identity/resolve")
    fun resolve(
        @RequestParam alias: String,
        @RequestParam(required = false, defaultValue = "payment") purpose: String
    ): ResponseEntity<AliasResolutionResponse> {
        val result = resolutionService.resolve(alias)
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS))
            .header("X-OpenWave-Registry-Version", "1.0.0")
            .body(
                AliasResolutionResponse(
                    nptHandle   = result.nptHandle,
                    bankHandle  = result.bankHandle,
                    iban        = result.iban,
                    displayName = result.displayName,
                    isDefault   = result.isDefault,
                    resolvedAt  = result.resolvedAt
                )
            )
    }
}

data class AliasResolutionResponse(
    val nptHandle: String,
    val bankHandle: String,
    val iban: String,
    val displayName: String,
    val isDefault: Boolean,
    val resolvedAt: Instant
)
