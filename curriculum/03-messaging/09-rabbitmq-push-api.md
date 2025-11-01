# RabbitMQ Push API

## Prerequisites
- Messaging patterns, AMQP basics

## Key Concepts
- Exchanges, queues, bindings, routing keys
- At-least-once delivery, consumer acknowledgments
- Prefetch, backpressure, dead-letter exchanges

## Implementation Tips
- Use manual acks with idempotent consumers
- Tune prefetch for throughput vs fairness
- Isolate DLQs per domain and monitor rates

## Pitfalls
- Auto-ack causing data loss on consumer failure
- Single-queue hotspots under skewed keys

## Exercises
- Build a consumer with manual acks and retry/DLQ

## References
- `ref/backend/rabbitMQ-pushAPI.pdf`

---

## In-Depth Addendum

### Exchange patterns
- Direct: exact routing key match. Good for simple point-to-point.
- Topic: wildcard routing. Use concise, stable key schemas.
- Fanout: broadcast to all bound queues; avoid for high-volume unless necessary.
- Headers: match on headers; flexible but slower.

### Delivery semantics and idempotency
- At-least-once via manual `basic.ack`. On failure, `basic.nack(requeue=true)` or route to DLQ.
- Idempotent consumers: dedupe keys, exactly-once side effects via transactional outbox or upserts.

### Backpressure and flow control
- Limit unacked messages per consumer via `basic.qos(prefetch=N)`.
- Scale consumers horizontally; shard by routing keys to avoid hotspots.
- Use per-queue and per-connection max length/TTL policies to protect the broker.

### DLQ architecture
- Define DLX with reason tagging (headers) for observability.
- Separate retry queue with per-message or per-queue delay (x-delayed-message plugin or delayed exchanges pattern).
- Cap retry attempts; send to terminal DLQ with alerting.

### Observability
- Metrics: publish/ack rates, unacked count, redeliveries, consumer utilization, queue length.
- Alerts: growing unacked messages, DLQ rate spikes, connection churn.

### Validation lab
- Create topic exchange with two routing patterns; implement consumers with prefetch 1, 10, 100 and measure throughput and latency.
- Introduce consumer failures; verify retry and DLQ routing with reason codes.
