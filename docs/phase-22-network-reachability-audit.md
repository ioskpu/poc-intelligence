# Phase 22 - Network Reachability Audit

## Goal

Determine where traffic is lost between the public Internet and the Private Beta gateway.

## Server facts

- Local server IP: `192.168.0.212`
- Default gateway: `192.168.0.1`
- Public IP observed from the server: `138.84.53.189`

The server is on a private LAN address. The public address is upstream from the host.

## Runtime placement

- `nginx` listens on `0.0.0.0:80`
- the Private Beta gateway listens on `0.0.0.0:8010`
- the web app listens on `*:3000`
- PostgreSQL listens locally on `0.0.0.0:5432`

`ufw` allows `22/tcp`, `80/tcp`, `3000/tcp`, and `8010/tcp`.

## Route inspection

Route to the public IP from the server:

```text
138.84.53.189 via 192.168.0.1 dev eno1 src 192.168.0.212
```

This confirms the host sends traffic to the LAN gateway for the public IP. The server itself does not own the WAN address.

## Connectivity tests

### Works locally

- `curl http://127.0.0.1/private-beta/health`
- `curl http://192.168.0.212/private-beta/health`

Both return `200` with:

```json
{"database":"reachable","reachable":true,"reason":null}
```

### Fails publicly

- `curl http://138.84.53.189/private-beta/health`
- `curl http://138.84.53.189:8010/private-beta/health`

Both time out from the local environment.

An external fetch attempt through `r.jina.ai` also timed out for both URLs.

## Packet capture

A live `tcpdump` capture on the server during public IP requests did not show a stable WAN-facing HTTP session reaching nginx as a public ingress path.

What is confirmed:

- the backend gateway is healthy locally
- nginx is healthy locally
- PostgreSQL is healthy locally
- the public path does not produce a working response from outside the LAN

## Exact loss point

Traffic loss happens before the application stack becomes reachable from the public address.

More precisely:

- local traffic reaches nginx and the gateway
- public-address traffic does not complete successfully from outside the LAN
- the failure point is the WAN edge: router NAT / port-forward / upstream ISP path

## NAT / CGNAT assessment

Confirmed:

- the server is behind a private LAN interface
- some form of NAT exists between the server and the Internet

Not confirmed:

- CGNAT
- router WAN address visibility
- port-forward rules on the router

Without router access, CGNAT cannot be proven or ruled out definitively.

## Router / forwarding hypotheses

Most likely causes:

1. missing port-forward from router WAN `80` to `192.168.0.212:80`
2. missing port-forward from router WAN `8010` to `192.168.0.212:8010`
3. ISP-side CGNAT or upstream filtering
4. router firewall / NAT reflection limitations

## Cloudflare Tunnel evaluation

### Advantages

- no need to expose PostgreSQL
- no need to open inbound ports on the router
- no dependency on public IP stability
- easier for Vercel to reach the gateway over HTTPS
- works even if the ISP uses CGNAT

### Disadvantages

- adds a third-party dependency
- requires Cloudflare account and tunnel management
- introduces operational coupling outside the local network
- not as simple as a direct port-forward when you fully control the network

### Steps required

1. install `cloudflared` on the Linux server
2. authenticate the tunnel to the Cloudflare account
3. create a tunnel for the Private Beta API
4. map a public hostname to the local gateway on `127.0.0.1:8010`
5. point `POC_INTELLIGENCE_API_URL` in Vercel to the tunnel hostname
6. validate `/private-beta/health`, request submission, and admin workflow

## Recommendation

Recommended path: **Cloudflare Tunnel**

Reason:

- it avoids exposing PostgreSQL
- it avoids router dependency
- it is the fastest reliable path if WAN reachability cannot be fixed from the router side

If direct network control over the router becomes available later, port forwarding is still a valid fallback. Based on the current evidence, Cloudflare Tunnel is the safer and more deterministic option.
