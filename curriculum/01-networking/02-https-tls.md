# HTTPS and Certificates

## Overview
HTTPS provides transport security and authenticity. Certificates and proper TLS configuration are critical for both internet-facing and internal services (mTLS).

## Certificate chain and validation
- Leaf certificate → intermediate(s) → root CA (in trust store)
- SNI selects the certificate on multi-tenant endpoints
- OCSP/CRL and stapling for revocation info

## Modern TLS practices
- TLS 1.3 preferred; disable weak ciphers/protocols
- ALPN to negotiate HTTP/2/3
- Session tickets for resumption; rotate keys periodically

## mTLS for service-to-service auth
- Issue client certificates from internal PKI
- Enforce policy per service; scope privileges
- Plan rotation and revocation paths; short-lived certs reduce blast radius

## Automation
- Use ACME for issuance and renewal
- Store keys securely (HSM/KMS); restrict permissions
- Monitor expiry and certificate chain correctness continuously

## Pitfalls
- Wrong chain presented → client trust failures
- Clock skew breaks validation; ensure reliable time sync
- Mixed content downgrades security context in browsers

## Labs
- Automate issuance/renewal and enforce HTTPS redirects
- Deploy mTLS between two services with mutual trust
- Validate cipher suites and protocols with scanners

## References
- `ref/backend/HTTPS-TLS-And-Certificates.pdf`
