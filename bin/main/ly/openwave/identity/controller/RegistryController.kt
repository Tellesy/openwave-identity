package ly.openwave.identity.controller

import ly.openwave.identity.config.RegistryProperties
import ly.openwave.identity.service.BankService
import ly.openwave.identity.service.IdentityService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/registry")
class RegistryController(
    private val props: RegistryProperties,
    private val bankService: BankService,
    private val identityService: IdentityService
) {

    @GetMapping("/info")
    fun info() = mapOf(
        "spec_version"            to "1.0.0",
        "operator"                to props.operator,
        "operator_url"            to props.operatorUrl,
        "governance_charter_url"  to props.governanceCharterUrl,
        "source_code_url"         to props.sourceCodeUrl,
        "country_scope"           to props.countryScope,
        "future_operator"         to props.futureOperator,
        "uptime_sla"              to props.uptimeSla,
        "registered_banks"        to bankService.count(),
        "active_identities"       to identityService.countActiveIdentities()
    )
}
