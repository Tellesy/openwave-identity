package ly.openwave.identity

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class IdentityRegistryApplication

fun main(args: Array<String>) {
    runApplication<IdentityRegistryApplication>(*args)
}
