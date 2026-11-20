# AetherMesh — Distributed Service Mesh & Trace Observatory (`ts-distributed-mesh-observatory`)

An interactive distributed systems observability studio built with **React, TypeScript, Vite, and Tailwind CSS** for visualizing microservice topologies, distributed trace waterfalls, Envoy circuit breakers, and chaos fault injection.

## Architecture & Modules
- **Interactive SVG Topology Map (`TopologyCanvas.tsx`):** Visualizes 6 microservices across `edge`, `core`, `data`, and `async` tiers with real-time gRPC, HTTP/2, TCP, and Kafka edge latencies.
- **Distributed Trace Waterfall (`TraceWaterfallView.tsx`):** Renders multi-span request timelines with proportional offset bars, status indicators, and OpenTelemetry-style span tags.
- **Circuit Breaker Matrix (`CircuitBreakerMatrix.tsx`):** Allows immediate `CLOSED`, `HALF_OPEN`, and `OPEN` fault isolation across cluster workloads.
- **Chaos & Load Lab (`ChaosLabPanel.tsx` & `SlaBurnRateCard.tsx`):** Injects ingress RPS multipliers, artificial latency, and packet loss while forecasting 30-day SLO error budget burn rates.

## Local Development
```bash
npm install
npm run dev
```
