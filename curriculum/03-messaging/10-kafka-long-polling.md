# Kafka Long Polling

## Prerequisites
- Kafka fundamentals (topics, partitions, consumer groups)

## Key Concepts
- Long polling vs short polling
- Fetch min/max bytes and wait times
- Throughput vs latency trade-offs

## Implementation Tips
- Align long polling with batch processing
- Tune max wait and fetch sizes per SLA
- Monitor consumer lag and rebalance events

## Pitfalls
- Overly aggressive long waits increase tail latency
- Unbalanced partitions stall consumers

## Exercises
- Compare throughput/latency under different fetch configs

## References
- `ref/backend/Apache-kafka-long-polling.pdf`

---

## In-Depth Addendum

### Long polling mechanics
- Consumer sends fetch with `max.poll.interval.ms`, `fetch.min.bytes`, `fetch.max.bytes`, `fetch.max.wait.ms`.
- Broker returns when data ≥ min bytes or wait time expires, reducing empty polls.

### Tuning strategy
- Low latency: small `fetch.min.bytes`, small `fetch.max.wait.ms`.
- High throughput: larger `fetch.min.bytes`, higher `fetch.max.wait.ms` to batch.
- Balance per SLA; different consumers can use different profiles.

### Lag and rebalances
- Monitor `records-lag`, `records-lag-max`; alert on sustained growth.
- Avoid frequent rebalances: cooperative rebalancing, stable group IDs, predictable startup/shutdown.

### Batch processing and backpressure
- Process records in bounded-size batches to control memory.
- Commit offsets after side effects complete (at-least-once). Use idempotent writers to sinks.

### Partitioning and parallelism
- Ensure enough partitions for desired consumer parallelism; avoid hot partitions.
- Use keys to preserve order where required; avoid keys that funnel to one partition.

### Validation lab
- Benchmark varying `fetch.min.bytes` and `fetch.max.wait.ms` under controlled production-like load.
- Simulate broker slowdowns and observe consumer lag behavior and recovery.
