# Phase 24 - Stable Cloudflare Hostname

## Goal

Move the Private Beta backend from the temporary `trycloudflare` URL to a stable public hostname.

## Final public API

`https://api.poc-engine.lat`

## Tunnel details

- Tunnel name: `poc-engine`
- Tunnel ID: `8ca2afc0-7a05-4e9f-8132-aa7f40df7d0e`
- Tunnel service: `cloudflared.service`
- Status: `active (running)`

## DNS

Cloudflare DNS CNAME created:

- `api.poc-engine.lat -> tunnel`

## Ingress

Ingress configuration on the backend host:

- `api.poc-engine.lat` -> `http://127.0.0.1:80`
- fallback -> `http_status:404`

Nginx remains the local reverse proxy, and it forwards `/private-beta/*` to the backend gateway on `127.0.0.1:8010`.

## Vercel configuration

Set the following environment variable in Vercel:

- `POC_INTELLIGENCE_API_URL=https://api.poc-engine.lat`

That is the only value the frontend needs for the Private Beta gateway in production.

## Validation

### Gateway health

`GET https://api.poc-engine.lat/private-beta/health`

Response:

```json
{
  "database": "reachable",
  "reachable": true,
  "reason": null
}
```

### End-to-end flow

Validated from production:

1. Vercel API route submits a private beta request
2. `api.poc-engine.lat` receives the request
3. backend gateway writes to PostgreSQL
4. admin panel reads the stored requests
5. status transitions from `Pending` to `Approved` through the API

Observed request IDs during validation:

- `860d2637-575f-4c74-b957-4e31e1b546bc`
- `7b43c3e5-f81a-4c18-9737-2182fa88a37f`

## Risks remaining

- Cloudflare Tunnel is now the public ingress layer, so tunnel uptime is the primary external dependency.
- PostgreSQL remains private and should not be exposed directly.
- The frontend must keep `POC_INTELLIGENCE_API_URL` aligned with the hostname above.
