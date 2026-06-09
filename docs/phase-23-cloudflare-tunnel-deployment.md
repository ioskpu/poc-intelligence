# Phase 23 - Cloudflare Tunnel Deployment

## Goal

Expose the Private Beta backend through Cloudflare Tunnel without opening PostgreSQL or relying on router NAT / port forwarding.

## What was installed

- `cloudflared` installed on the Linux backend server
- `cloudflared.service` enabled via systemd
- the service is active and connected to Cloudflare

## Backend placement

- Nginx remains the local reverse proxy
- the Private Beta gateway remains local on `127.0.0.1:8010`
- PostgreSQL remains private on the Linux host
- Cloudflare Tunnel is the public ingress path

## Service status

Observed service state:

- `cloudflared.service` is `active (running)`
- tunnel connections were registered successfully
- Cloudflare prechecks passed for DNS, QUIC, HTTP/2, and API reachability

## Public validation

A temporary quick tunnel was created for validation:

`https://mistress-conservative-compile-compilation.trycloudflare.com`

Validated from the public Internet:

- `GET /private-beta/health` returned `200`
- response body confirmed database reachability:

```json
{"database":"reachable","reachable":true,"reason":null}
```

The temporary tunnel also successfully proxied the homepage through nginx.

## Current blocker

The requested stable hostname `api.poc-intelligence.com` cannot be finalized yet because no Cloudflare-managed domain is available in the account.

Without a domain / DNS zone:

- there is no place to create the public hostname record
- `POC_INTELLIGENCE_API_URL` cannot be set to a stable custom hostname

## Recovery / next steps

To finish the stable deployment:

1. add a domain to the Cloudflare account, or provide an existing domain already managed in Cloudflare
2. map `api.poc-intelligence.com` to the tunnel
3. set `POC_INTELLIGENCE_API_URL` in Vercel to the public API hostname
4. validate:
   - waitlist submission
   - admin reads
   - approve / reject workflow
   - `GET /private-beta/health`

## Troubleshooting notes

- If the service stops, restart it with `systemctl restart cloudflared`
- If the tunnel disconnects, inspect `journalctl -u cloudflared`
- If the hostname does not resolve, verify the Cloudflare DNS / public hostname configuration
- PostgreSQL should remain private; do not expose port `5432`

## Security summary

- PostgreSQL is still private
- nginx stays local
- the public surface is limited to the tunnel
- no router port forwarding was required
- the current quick tunnel is suitable for validation only, not stable production
