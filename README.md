# Full_Stack_Labs

A curated, hands-on learning plan for backend engineering with a focus on protocols, reliability, performance, and production-grade communication patterns. This repo now includes a structured curriculum with self-contained study guides and references.

## Curriculum

Start here:

- Networking Foundations
  - `curriculum/01-networking/00-dns.md`
  - `curriculum/01-networking/01-tcp-udp-tls.md`
  - `curriculum/01-networking/02-https-tls.md`
  - `curriculum/01-networking/03-proxies-and-websocket-proxying.md`
  - `curriculum/01-networking/04-nagle-kernel-queues.md`
  - `curriculum/01-networking/05-chrome-connection-limits.md`
- Datastores: Postgres
  - `curriculum/02-datastores/06-postgres-asynchronous-commits.md`
  - `curriculum/02-datastores/07-postgres-asynchronous-replication.md`
  - `curriculum/02-datastores/08-postgres-pipelining.md`
- Messaging Systems
  - `curriculum/03-messaging/09-rabbitmq-push-api.md`
  - `curriculum/03-messaging/10-kafka-long-polling.md`
- Backend Execution
  - `curriculum/04-backend/11-asynchronous-io-linux-threads.md`
- Security
  - `curriculum/05-security/12-tls-certificates.md`

Each guide includes prerequisites, key concepts, diagrams/mental models, implementation tips, pitfalls, and exercises, and references only materials available in `ref/`.

## References

A focused index of reference materials used by the curriculum is available at:

- `ref/index.md`

## How to Use

1. Follow the curriculum in order; foundations first, then specialization.
2. Do the exercises in each guide; they are designed to build practical intuition.
3. When uncertain, check the corresponding references listed at the bottom of each guide.

## Scope

This plan intentionally prioritizes depth over breadth and is aligned with the reference materials in `ref/backend/`. As you finish the path, extend with service design, caching, observability, and SRE playbooks.
