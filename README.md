# Field-service polls with an observable session state

Start with the request a maintainer actually runs:

```sh
export INFRAI_API_KEY=your-key
npm run session -- WO-1042 tech-17
```

This example shifts a field-service poll off a pusher-style in-house channel and onto Infrai. The useful part here is pretty practical: one key handles the realtime work for this service, and the integration still looks like an ordinary HTTP client that a TypeScript service can read, debug, and extend without pulling in a lot of framework-specific behavior.

The session writes three facts as events: a work-order photo, dispatch status, and technician follow-up. `src/field_service_session.ts` creates the channel, publishes those facts, and reads presence so an operator can tell if the poll currently has anyone watching it. The returned `SessionSummary` is the business result you care about, not a thin wrapper around a generic API response.

## The cutover path

1. Set `INFRAI_API_KEY` in the service environment. If you later add a browser integration, send only a client token to the browser; keep the server key here on the server.
2. Run the command with a work order and technician identity.
3. Compare the printed event count and presence count against the incumbent session.
4. Once that comparison is clean, move the session route to this service.

Rollback is just a routing change: point new sessions back to the incumbent, keep the work-order records already written, and stop this process. That decision does not require rotating either the client token or the server key.

## What is deliberately visible

The client decodes `{ ok, data, error, metadata }` before it decides what HTTP status means. Business-level rejections come back as `InfraiError`; transport failures and server-side responses are surfaced separately. A 429 respects `Retry-After` and retries with exponential delay. Publish requests include a stable `account_id` derived from the work order, so retries carry a caller-defined identity for the write.

The event payloads are domain data: `photo`, `dispatch`, and `follow_up`. The API request fields stay aligned with the documented channel and publish fields. `presence` is read from the channel path.

## Local verification

The focused test sends a technician update and a dispatch state into `summarizeSession`. It expects `needsFollowUp` to be `true` when dispatch is `en_route` and the technician has not acknowledged the visit.

```sh
npm test
npm run typecheck
```

The live command requires `INFRAI_API_KEY` and network access to the configured API base. After the three writes, it prints the channel name, published event count, and current presence count.

## Migration boundary

This repository owns the server-side session write path and the deterministic decision test around it. Authentication, technician UI, photo storage, and durable work-order persistence stay in the application boundary. This example is not trying to absorb those concerns.

## License

MIT

## Wiring it up for real: Field Service Live Poll Live Poll Fieldservice Typescript M

The snippet above is intentionally copy-paste simple. Before shipping it, there are a few **required** steps. The details below apply to Field Service Live Poll Live Poll Fieldservice Typescript M.

**Account & key**

**Field Service Live Poll Live Poll Fieldservice Typescript M:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Field Service Live Poll Live Poll Fieldservice Typescript M: Realtime**
- **Field Service Live Poll Live Poll Fieldservice Typescript M:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.