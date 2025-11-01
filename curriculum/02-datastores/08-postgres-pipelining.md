# PostgreSQL Pipelining

## Prerequisites
- Postgres wire protocol basics

## Key Concepts
- Query pipelining vs batching
- Latency hiding over high-RTT links
- Driver support and constraints

## Implementation Tips
- Use pipelining for idempotent, independent queries
- Combine with prepared statements for efficiency
- Monitor server-side queueing and timeouts

## Pitfalls
- Interleaved errors complicate recovery
- Non-idempotent operations risk corruption on retry

## Exercises
- Benchmark sequential vs pipelined queries

## References
- `ref/backend/Postgres-Pipelining.pdf`

---

## In-Depth Addendum

### How pipelining differs from batching
- Batching sends N queries as a single request; server processes sequentially.
- Pipelining sends multiple queries without waiting for prior responses; responses return in order but overlap I/O.

### When to pipeline
- High-RTT networks where small query latencies add up
- Many small, independent, idempotent queries (e.g., cache warmups, fan-out reads)

### Driver and server considerations
- Ensure driver supports pipelining (e.g., libpq pipeline mode) and proper error handling.
- Limit pipeline depth to avoid server-side queue saturation; adapt based on observed latency.

### Error handling
- On error in a pipeline, subsequent results may be skipped or error; implement clean abort and retry logic.
- Use idempotency and safe retry semantics.

### Observability and tuning
- Track queue depth, server-side active queries, and timeouts.
- Tune statement timeout and pipeline window to balance throughput vs fairness.

### Validation lab
- Emulate high RTT with traffic control (tc) and compare throughput between sequential, batched, and pipelined modes.
- Vary pipeline depth and measure p95 latency and error rates.
