# Nagle's Algorithm and Kernel Queues

## Overview
Small writes can drastically hurt latency and throughput. Understanding Nagle, delayed ACKs, and Linux networking queues helps you tune servers under load.

## Nagle and delayed ACKs
- Nagle aggregates small writes until ACK or buffer fills
- Delayed ACKs wait briefly before acknowledging small segments
- Interaction can produce latency spikes for chatty protocols

## Strategies
- Batch writes at application layer
- Disable Nagle (`TCP_NODELAY`) when batching isn’t feasible and latency is critical
- Use write coalescing and buffering in clients/servers

## Linux networking queues
- Listen backlog vs accept queue; SYN backlog
- epoll/reactor pattern for high concurrency
- Monitor drops on full queues; tune `somaxconn`, backlog, RCV/SND buffers

## Pitfalls
- Disabling Nagle everywhere leads to tiny-packet overhead
- Too-small backlogs cause connection resets under bursts
- Blocking calls in event loop stall all connections

## Labs
- Compare latency/throughput with batching vs `TCP_NODELAY`
- Load test server; monitor backlog metrics and tune limits
- Instrument epoll/reactor server and measure context switches

## References
- `ref/backend/Nagle's+algorithm.pdf`
- `ref/backend/kernel+queues.pdf`
