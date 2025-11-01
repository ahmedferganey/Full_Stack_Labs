# IP, TCP, UDP, and TLS: Foundations for Backend Systems

## Overview
Reliable communication in backends depends on transport behavior. Understanding TCP/UDP and TLS is essential for latency, throughput, and correctness.

## Key concepts
- TCP
  - Three-way handshake; TIME_WAIT; slow start; congestion control (CUBIC/BBR)
  - Head-of-line blocking; delayed ACKs; Nagle’s algorithm
  - Connection reuse and pooling; keepalive vs idle timeouts
- UDP
  - Connectionless, no reliability; used for DNS, QUIC, metrics
  - Add reliability at the application layer if needed
- TLS 1.3
  - 1-RTT handshake; session resumption; ALPN; forward secrecy
  - Cipher selection policy and compatibility

## Tuning and configuration
- Enable connection pooling to amortize handshakes
- Separate idle timeout vs read/write timeouts; fail fast on stalled I/O
- Prefer TLS 1.3; enable session tickets/resumption; OCSP stapling
- Use `TCP_NODELAY` only when batching is not possible and latency is critical

## Performance patterns
- Batch writes to avoid tiny-packet problem
- Limit concurrent new connections per client to avoid SYN floods on your side
- Prefer HTTP/2 or HTTP/3 to reduce connection count pressure

## Pitfalls
- Excessive connection churn → CPU/network overhead, handshake storms
- Small writes + Nagle/ACK delays → spiky latency
- Misaligned timeouts → connections hang or close prematurely

## Troubleshooting
- High TTFB: distinguish DNS vs connect vs TLS vs server time
- Packet captures: confirm retransmissions, window sizes, RTOs
- TLS issues: version/cipher mismatch, SNI, certificate chain errors

## Labs
- Compare throughput with and without pooling under load
- Enable TLS resumption and measure handshake latency deltas
- Benchmark `TCP_NODELAY` impact vs batched writes

## References
- `ref/backend/IP-TCP-UDP-TLS+Slides.pdf`
