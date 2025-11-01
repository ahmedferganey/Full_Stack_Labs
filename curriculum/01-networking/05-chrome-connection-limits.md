# Browser Connection Limits (Chrome)

## Overview
Browsers cap concurrent connections per host to balance resource use and fairness. HTTP/2 and HTTP/3 change the calculus via multiplexing.

## Connection models
- HTTP/1.1: limited parallelism; many concurrent TCP connections per host
- HTTP/2: multiplexing over one connection; head-of-line at TCP layer
- HTTP/3 (QUIC): multiplexing without TCP HOL; lower latency on lossy links

## Optimization strategies
- Prefer HTTP/2/3 where possible
- Consolidate domains to avoid per-host caps, but avoid over-sharding
- Use preload hints (preconnect, dns-prefetch, preload)
- Bundle/partition assets considering multiplexing behavior

## Pitfalls
- Excessive sharding increases TLS/DNS overhead
- Misconfigured H2/H3 leads to fallback and connection inflation

## Labs
- Compare waterfalls for H1 vs H2/H3 under varying asset counts
- Measure impact of domain consolidation on time-to-interactive

## References
- `ref/backend/Chrome-6-Connections-Limit.pdf`
