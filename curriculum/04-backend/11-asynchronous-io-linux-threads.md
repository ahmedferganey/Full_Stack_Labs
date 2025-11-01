# Asynchronous I/O and Linux Threads

## Prerequisites
- Concurrency models, blocking vs non-blocking I/O

## Key Concepts
- Thread-per-request vs event-driven models
- Reactor/Proactor patterns
- Context switch costs, scheduling, affinity

## Implementation Tips
- Use async I/O for high-concurrency, I/O-bound workloads
- Assign bounded thread pools; avoid unbounded growth
- Instrument queueing, CPU steal, and context switches

## Pitfalls
- Mixing blocking calls in async paths causes stalls
- Oversubscription thrashes caches and degrades throughput

## Exercises
- Compare TPS and latency for blocking vs async server under load

## References
- `ref/backend/asynchronous-io-linux-thread.pdf`

---

## In-Depth Addendum

### Models compared
- Thread-per-request: simple, debuggable; limited by context switching and memory.
- Event loop (reactor): scalable for I/O; requires non-blocking APIs and careful backpressure.
- Hybrid: small worker pools for CPU-bound tasks off the event loop.

### Practical guidance
- Identify blocking calls (DNS, file I/O, database drivers) and offload to dedicated pools.
- Set explicit pool sizes based on cores and latency targets; avoid infinite queues.
- Prefer structured concurrency primitives to avoid leaks and cancellation bugs.

### Scheduling and performance
- Pin hot workers to cores only with evidence (avoid premature affinity tuning).
- Measure run queue lengths, context switches, CPU steal time in VMs/containers.

### Backpressure and overload control
- Apply admission control (queue limits) and shed excess load gracefully.
- Timeouts and deadlines must be propagated across async boundaries.

### Observability
- Track per-queue wait times, event loop latency, and GC/allocator pauses.
- Expose concurrency metrics: in-flight ops, pending tasks, saturation signals.

### Validation lab
- Build both models (thread-per-request vs event-driven) for an I/O-bound endpoint; saturate with load and compare p95/p99 vs CPU usage and memory footprint.
- Inject blocking calls into the event loop; observe tail latency and fix via offloading.
