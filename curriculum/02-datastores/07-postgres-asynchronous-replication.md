# PostgreSQL Asynchronous Replication

## Prerequisites
- Replication basics, streaming replication

## Key Concepts
- Primary/standby roles, replication slots
- Async vs sync replication; RPO/RTO implications
- Lag monitoring and read-replica consistency

## Implementation Tips
- Route read traffic with lag-aware policies
- Use quorum-based sync only for critical datasets
- Alert on replay lag and slot bloat

## Pitfalls
- Stale reads causing user-visible inconsistencies
- Misconfigured slots leading to WAL retention issues

## Exercises
- Simulate failover and measure RPO/RTO

## References
- `ref/backend/asynchronous-replication-postgres.pdf`

---

## In-Depth Addendum

### Mechanics of streaming replication
- WAL records streamed to standbys via replication protocol; standbys write and replay.
- `primary_conninfo`, `restore_command`, and replication slots coordinate state.

### Lag and consistency
- Types of lag: write, flush, replay. For read-your-writes, ensure replay lag ≤ SLA.
- Techniques:
  - Read routing with maximum allowed lag threshold
  - Session-level consistency: `SET default_transaction_read_only = on` for replicas, promote only when safe.

### Slot management
- Physical slots prevent WAL removal until standbys consume; mismanagement → disk bloat.
- Monitor `pg_replication_slots` for `confirm_flush_lsn` and `restart_lsn`.

### Failover strategies
- Async replication implies potential data loss on failover (RPO > 0).
- Automate promotion with fencing and client reconnection logic.
- Use `recovery_min_apply_delay` for delayed replicas (ransomware protection pattern).

### Observability
- Track `pg_stat_replication` lags and apply rates; alert on thresholds.
- Emit application metrics for stale reads and reconcile policies.

### Validation lab
- Create two standbys: one low-latency, one delayed. Measure read staleness.
- Force failover and measure RTO; compare data loss (RPO) under async vs sync.
