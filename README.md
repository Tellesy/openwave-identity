<div align="center">

# OpenWave Identity Registry

### Global NPT Identity & Alias Resolution Service

**Open Source · Bank-Vouched · Governance-First**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Spec](https://img.shields.io/badge/OpenWave%20Identity-v1.0-brightgreen)](https://github.com/openwave-standard/openwave-spec)
[![Built with](https://img.shields.io/badge/Kotlin-Spring%20Boot%203-orange)](https://spring.io/projects/spring-boot)

*Operated by [Neptune Fintech](https://www.neptune.ly) — future stewardship: Central Bank of Libya*

</div>

---

## What is this?

The **OpenWave Identity Registry** is the open-source implementation of the
[OpenWave Identity API v1.0](https://github.com/openwave-standard/openwave-spec).

It is the global service that maps **NPT handles** (payment usernames) to bank accounts,
enabling universal payment routing across the Libyan banking network.

A person owns a username. They can link accounts from multiple banks to it:

| You type | Money goes to |
|:---|:---|
| `mtellesy` | The owner's **default** bank account |
| `mtellesy@andalus` | Specifically their Andalus account |
| `mtellesy@nub` | Specifically their NUB account |

No IBAN required at the point of payment. One identity, any bank.

---

## How it works

**The registry stores routing only** — no KYC data, no balances, no transaction history.
Just: `username → { bank, iban, is_default }`.

**Banks vouch for users.** A person claims their handle through their bank, which has
already KYC-verified them. The bank calls the registry API with a signed assertion.

**Resolution is public.** Any gateway or app can call `GET /v1/identity/resolve?alias=mtellesy`
with no authentication. It returns the IBAN and bank handle. This endpoint is designed to be
fast and cached (60-second TTL).

---

## API Overview

| Method | Path | Auth | Purpose |
|:---|:---|:---|:---|
| `GET` | `/v1/identity/resolve` | None (public) | Resolve alias → IBAN |
| `POST` | `/v1/identity/claim` | Bank key | Claim a new handle |
| `GET` | `/v1/identity/{handle}` | None (public) | Get public profile |
| `GET` | `/v1/identity/{handle}/accounts` | Bank key | List linked accounts |
| `POST` | `/v1/identity/{handle}/accounts` | Bank key | Link additional bank |
| `PATCH` | `/v1/identity/{handle}/accounts/{bank}` | Bank key | Update linked IBAN |
| `DELETE` | `/v1/identity/{handle}/accounts/{bank}` | Bank key | Unlink account |
| `PATCH` | `/v1/identity/{handle}/default` | Bank key | Set default account |
| `DELETE` | `/v1/identity/{handle}` | Bank key | Delete identity |
| `GET` | `/v1/banks` | None (public) | Bank phonebook |
| `POST` | `/v1/banks` | Admin key | Register new bank |
| `PATCH` | `/v1/banks/{handle}` | Admin key | Update bank |
| `GET` | `/v1/registry/info` | None (public) | Registry metadata |

Full spec: [`openwave-identity-v1.0.yaml`](https://github.com/openwave-standard/openwave-spec/blob/main/openwave-identity-v1.0.yaml)

---

## Running locally

### Prerequisites
- JDK 21+
- PostgreSQL 14+
- Gradle

### Setup

```bash
# Create the database
createdb openwave_identity
createuser openwave
psql -c "ALTER USER openwave WITH PASSWORD 'openwave';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE openwave_identity TO openwave;"

# Clone and run
git clone https://github.com/openwave-standard/openwave-identity.git
cd openwave-identity

cp .env.example .env
# Edit .env with your values

./gradlew bootRun
```

The registry starts on `http://localhost:8090`.

### Quick test

```bash
# Register a bank (admin)
curl -X POST http://localhost:8090/v1/banks \
  -H "X-OpenWave-Registry-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"bank_handle":"andalus","display_name":"Andalus Bank","country":"LY","core_url":"https://api.andalus.ly","contact_email":"openwave@andalus.ly"}'

# Claim a handle (bank-initiated)
curl -X POST http://localhost:8090/v1/identity/claim \
  -H "X-OpenWave-Bank-Key: owbk_andalus_..." \
  -H "Content-Type: application/json" \
  -d '{"npt_handle":"mtellesy","iban":"LY83002700100099900001","customer_display_name":"Mohamed T.","bank_customer_ref":"CUST-001"}'

# Resolve (public)
curl http://localhost:8090/v1/identity/resolve?alias=mtellesy
```

---

## Authentication

| Header | Role | Used for |
|:---|:---|:---|
| `X-OpenWave-Registry-Key` | Admin | Bank registration, admin operations |
| `X-OpenWave-Bank-Key` | Bank | Identity claims, account linking |
| *(none)* | Public | Resolution, bank list, registry info |

Bank API keys are issued when a bank is registered via `POST /v1/banks`.
Keys are shown **once** and stored as SHA-256 hashes only.

---

## Governance

This registry is operated by **Neptune Fintech** under an open governance model:

- All source code is open source (Apache 2.0)
- No bank is denied registration without published justification
- Stewardship transfer to the **Central Bank of Libya** or a bank consortium
  is an explicit stated goal
- The `GET /v1/registry/info` endpoint publicly advertises the current operator,
  source code URL, and future operator — it's a commitment in the API itself

See [GOVERNANCE.md](./GOVERNANCE.md) for the full charter.

---

## Tech Stack

- **Kotlin** + **Spring Boot 3**
- **PostgreSQL** + **Flyway** migrations
- **Spring Security** — stateless API key auth
- **Spring Data JPA** — repositories

---

## License

Apache License 2.0 — see [LICENSE](./LICENSE).

---

<div align="center">

Developed and operated by **[Neptune Fintech](https://www.neptune.ly)**  
Part of the [OpenWave Standard](https://github.com/openwave-standard/openwave-spec)

</div>
