# DNS: Naming, Resolution, and Performance

## Overview
Domain Name System (DNS) translates human-readable names into IP addresses. Every external call and many internal service calls rely on DNS correctness and latency. Poor DNS can dominate tail latency and cause cascading failures.

## Why it matters
- Impacts end-user latency (DNS typically precedes TCP/TLS handshakes)
- Affects availability (resolver outages or poisoned caches)
- Enables failover (low TTLs with health-checked records)

## Resolution flow
1. Stub resolver (on host) queries a recursive resolver
2. Recursive walks the chain: root → TLD → authoritative
3. Caching occurs at each layer respecting TTL; negative caching via SOA MINIMUM/`NXDOMAIN`

## Deep dive
- Record types: A/AAAA, CNAME, NS, MX, TXT, SRV
- TTL design:
  - High TTL: lower authoritative load, slower failover
  - Low TTL: faster failover, higher query volume
- CNAME chains: extra queries; prefer flattening where possible
- Split-horizon DNS: different answers by network/view; verify across envs
- DNS over TLS/HTTPS: privacy, different intermediaries, potential latency changes

## Design patterns
- Active-active with health-checked records and low TTLs
- Geo-DNS directing to regionally closest endpoints
- Service discovery internally (e.g., SRV) vs config management

## Configuration checklist
- Choose resolvers with strong SLOs; set two or more
- Validate authoritative name servers’ diversity (ASN, geo)
- Set sane TTLs: critical endpoints 30–60s, static assets minutes–hours
- Monitor DNS latency separately from connect/TLS/TTFB

## Troubleshooting
- Slow first-byte: check DNS vs connect time
- Intermittent failures: inspect negative cache, SERVFAIL/NXDOMAIN
- Environment mismatch: confirm split-horizon answers from each network

## Labs
- Use `dig +trace yourdomain` and diagram delegation
- Measure DNS time vs connect time with `curl -w` or browser devtools
- Reduce CNAME chain depth and remeasure TTFB

## References
- `ref/backend/DNS-Slides.pdf`
