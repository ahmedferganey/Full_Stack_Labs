# PostgreSQL Asynchronous Commits

## Prerequisites
- Postgres basics, WAL

## Key Concepts
- Synchronous vs asynchronous commit semantics
- Durability vs latency trade-offs
- Tuning `synchronous_commit`, `wal_writer_delay`

## Implementation Tips
- Use async commits for non-critical writes; log critical paths
- Combine with idempotency keys for safe retries
- Monitor commit latency percentiles

## Pitfalls
- Assuming durability when async is enabled
- Silent data loss under crash conditions

## Exercises
- Measure latency difference between sync and async commits

## References
- `ref/backend/asynchronous-commits-postgres.pdf`

---

## In-Depth Addendum

### How asynchronous commit works internally
- With `synchronous_commit = off`, the backend returns to the client once WAL is written to the OS page cache, before fsync to durable storage.
- Crash before WAL flush can lose the most recent transactions; replicas may lag further.

### Tuning guidance
- Suggested defaults per workload:
  - Critical ledgers: keep synchronous commits; consider `remote_apply` on sync standbys.
  - Event ingestion: async commits acceptable with idempotent processing and replay.
- Key parameters to monitor and tune:
  - `wal_writer_delay`, `commit_delay`, `commit_siblings`
  - Storage latency (fsync), WAL segment size, checkpoint frequency

### Safety patterns
- Use idempotency keys and at-least-once semantics in upstream services.
- Persist critical side effects (e.g., audit logs) via synchronous paths even if primary writes are async.
- Emit durable outbox events with their own consistency guarantees.

### Observability
- Track percentiles: commit latency, WAL write/flush times, checkpoint write time.
- Alert on spikes in `pg_stat_bgwriter` and `pg_stat_wal` metrics.

### Validation lab
- Under load, compare tail latency (p95/p99) with `synchronous_commit` on vs off.
- Kill the Postgres process to simulate crash; verify data loss boundaries and recovery behavior.
