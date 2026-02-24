# APM

## Datadog

Whispr is pre-configured to work with Datadog APM tracing via `dd-trace`. The tracer is auto-initialized at startup using `NODE_OPTIONS="--require dd-trace/init"`.

To enable Datadog tracing, set the following environment variables at runtime:

```
DD_AGENT_HOST=<datadog-agent-host>
DD_TRACE_AGENT_PORT=8126
DD_SERVICE=whispr
DD_ENV=<environment>

# Optional
DD_VERSION=<app-version>
DD_TRACE_SAMPLE_RATE=1.0
```

A Datadog Agent must be running and reachable at the configured host/port to receive traces.
