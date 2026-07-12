# Worker Architecture & Internals

This document delves into the internal architecture of Cloudflare Workers, exploring how requests are processed, how the runtime manages resources, and the underlying mechanisms that enable serverless edge computing.

### V8

Google's open-source JavaScript engine. It is the software component that takes human-readable JavaScript code and converts it into native machine code for the computer execute.

### V8 Isolate

An isolate is a `sandbox` instance with its own heap memory, garbage collector, and JavaScript context. It runs inside a single `V8` engine process, not as a separate process. `One V8 process can host thousands of isolates`.

- Heap Memory
- Garbage Collector
- JS Context
- Call Stack

### Cloudflare worker deploy pipeline

- Step 1: pnpm run deploy 
- Step 2: Bundle TS/JS code 
- Step 3: 
  - Auth Check
  - Script Validation
  - Service Binding
  - Generate Metadata
  - Version Id
- Step 4:
  - Broadcast
  - New version to all data centers (via internal control plane)

### Request & Response Lifecycle