# OpenWave Identity Registry — Governance Charter

## Current Operator

**Neptune Fintech**  
Website: https://www.neptune.ly  
Country: Libya

Neptune Fintech currently operates the OpenWave Identity Registry on behalf of the
Libyan banking network. This is an interim arrangement.

---

## Governance Principles

1. **Open by default** — All registry source code is published under Apache 2.0.
   Any party can audit, fork, or self-host.

2. **No bank discrimination** — Any licensed Libyan bank or compliant fintech may
   apply for registration. Rejections must be published with justification.

3. **Data minimalism** — The registry stores only routing data (`username → {bank, iban}`).
   No KYC data, no balances, no transaction history.

4. **Public resolution** — The `/identity/resolve` endpoint will always remain
   public and unauthenticated. Payment resolution must never be gated.

5. **Stewardship transfer** — Neptune Fintech commits to transferring operational
   control to a neutral body. Preferred successor: **Central Bank of Libya**.
   Timeline: subject to CBL readiness and regulatory framework.

---

## Bank Registration

Banks apply for registration by contacting: openwave@neptune.ly

Required:
- Proof of banking licence (CBL-issued)
- Technical contact and core API URL
- Acceptance of the OpenWave Identity Charter

Approved banks receive an `X-OpenWave-Bank-Key` and may begin claiming handles
for their verified customers.

---

## Handle Disputes

If two parties claim the same handle:

1. The first claimant holds the handle (first-come, first-served).
2. The disputing party submits evidence to their registered bank.
3. The bank escalates to Neptune Fintech with signed documentation.
4. Neptune Fintech arbitrates within 14 business days.
5. Decisions are published in the public dispute log (anonymised).

---

## Amendments

Changes to this charter are proposed via GitHub pull request to the
`openwave-standard/openwave-identity` repository. A 30-day public comment
period applies to material changes.
