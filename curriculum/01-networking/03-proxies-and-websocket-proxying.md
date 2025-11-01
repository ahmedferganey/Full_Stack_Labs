# Proxies, Reverse Proxies, and WebSocket Proxying

## Overview
Proxies sit between clients and services to provide routing, load balancing, security, and observability. WebSockets require careful proxy configuration to support upgrades and long-lived connections.

## Proxy roles and layers
- Forward vs reverse proxy
- Layer 4 (TCP) vs Layer 7 (HTTP): trade-offs in routing, observability, TLS termination
- Load balancing strategies: round-robin, least connections, consistent hashing

## Sessions and state
- Sticky sessions via cookies/IP-hash
- When to avoid stickiness (stateless services) vs require it (in-memory session state)

## Timeouts and buffering
- Idle vs read/write timeouts; different for HTTP vs upgraded connections
- Proxy buffering and streaming: configure for SSE/gRPC/WebSocket
- Backpressure and max concurrent connections per client

## Health checks and resiliency
- Active and passive health checks
- Outlier detection, circuit breaking, connection draining
- Graceful deploys with slow-start/warm-up

## WebSocket specifics
- HTTP Upgrade flow; headers to preserve
- Keepalive/ping frames; proxy idle timeouts
- Subprotocol negotiation

## Pitfalls
- Buffering breaking streaming semantics
- Missing SNI or ALPN at TLS termination
- Health checks hitting cached endpoints instead of live paths

## Labs
- Configure reverse proxy for HTTP and WebSocket upgrade; validate idle/read timeouts
- Add active health checks and simulate backend failures
- Test sticky vs non-sticky behavior under load

## References
- `ref/backend/proxy+vs+reverse+proxy.pdf`
- `ref/backend/WebSocket+Proxying.pptx`
