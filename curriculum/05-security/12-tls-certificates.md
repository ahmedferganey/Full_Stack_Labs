# TLS Certificates in Practice

## Prerequisites
- HTTPS, PKI basics

## Key Concepts
- Issuance, renewal, revocation (OCSP/CRL)
- Chain building, intermediates, root stores
- mTLS policies and rotation strategies

## Implementation Tips
- Automate via ACME; store certs securely; rotate keys
- Enforce TLS 1.3, strong ciphers; disable legacy
- Observe expiry via alerts and synthetic checks

## Pitfalls
- Serving wrong chain/intermediate breaks clients
- Key reuse across environments weakens isolation

## Exercises
- Automate issuance and rotation; add expiry SLOs

## References
- `ref/backend/HTTPS-TLS-And-Certificates.pdf`

---

## In-Depth Addendum

### Issuance and renewal architecture
- Use ACME clients with DNS/HTTP challenges; prefer DNS-01 for wildcard and automation.
- Separate issuance roles and key material storage; use KMS/HSM where possible.
- Blue/green certificate rotation to avoid connection drops on reload.

### Chain management
- Always serve the correct intermediate(s); validate with multiple clients (OpenSSL, browsers, mobile).
- Monitor for cross-signed intermediates and upcoming root sunsets.

### Revocation and incidents
- OCSP stapling to reduce client revocation lookups and latency.
- Plan for rapid revocation (key compromise); document mass rotation playbooks.

### mTLS at scale
- Short-lived client certs with automated enrollment (CSR + approvals) and renewal.
- Per-service CAs or intermediate to scope blast radius; CRL/OCSP distribution internally.
- Rotate roots cautiously with staged trust anchors.

### Compliance and observability
- Enforce minimum protocol/cipher policies; audit periodically.
- Track expiry, failure rates, handshake errors; alert before SLO breaches.

### Validation lab
- Stand up automated issuance with DNS-01; implement cert hot-reload without downtime.
- Enable OCSP stapling; verify clients receive stapled responses.
- Deploy mTLS between services; rotate client certs and confirm uninterrupted traffic.
