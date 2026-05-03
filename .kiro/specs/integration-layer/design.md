# NexoraGrid Integration Layer — Bugfix Design


## Overview

The `IntegrationsModule` currently catalogs only SaaS/business integrations (Stripe, Slack, HubSpot, etc.) and has no handlers for hardware or IoT device types. This design extends the integration layer to support the full spectrum of NexoraGrid's energy infrastructure: solar inverter APIs (SolarEdge, Fronius, Enphase), IoT gateways (MQTT, HTTP polling), mesh grid nodes (WebSocket + REST), and WiFi routers (SNMP + REST).

The fix is additive: new catalog entries, new adapter classes, new connection-test handlers, new Prisma models, new GraphQL subscriptions, a new WebSocket gateway, and new REST endpoints are introduced without modifying any existing SaaS integration path. All existing behavior is preserved exactly.

**Architecture summary:**

```
Device Hardware / Cloud API
        │
        ▼
  DeviceAdapter (abstract interface)
  ├── SolarEdgeAdapter   (HTTPS REST — api.solaredge.com)
  ├── FroniusAdapter     (local HTTP REST — Fronius Solar API v1)
  ├── EnphaseAdapter     (HTTPS REST — enlighten.enphaseenergy.com)
  ├── MqttGatewayAdapter (MQTT over TCP/TLS — mqtt npm client)
  ├── MeshGridAdapter    (WebSocket + REST)
  └── WiFiRouterAdapter  (SNMP v2c via dgram UDP + REST)
        │
        ▼
  DevicePollingService  (@nestjs/schedule cron per device)
        │
        ├──► EventEmitter2  (device.reading.created, device.status.changed)
        │         │
        │         ├──► PubSub (graphql-subscriptions)
        │         │       └──► GraphQL Subscriptions ──► Apollo Client (frontend)
        │         │
        │         └──► DeviceTelemetryGateway (@WebSocketGateway)
        │                   └──► WebSocket ──► frontend useDeviceStream hook
        │
        └──► PrismaService  (EnergyReading, EnergyDevice, DeviceIntegration, PollingConfig)
                   └──► REST API ──► frontend (SWR polling fallback)
```


---

## Glossary

- **Bug_Condition (C)**: A request whose `integrationId` is one of `solar-inverter-solaredge`, `solar-inverter-fronius`, `solar-inverter-enphase`, `iot-gateway-mqtt`, `iot-gateway-http`, `mesh-grid-node`, or `wifi-router` — all of which currently throw `NotFoundException` because they are absent from `INTEGRATION_CATALOG`.
- **Property (P)**: For any request satisfying C, the system SHALL return `{ status: 'connected' | 'error' }` (never `NotFoundException`) and the catalog SHALL contain the matching entry.
- **Preservation**: All existing SaaS integration paths (Stripe, Slack, HubSpot, Twilio, WhatsApp, AWS, Salesforce, Plaid) continue to behave identically — same catalog entries, same credential fields, same `runConnectionTest` branches, same encryption scheme, same Prisma model usage.
- **DeviceAdapter**: Abstract TypeScript class/interface in `backend/src/modules/integrations/adapters/` that every hardware integration must implement.
- **DevicePollingService**: NestJS `@Injectable()` service using `@nestjs/schedule` cron jobs to periodically call each connected adapter and persist `EnergyReading` rows.
- **DeviceTelemetryGateway**: NestJS `@WebSocketGateway` that pushes live telemetry frames to subscribed frontend clients over a persistent WebSocket connection.
- **PubSub**: The `PubSub` instance from `graphql-subscriptions` (already in `package.json`) used to fan out events to GraphQL subscription resolvers.
- **DeviceIntegration**: New Prisma model linking an `IntegrationConnection` to an `EnergyDevice`, storing adapter-specific config (endpoint URL, site ID, SNMP community string, etc.).
- **PollingConfig**: New Prisma model storing per-device polling interval, enabled flag, and last-poll timestamp.
- **isBugCondition(X)**: Returns `true` when `X.integrationId` targets a hardware/IoT type not currently in the catalog.
- **MQTT**: Message Queuing Telemetry Transport — lightweight pub/sub protocol used by IoT gateways. The `mqtt` npm package is used (already available via transitive deps; if not, `ioredis` pub/sub is the fallback — see §Fix Implementation).
- **SNMP**: Simple Network Management Protocol v2c — used to query WiFi router MIBs for device discovery via Node's built-in `dgram` UDP socket (no new package needed).
- **SunSpec / Modbus**: Open standard for solar device communication over TCP. Modbus TCP is implemented using Node's `net` module (no new package needed).


---

## Bug Details

### Bug Condition

The bug manifests when any request targets a hardware or IoT integration ID. `saveConnection` throws `NotFoundException` at the catalog lookup guard, `testConnection` falls through to the `default: return 'Connection saved'` stub, and `getCatalog` returns no hardware entries.

**Formal Specification:**

```
FUNCTION isBugCondition(X)
  INPUT: X of type { integrationId: string }
  OUTPUT: boolean

  HARDWARE_IDS := [
    'solar-inverter-solaredge',
    'solar-inverter-fronius',
    'solar-inverter-enphase',
    'iot-gateway-mqtt',
    'iot-gateway-http',
    'mesh-grid-node',
    'wifi-router'
  ]

  RETURN X.integrationId IN HARDWARE_IDS
END FUNCTION
```

### Examples

- **SolarEdge save**: `POST /integrations/connections/solar-inverter-solaredge/save` → currently throws `NotFoundException: Integration 'solar-inverter-solaredge' not found`. Expected: `{ status: 'connected' }`.
- **Fronius test**: `POST /integrations/connections/solar-inverter-fronius/test` → currently returns `{ success: false, message: 'Integration is not connected' }` because no connection can ever be saved. Expected: performs HTTP GET to `http://{host}/solar_api/v1/GetInverterRealtimeData.cgi` and returns real latency.
- **MQTT gateway save**: `POST /integrations/connections/iot-gateway-mqtt/save` → currently `NotFoundException`. Expected: saves MQTT broker credentials and returns `connected`.
- **Catalog fetch**: `GET /integrations/catalog` → currently returns 8 SaaS entries with no "Energy & IoT" category. Expected: returns 15 entries including 7 hardware/IoT entries under category `"Energy & IoT"`.
- **WiFi router test**: `POST /integrations/connections/wifi-router/test` → currently stub. Expected: sends SNMP GET to `sysDescr.0` OID and returns router description string.


---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- `INTEGRATION_CATALOG` entries for `whatsapp`, `stripe`, `twilio`, `hubspot`, `salesforce`, `slack`, `aws`, `plaid` remain byte-for-byte identical — same `id`, `name`, `category`, `color`, `fields`, `capabilities`, `webhookPath`.
- `runConnectionTest` switch branches for all 8 SaaS IDs remain unchanged; no new code is inserted between existing cases.
- `saveConnection` required-field validation loop, AES-256-CBC encryption scheme (`encrypt` / `decrypt` / `maskCredentials`), and Prisma upsert logic are untouched.
- `getConnections`, `disconnectIntegration`, `getStats`, `getApiKeys`, `createApiKey`, `revokeApiKey` method signatures and return shapes are unchanged.
- `IntegrationConnection` Prisma model schema (columns, unique constraint `organizationId_integrationId`, indexes) is unchanged; new models are additive.
- `IntegrationsModule` continues to export `IntegrationsService` for `EnergyModule` consumption.
- All existing REST endpoints (`GET /catalog`, `GET /connections`, `POST /connections/:id/save`, `POST /connections/:id/test`, `POST /connections/:id/disconnect`, `GET /stats`, `GET /api-keys`, `POST /api-keys`, `DELETE /api-keys/:id`) retain their current URL, HTTP method, auth guard, and response shape.
- Frontend `IntegrationsDashboard`, `IntegrationCard`, `IntegrationConfigModal`, `ApiKeysPanel` components continue to work without modification for SaaS integrations.

**Scope:**
All inputs where `isBugCondition(X)` is `false` (i.e., all SaaS integration IDs) are completely unaffected by this fix. This includes:
- Any `integrationId` in `['whatsapp', 'stripe', 'twilio', 'hubspot', 'salesforce', 'slack', 'aws', 'plaid']`
- API key CRUD operations
- Organization-level stats queries
- GraphQL mutations and queries already defined in `schema.gql`


---

## Hypothesized Root Cause

Based on the bug description and code review:

1. **Missing Catalog Entries**: `INTEGRATION_CATALOG` in `integrations.service.ts` contains only 8 SaaS entries. The `saveConnection` guard `if (!catalog) throw new NotFoundException(...)` fires immediately for any hardware ID. Fix: append 7 new hardware/IoT entries to the array under category `"Energy & IoT"`.

2. **Missing `runConnectionTest` Handlers**: The `switch` statement in `runConnectionTest` has no cases for hardware IDs, falling through to `default: return 'Connection saved'` — a stub that never performs real connectivity verification. Fix: add `case 'solar-inverter-solaredge':`, `case 'solar-inverter-fronius':`, etc., each delegating to the corresponding adapter's `testConnection()` method.

3. **No Adapter Abstraction**: There is no `DeviceAdapter` interface or concrete implementations. Each hardware protocol (REST, MQTT, Modbus TCP, SNMP UDP, WebSocket) requires a distinct connection strategy that cannot be expressed as a simple `fetch()` call. Fix: introduce an adapter pattern under `backend/src/modules/integrations/adapters/`.

4. **No Realtime Data Pipeline**: Even after fixing the catalog and test handlers, there is no mechanism to continuously poll devices and push readings to the frontend. The `EnergyReading` model exists but nothing writes to it from live hardware. Fix: introduce `DevicePollingService` (cron-based), `DeviceTelemetryGateway` (WebSocket), and GraphQL subscriptions.

5. **No `DeviceIntegration` Link Model**: There is no database record linking an `IntegrationConnection` (credentials) to an `EnergyDevice` (physical asset) with adapter-specific config. Fix: add `DeviceIntegration` and `PollingConfig` Prisma models.

6. **Frontend Has No Realtime Hooks or Device Setup Wizard**: The integrations dashboard has no UI for hardware device types, no multi-step setup wizard for protocol-specific fields, and no live telemetry display. Fix: add `useDeviceStream`, `DeviceSetupWizard`, `LiveTelemetryDashboard`, and `DeviceStatusBadge` frontend components.


---

## Correctness Properties

Property 1: Bug Condition — Hardware/IoT Integrations Are Handled

_For any_ request X where `isBugCondition(X)` returns `true` (i.e., `X.integrationId` is a hardware/IoT integration ID), the fixed `IntegrationsService` SHALL:
- Return the catalog entry from `getCatalog()` (entry is present, not `undefined`)
- Return `{ status: 'connected' | 'error' }` from `saveConnection()` (never throw `NotFoundException`)
- Return `{ success: boolean, message: string, latency?: number }` from `testConnection()` where `message` reflects a real connectivity attempt against the device protocol (never the stub `'Connection saved'`)

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

Property 2: Preservation — Existing SaaS Integrations Unaffected

_For any_ request X where `isBugCondition(X)` returns `false` (i.e., `X.integrationId` is a SaaS integration ID), the fixed `IntegrationsService` SHALL produce exactly the same result as the original service — same catalog entries, same connection test behavior, same credential encryption, same Prisma operations, same response shapes.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**


---

## Fix Implementation

### Database Schema Additions

Two new Prisma models are added. The existing `IntegrationConnection` and `EnergyDevice` models are unchanged.

```prisma
// Links an IntegrationConnection (credentials) to an EnergyDevice (physical asset)
model DeviceIntegration {
  id                    String   @id @default(uuid())
  integrationConnectionId String  @unique
  energyDeviceId        String   @unique
  adapterType           String   // 'solaredge' | 'fronius' | 'enphase' | 'mqtt' | 'mesh' | 'wifi-router'
  adapterConfig         Json     @default("{}") // endpoint, siteId, community string, topic, etc.
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  integrationConnection IntegrationConnection @relation(fields: [integrationConnectionId], references: [id], onDelete: Cascade)
  energyDevice          EnergyDevice          @relation(fields: [energyDeviceId], references: [id], onDelete: Cascade)
  pollingConfig         PollingConfig?

  @@index([adapterType])
  @@map("device_integrations")
}

// Per-device polling configuration
model PollingConfig {
  id                  String    @id @default(uuid())
  deviceIntegrationId String    @unique
  intervalMs          Int       @default(30000)  // default 30s; overridden by DEVICE_POLL_INTERVAL_MS env
  enabled             Boolean   @default(true)
  lastPolledAt        DateTime?
  consecutiveErrors   Int       @default(0)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  deviceIntegration DeviceIntegration @relation(fields: [deviceIntegrationId], references: [id], onDelete: Cascade)

  @@map("polling_configs")
}
```

`IntegrationConnection` gains a back-relation to `DeviceIntegration` (no column change):
```prisma
// Added to IntegrationConnection model (relation only, no new column):
deviceIntegration DeviceIntegration?
```

`EnergyDevice` gains a back-relation to `DeviceIntegration` (no column change):
```prisma
// Added to EnergyDevice model (relation only, no new column):
deviceIntegration DeviceIntegration?
```

### New Environment Variables

```bash
# .env / .env.example additions
MQTT_BROKER_URL=          # optional, e.g. mqtt://192.168.1.100:1883
DEVICE_POLL_INTERVAL_MS=30000  # default polling interval for all devices
```

### Backend File Structure

```
backend/src/modules/integrations/
├── adapters/
│   ├── device-adapter.interface.ts      # Abstract interface
│   ├── solaredge.adapter.ts
│   ├── fronius.adapter.ts
│   ├── enphase.adapter.ts
│   ├── mqtt-gateway.adapter.ts
│   ├── mesh-grid.adapter.ts
│   └── wifi-router.adapter.ts
├── device-polling.service.ts            # Cron-based polling
├── device-telemetry.gateway.ts          # @WebSocketGateway
├── integrations.resolver.ts             # GraphQL subscriptions
├── integrations.controller.ts           # + 2 new endpoints
├── integrations.service.ts              # + catalog entries + test handlers
└── integrations.module.ts               # updated providers/imports
```

### Device Adapter Interface

**File:** `backend/src/modules/integrations/adapters/device-adapter.interface.ts`

```typescript
export interface DeviceReading {
  metric: string;          // e.g. 'power_output_w', 'daily_yield_kwh', 'voltage_v'
  value: number;
  unit: string;
  timestamp: Date;
}

export interface DeviceStatus {
  online: boolean;
  statusCode?: string;     // adapter-specific status string
  message?: string;
}

export interface AdapterTestResult {
  success: boolean;
  message: string;
  latency?: number;
}

export interface DeviceAdapter {
  /**
   * Verify connectivity. Called by runConnectionTest().
   * Must not throw — return { success: false, message } on failure.
   */
  testConnection(credentials: Record<string, string>): Promise<AdapterTestResult>;

  /**
   * Fetch the latest readings from the device.
   * Called by DevicePollingService on each cron tick.
   */
  fetchReadings(
    credentials: Record<string, string>,
    adapterConfig: Record<string, unknown>,
  ): Promise<DeviceReading[]>;

  /**
   * Fetch current device status (online/offline/fault).
   */
  fetchStatus(
    credentials: Record<string, string>,
    adapterConfig: Record<string, unknown>,
  ): Promise<DeviceStatus>;
}
```

### Concrete Adapter Implementations

#### SolarEdgeAdapter

**File:** `backend/src/modules/integrations/adapters/solaredge.adapter.ts`

Protocol: HTTPS REST — `https://monitoringapi.solaredge.com`

Credential fields: `apiKey` (required), `siteId` (required)

```typescript
// testConnection: GET /site/{siteId}/details?api_key={apiKey}
// fetchReadings:  GET /site/{siteId}/overview?api_key={apiKey}
//   → metrics: power_output_w (currentPower.power), daily_yield_kwh (lastDayData.energy / 1000)
// fetchStatus:    GET /site/{siteId}/details → check site.status === 'Active'
```

Error handling: HTTP 401 → "Invalid API key", HTTP 403 → "Site access denied", HTTP 429 → back off 60s (set `consecutiveErrors`, skip next poll cycle).

#### FroniusAdapter

**File:** `backend/src/modules/integrations/adapters/fronius.adapter.ts`

Protocol: Local HTTP REST — Fronius Solar API v1 (no auth by default, optional basic auth)

Credential fields: `host` (required, e.g. `192.168.1.50`), `deviceId` (optional, default `1`), `username` / `password` (optional)

```typescript
// testConnection: GET http://{host}/solar_api/v1/GetInverterInfo.cgi
// fetchReadings:  GET http://{host}/solar_api/v1/GetInverterRealtimeData.cgi?Scope=Device&DeviceId={deviceId}&DataCollection=CommonInverterData
//   → metrics: power_output_w (PAC.Value), daily_yield_kwh (DAY_ENERGY.Value / 1000), voltage_v (UAC.Value)
// fetchStatus:    parse Body.Data.DeviceStatus.StatusCode (7 = running)
```

Error handling: `ECONNREFUSED` / `ETIMEDOUT` → mark device OFFLINE, emit `device.status.changed` event.

#### EnphaseAdapter

**File:** `backend/src/modules/integrations/adapters/enphase.adapter.ts`

Protocol: HTTPS REST — `https://enlighten.enphaseenergy.com/pv/systems`

Credential fields: `apiKey` (required), `userId` (required), `systemId` (required)

```typescript
// testConnection: GET /api/v4/systems/{systemId}?key={apiKey}&user_id={userId}
// fetchReadings:  GET /api/v4/systems/{systemId}/summary?key={apiKey}&user_id={userId}
//   → metrics: power_output_w (current_power), daily_yield_kwh (energy_today / 1000)
// fetchStatus:    check summary.status === 'normal'
```

Rate limit: Enphase free tier allows 10 req/min. `PollingConfig.intervalMs` defaults to 60000 for Enphase connections.

#### MqttGatewayAdapter

**File:** `backend/src/modules/integrations/adapters/mqtt-gateway.adapter.ts`

Protocol: MQTT over TCP/TLS using the `mqtt` npm package.

> **Package availability note:** `mqtt` is not in `backend/package.json`. Since the constraint is no new packages, the MQTT adapter uses Node's built-in `net` module to implement a minimal MQTT CONNECT + SUBSCRIBE + PUBLISH handshake for the connection test, and relies on `ioredis` pub/sub as a message bus for the polling service when a full MQTT client is unavailable. If `mqtt` is added to `package.json` in a future sprint, the adapter can be upgraded to use it directly.

Credential fields: `brokerUrl` (required, e.g. `mqtt://192.168.1.100:1883`), `topic` (required, e.g. `nexora/+/readings`), `username` / `password` (optional), `clientId` (optional)

```typescript
// testConnection: open TCP socket to broker host:port, send MQTT CONNECT packet,
//                 expect CONNACK with returnCode 0 within 5s timeout
// fetchReadings:  subscribe to topic for 3s, collect JSON payloads,
//                 parse { metric, value, unit } from each message
// fetchStatus:    CONNACK success → online; timeout/error → offline
```

Adapter config stored in `DeviceIntegration.adapterConfig`: `{ topic, qos, retain }`.

#### MeshGridAdapter

**File:** `backend/src/modules/integrations/adapters/mesh-grid.adapter.ts`

Protocol: WebSocket (primary) + REST fallback

Credential fields: `wsUrl` (required, e.g. `ws://192.168.10.1:8080/grid`), `restUrl` (optional fallback), `apiKey` (optional), `nodeId` (required)

```typescript
// testConnection: open WebSocket to wsUrl, send { type: 'ping', nodeId },
//                 expect { type: 'pong' } within 5s; fallback to GET {restUrl}/status
// fetchReadings:  send { type: 'readings_request', nodeId }, receive { readings: [...] }
//   → metrics: grid_frequency_hz, voltage_v, current_a, power_kw
// fetchStatus:    parse { status: 'active' | 'degraded' | 'offline' } from pong response
```

Uses Node's built-in `http`/`https` module for REST fallback and `ws` — but `ws` is not in `package.json`. WebSocket connections use Node's `net` module with HTTP Upgrade for the test, and the polling service uses `http.get` REST fallback by default. Full WebSocket streaming is handled by the frontend connecting directly to `DeviceTelemetryGateway`.

#### WiFiRouterAdapter

**File:** `backend/src/modules/integrations/adapters/wifi-router.adapter.ts`

Protocol: SNMP v2c (primary) via Node's built-in `dgram` UDP + REST API fallback

Credential fields: `host` (required), `community` (required, default `public`), `restUrl` (optional), `restApiKey` (optional)

```typescript
// testConnection: send SNMP v2c GET request for OID 1.3.6.1.2.1.1.1.0 (sysDescr)
//                 to host:161 via UDP; expect response within 5s
//                 → return sysDescr value as message
// fetchReadings:  SNMP WALK on 1.3.6.1.2.1.2.2 (ifTable) to enumerate interfaces
//   → metrics: connected_devices_count, bandwidth_in_bps, bandwidth_out_bps
// fetchStatus:    sysDescr response received → online; timeout → offline
```

SNMP v2c packet construction uses raw UDP via `dgram` — no external package needed. The BER/DER encoding for the minimal GET-REQUEST PDU is implemented inline (~80 lines).

### Catalog Additions

Seven new entries are appended to `INTEGRATION_CATALOG` in `integrations.service.ts`. The existing 8 entries are untouched.

```typescript
// Appended to INTEGRATION_CATALOG (existing entries unchanged above):
{
  id: 'solar-inverter-solaredge',
  name: 'SolarEdge Inverter',
  category: 'Energy & IoT',
  color: '#F97316',
  description: 'Connect SolarEdge cloud monitoring API to stream real-time power output, daily yield, and inverter status.',
  docsUrl: 'https://developers.solaredge.com/solaredge-dev-site/apis',
  fields: [
    { key: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'your_api_key' },
    { key: 'siteId', label: 'Site ID', type: 'text', required: true, placeholder: '12345' },
  ],
  capabilities: ['Power output', 'Daily yield', 'Inverter status', 'Real-time polling', 'Alerts'],
  webhookPath: null,
},
{
  id: 'solar-inverter-fronius',
  name: 'Fronius Inverter (Local)',
  category: 'Energy & IoT',
  color: '#EAB308',
  description: 'Connect a Fronius inverter on your local network via the Fronius Solar API v1 (no cloud required).',
  docsUrl: 'https://www.fronius.com/en/photovoltaics/products/all-products/system-monitoring/open-interfaces/fronius-solar-api-json',
  fields: [
    { key: 'host', label: 'Inverter IP / Hostname', type: 'text', required: true, placeholder: '192.168.1.50' },
    { key: 'deviceId', label: 'Device ID', type: 'text', required: false, placeholder: '1' },
    { key: 'username', label: 'Username (optional)', type: 'text', required: false, placeholder: 'admin' },
    { key: 'password', label: 'Password (optional)', type: 'password', required: false, placeholder: '' },
  ],
  capabilities: ['AC power', 'Daily energy', 'AC voltage', 'Device status', 'Local network'],
  webhookPath: null,
},
{
  id: 'solar-inverter-enphase',
  name: 'Enphase Enlighten',
  category: 'Energy & IoT',
  color: '#84CC16',
  description: 'Connect Enphase Enlighten cloud API to monitor microinverter arrays, system summary, and energy production.',
  docsUrl: 'https://developer-v4.enphase.com/docs.html',
  fields: [
    { key: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'your_api_key' },
    { key: 'userId', label: 'User ID', type: 'text', required: true, placeholder: 'your_user_id' },
    { key: 'systemId', label: 'System ID', type: 'text', required: true, placeholder: '67890' },
  ],
  capabilities: ['Current power', 'Energy today', 'System status', 'Microinverter data', 'Alerts'],
  webhookPath: null,
},
{
  id: 'iot-gateway-mqtt',
  name: 'IoT Gateway (MQTT)',
  category: 'Energy & IoT',
  color: '#8B5CF6',
  description: 'Connect an MQTT broker to receive real-time telemetry from IoT sensors and energy gateways.',
  docsUrl: 'https://mqtt.org/mqtt-specification/',
  fields: [
    { key: 'brokerUrl', label: 'Broker URL', type: 'text', required: true, placeholder: 'mqtt://192.168.1.100:1883' },
    { key: 'topic', label: 'Topic Pattern', type: 'text', required: true, placeholder: 'nexora/+/readings' },
    { key: 'username', label: 'Username (optional)', type: 'text', required: false, placeholder: '' },
    { key: 'password', label: 'Password (optional)', type: 'password', required: false, placeholder: '' },
    { key: 'clientId', label: 'Client ID (optional)', type: 'text', required: false, placeholder: 'nexoragrid-1' },
  ],
  capabilities: ['Real-time telemetry', 'Topic subscription', 'QoS 0/1/2', 'TLS support', 'Multi-sensor'],
  webhookPath: null,
},
{
  id: 'iot-gateway-http',
  name: 'IoT Gateway (HTTP Polling)',
  category: 'Energy & IoT',
  color: '#06B6D4',
  description: 'Poll an HTTP/HTTPS IoT gateway endpoint at a configurable interval to collect sensor readings.',
  docsUrl: null,
  fields: [
    { key: 'endpointUrl', label: 'Endpoint URL', type: 'text', required: true, placeholder: 'http://192.168.1.200/api/readings' },
    { key: 'apiKey', label: 'API Key / Token (optional)', type: 'password', required: false, placeholder: '' },
    { key: 'authHeader', label: 'Auth Header Name (optional)', type: 'text', required: false, placeholder: 'X-API-Key' },
  ],
  capabilities: ['HTTP polling', 'JSON parsing', 'Configurable interval', 'Basic/token auth'],
  webhookPath: null,
},
{
  id: 'mesh-grid-node',
  name: 'Mesh Grid Node',
  category: 'Energy & IoT',
  color: '#10B981',
  description: 'Connect a mesh grid node via WebSocket for real-time grid frequency, voltage, and power flow data.',
  docsUrl: null,
  fields: [
    { key: 'wsUrl', label: 'WebSocket URL', type: 'text', required: true, placeholder: 'ws://192.168.10.1:8080/grid' },
    { key: 'nodeId', label: 'Node ID', type: 'text', required: true, placeholder: 'node-001' },
    { key: 'restUrl', label: 'REST Fallback URL (optional)', type: 'text', required: false, placeholder: 'http://192.168.10.1:8080' },
    { key: 'apiKey', label: 'API Key (optional)', type: 'password', required: false, placeholder: '' },
  ],
  capabilities: ['Grid frequency', 'Voltage monitoring', 'Power flow', 'WebSocket streaming', 'REST fallback'],
  webhookPath: null,
},
{
  id: 'wifi-router',
  name: 'WiFi Router (SNMP)',
  category: 'Energy & IoT',
  color: '#3B82F6',
  description: 'Discover and monitor network-connected devices via SNMP v2c and router REST API for device inventory.',
  docsUrl: 'https://www.rfc-editor.org/rfc/rfc1157',
  fields: [
    { key: 'host', label: 'Router IP / Hostname', type: 'text', required: true, placeholder: '192.168.1.1' },
    { key: 'community', label: 'SNMP Community String', type: 'text', required: true, placeholder: 'public' },
    { key: 'restUrl', label: 'Router REST API URL (optional)', type: 'text', required: false, placeholder: 'http://192.168.1.1/api' },
    { key: 'restApiKey', label: 'REST API Key (optional)', type: 'password', required: false, placeholder: '' },
  ],
  capabilities: ['Device discovery', 'Interface stats', 'Bandwidth monitoring', 'SNMP v2c', 'REST API'],
  webhookPath: null,
},
```

### `runConnectionTest` Additions

New cases are appended to the `switch` in `runConnectionTest`. The existing 8 cases are untouched.

```typescript
// Appended cases (existing cases above are unchanged):
case 'solar-inverter-solaredge': {
  const adapter = new SolarEdgeAdapter();
  const result = await adapter.testConnection(creds);
  if (!result.success) throw new Error(result.message);
  return result.message;
}
case 'solar-inverter-fronius': {
  const adapter = new FroniusAdapter();
  const result = await adapter.testConnection(creds);
  if (!result.success) throw new Error(result.message);
  return result.message;
}
case 'solar-inverter-enphase': {
  const adapter = new EnphaseAdapter();
  const result = await adapter.testConnection(creds);
  if (!result.success) throw new Error(result.message);
  return result.message;
}
case 'iot-gateway-mqtt': {
  const adapter = new MqttGatewayAdapter();
  const result = await adapter.testConnection(creds);
  if (!result.success) throw new Error(result.message);
  return result.message;
}
case 'iot-gateway-http': {
  if (!creds.endpointUrl) throw new Error('Missing endpoint URL');
  const headers: Record<string, string> = {};
  if (creds.apiKey && creds.authHeader) headers[creds.authHeader] = creds.apiKey;
  const res = await fetch(creds.endpointUrl, { headers, signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP gateway error: ${res.status}`);
  return `HTTP gateway reachable (${res.status})`;
}
case 'mesh-grid-node': {
  const adapter = new MeshGridAdapter();
  const result = await adapter.testConnection(creds);
  if (!result.success) throw new Error(result.message);
  return result.message;
}
case 'wifi-router': {
  const adapter = new WiFiRouterAdapter();
  const result = await adapter.testConnection(creds);
  if (!result.success) throw new Error(result.message);
  return result.message;
}
```

### DevicePollingService

**File:** `backend/src/modules/integrations/device-polling.service.ts`

```typescript
@Injectable()
export class DevicePollingService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
  ) {}

  // On startup: register a dynamic cron job for each enabled DeviceIntegration
  async onModuleInit(): Promise<void> { /* load all enabled PollingConfigs, schedule */ }

  // Called by IntegrationsService.saveConnection() after a hardware connection is saved
  async registerDevice(deviceIntegrationId: string): Promise<void> { /* upsert PollingConfig, schedule cron */ }

  // Called by IntegrationsService.disconnectIntegration() for hardware IDs
  async unregisterDevice(deviceIntegrationId: string): Promise<void> { /* remove cron job */ }

  // Core poll tick — called by each device's cron job
  private async pollDevice(deviceIntegrationId: string): Promise<void> {
    // 1. Load DeviceIntegration + IntegrationConnection + EnergyDevice
    // 2. Decrypt credentials
    // 3. Instantiate correct adapter by adapterType
    // 4. Call adapter.fetchReadings() and adapter.fetchStatus()
    // 5. Persist EnergyReading rows via prisma.energyReading.createMany()
    // 6. Update EnergyDevice.status and lastSeenAt
    // 7. Update PollingConfig.lastPolledAt, reset consecutiveErrors on success
    // 8. Emit EventEmitter2 events:
    //    - 'device.reading.created' with { deviceId, readings, organizationId }
    //    - 'device.status.changed' with { deviceId, status, organizationId } (if changed)
    // 9. On error: increment consecutiveErrors; if >= 3, emit 'device.status.changed' OFFLINE
  }
}
```

Dynamic cron scheduling uses `@nestjs/schedule`'s `SchedulerRegistry` to add/remove `CronJob` instances at runtime — no static `@Cron()` decorator needed.

### GraphQL Subscriptions

**File:** `backend/src/modules/integrations/integrations.resolver.ts`

New GraphQL types and subscriptions added to the auto-schema-file pipeline:

```graphql
type DeviceReadingPayload {
  deviceId: ID!
  organizationId: ID!
  metric: String!
  value: Float!
  unit: String!
  timestamp: String!
}

type DeviceStatusPayload {
  deviceId: ID!
  organizationId: ID!
  status: String!          # ONLINE | OFFLINE | WARNING | FAULT
  previousStatus: String
  changedAt: String!
}

type IntegrationStatusPayload {
  integrationId: String!
  organizationId: ID!
  status: String!          # connected | error | disconnected
  message: String
  updatedAt: String!
}

type Subscription {
  deviceReadingUpdated(organizationId: ID!): DeviceReadingPayload!
  deviceStatusChanged(organizationId: ID!): DeviceStatusPayload!
  integrationStatusChanged(organizationId: ID!): IntegrationStatusPayload!
}
```

The resolver listens to `EventEmitter2` events and publishes to `PubSub`:

```typescript
@Resolver()
export class IntegrationsResolver {
  constructor(
    private readonly pubSub: PubSub,  // injected via IntegrationsModule provider
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Bridge EventEmitter → PubSub on module init
  @OnEvent('device.reading.created')
  handleReadingCreated(payload: DeviceReadingEvent) {
    this.pubSub.publish(`DEVICE_READING_${payload.organizationId}`, {
      deviceReadingUpdated: payload,
    });
  }

  @OnEvent('device.status.changed')
  handleStatusChanged(payload: DeviceStatusEvent) {
    this.pubSub.publish(`DEVICE_STATUS_${payload.organizationId}`, {
      deviceStatusChanged: payload,
    });
  }

  @Subscription(() => DeviceReadingPayload, {
    filter: (payload, variables) =>
      payload.deviceReadingUpdated.organizationId === variables.organizationId,
  })
  deviceReadingUpdated(@Args('organizationId') organizationId: string) {
    return this.pubSub.asyncIterator(`DEVICE_READING_${organizationId}`);
  }

  @Subscription(() => DeviceStatusPayload, {
    filter: (payload, variables) =>
      payload.deviceStatusChanged.organizationId === variables.organizationId,
  })
  deviceStatusChanged(@Args('organizationId') organizationId: string) {
    return this.pubSub.asyncIterator(`DEVICE_STATUS_${organizationId}`);
  }

  @Subscription(() => IntegrationStatusPayload, {
    filter: (payload, variables) =>
      payload.integrationStatusChanged.organizationId === variables.organizationId,
  })
  integrationStatusChanged(@Args('organizationId') organizationId: string) {
    return this.pubSub.asyncIterator(`INTEGRATION_STATUS_${organizationId}`);
  }
}
```

`PubSub` is provided as a module-level singleton in `IntegrationsModule`:

```typescript
const pubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
};
```

### WebSocket Gateway

**File:** `backend/src/modules/integrations/device-telemetry.gateway.ts`

```typescript
@WebSocketGateway({
  namespace: '/device-telemetry',
  cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', credentials: true },
})
export class DeviceTelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Client subscribes to a specific device or all org devices
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { organizationId: string; deviceId?: string }) {
    const room = payload.deviceId
      ? `device:${payload.deviceId}`
      : `org:${payload.organizationId}`;
    client.join(room);
    return { event: 'subscribed', data: { room } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { room: string }) {
    client.leave(payload.room);
  }

  // Called by DevicePollingService via EventEmitter2
  @OnEvent('device.reading.created')
  broadcastReading(payload: DeviceReadingEvent) {
    this.server.to(`device:${payload.deviceId}`).emit('reading', payload);
    this.server.to(`org:${payload.organizationId}`).emit('reading', payload);
  }

  @OnEvent('device.status.changed')
  broadcastStatus(payload: DeviceStatusEvent) {
    this.server.to(`device:${payload.deviceId}`).emit('status', payload);
    this.server.to(`org:${payload.organizationId}`).emit('status', payload);
  }
}
```

The gateway uses `@nestjs/platform-express` Socket.IO (already in `package.json` as `@nestjs/platform-express`). Socket.IO is bundled with it — no new package needed.

### New REST Endpoints

Two new endpoints are added to `IntegrationsController`:

```typescript
// GET /integrations/devices/discover
// Triggers a network scan for discoverable devices (Fronius local, SNMP routers)
// Returns: { discovered: Array<{ type, host, name, protocol }> }
@Get('devices/discover')
@ApiOperation({ summary: 'Scan local network for discoverable hardware devices' })
discoverDevices(@CurrentUser('organizationId') orgId: string) {
  return this.integrationsService.discoverDevices(orgId);
}

// POST /integrations/devices/:deviceIntegrationId/poll
// Manually triggers an immediate poll for a specific device
// Returns: { readings: DeviceReading[], status: DeviceStatus }
@Post('devices/:deviceIntegrationId/poll')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Manually trigger an immediate device poll' })
pollDevice(
  @Param('deviceIntegrationId') deviceIntegrationId: string,
  @CurrentUser('organizationId') orgId: string,
) {
  return this.integrationsService.manualPoll(orgId, deviceIntegrationId);
}
```

### Updated IntegrationsModule

```typescript
@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,  // already global, but listed for clarity
    ScheduleModule,      // already global
  ],
  providers: [
    IntegrationsService,
    DevicePollingService,
    DeviceTelemetryGateway,
    IntegrationsResolver,
    pubSubProvider,
  ],
  controllers: [IntegrationsController],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
```


---

## Frontend Architecture

### Component Tree

```
frontend/src/
├── components/
│   └── integrations/
│       ├── integrations-dashboard.tsx          (existing — add "Energy & IoT" category tab)
│       ├── integration-card.tsx                (existing — unchanged)
│       ├── integration-config-modal.tsx        (existing — unchanged for SaaS)
│       ├── api-keys-panel.tsx                  (existing — unchanged)
│       ├── device-setup-wizard.tsx             (NEW — multi-step form for hardware types)
│       ├── live-telemetry-dashboard.tsx        (NEW — real-time charts per device)
│       └── device-status-badge.tsx             (NEW — live online/offline/warning badge)
├── lib/
│   ├── use-device-stream.ts                    (NEW — Apollo subscription + WS fallback hook)
│   └── use-device-poll.ts                      (NEW — SWR polling fallback hook)
```

### `useDeviceStream` Hook

**File:** `frontend/src/lib/use-device-stream.ts`

Primary path: Apollo Client GraphQL subscription (`graphql-ws` — already in `frontend/package.json`).
Fallback path: SWR polling against `GET /energy/devices/{deviceId}/readings` when WebSocket is unavailable.

```typescript
// Signature:
function useDeviceStream(deviceId: string, organizationId: string): {
  readings: DeviceReading[];
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'FAULT' | 'unknown';
  lastUpdated: Date | null;
  isConnected: boolean;
}

// Implementation:
// 1. useSubscription(DEVICE_READING_UPDATED, { variables: { organizationId } })
//    from @apollo/client — filters client-side by deviceId
// 2. On subscription error or when window.WebSocket is unavailable:
//    fall back to useSWR(`/energy/devices/${deviceId}/readings`, fetcher, { refreshInterval: 10000 })
// 3. Maintains a rolling buffer of last 60 readings in useState for chart rendering
// 4. Derives isConnected from subscription network status or SWR revalidation success
```

### `DeviceSetupWizard` Component

**File:** `frontend/src/components/integrations/device-setup-wizard.tsx`

Multi-step modal for hardware integration setup:

```
Step 1: Select device type (SolarEdge / Fronius / Enphase / MQTT Gateway / HTTP Gateway / Mesh Node / WiFi Router)
Step 2: Enter protocol-specific credentials (rendered from catalog.fields — same pattern as IntegrationConfigModal)
Step 3: Connection test (calls POST /integrations/connections/:id/test, shows latency + result)
Step 4: Link to EnergyDevice (select existing device or create new one)
Step 5: Configure polling interval (slider: 10s – 300s, default from DEVICE_POLL_INTERVAL_MS)
Step 6: Confirmation + "Go to Live Dashboard" CTA
```

Uses `react-hook-form` + `zod` (both already in `frontend/package.json`) for validation.
Uses `framer-motion` (already installed) for step transitions.
Uses existing `Button`, `Input` UI primitives from `frontend/src/components/ui/`.

### `LiveTelemetryDashboard` Component

**File:** `frontend/src/components/integrations/live-telemetry-dashboard.tsx`

Real-time chart panel using `recharts` (already in `frontend/package.json`):

```typescript
// Props: { deviceId: string; organizationId: string; deviceName: string; adapterType: string }
//
// Layout:
// ┌─────────────────────────────────────────────────────────┐
// │  Device Name          ● ONLINE    Last: 2s ago          │
// │  [Power Output W]  [Daily Yield kWh]  [Voltage V]       │
// │                                                          │
// │  ┌──────────────────────────────────────────────────┐   │
// │  │  LineChart (recharts) — last 60 readings          │   │
// │  │  X-axis: timestamp  Y-axis: value                 │   │
// │  └──────────────────────────────────────────────────┘   │
// │                                                          │
// │  [Manual Poll]  [Configure]  [Disconnect]               │
// └─────────────────────────────────────────────────────────┘
//
// Data source: useDeviceStream(deviceId, organizationId)
// Chart updates: append new reading to buffer, re-render via recharts ResponsiveContainer
// Metric tabs: filter readings by metric name
```

### `DeviceStatusBadge` Component

**File:** `frontend/src/components/integrations/device-status-badge.tsx`

```typescript
// Props: { deviceId: string; organizationId: string; initialStatus?: string }
//
// Subscribes to deviceStatusChanged via useSubscription (Apollo)
// Renders animated dot + label matching existing statusCfg pattern from energy-dashboard.tsx:
//   ONLINE  → green pulse dot
//   OFFLINE → grey dot
//   WARNING → amber dot
//   FAULT   → red dot
// Falls back to polling GET /energy/devices/{deviceId} every 15s if subscription unavailable
```

### Integration Dashboard Updates

The existing `IntegrationsDashboard` component receives two additive changes:

1. **Category filter**: Add `"Energy & IoT"` to the `CATEGORIES` array. No other changes to the component.
2. **Hardware card click**: When a hardware catalog item is clicked (category `"Energy & IoT"`), open `DeviceSetupWizard` instead of `IntegrationConfigModal`. Implemented by checking `item.category === 'Energy & IoT'` in the `onConfigure` handler.

The existing `IntegrationCard` component is unchanged — it renders hardware cards identically to SaaS cards.


---

## Realtime Data Flow

### Full Pipeline (Happy Path)

```
1. User completes DeviceSetupWizard
   → POST /integrations/connections/solar-inverter-solaredge/save
   → IntegrationsService.saveConnection() persists IntegrationConnection
   → IntegrationsService creates DeviceIntegration + PollingConfig records
   → DevicePollingService.registerDevice() schedules CronJob (intervalMs)

2. CronJob fires (every intervalMs, default 30s)
   → DevicePollingService.pollDevice(deviceIntegrationId)
   → Decrypt credentials from IntegrationConnection
   → SolarEdgeAdapter.fetchReadings(creds, config)
   → HTTP GET https://monitoringapi.solaredge.com/site/{siteId}/overview
   → Parse { power_output_w: 4250, daily_yield_kwh: 18.3 }
   → prisma.energyReading.createMany([...readings])
   → prisma.energyDevice.update({ status: 'ONLINE', lastSeenAt: now })
   → prisma.pollingConfig.update({ lastPolledAt: now, consecutiveErrors: 0 })
   → eventEmitter.emit('device.reading.created', { deviceId, readings, organizationId })
   → eventEmitter.emit('device.status.changed', { deviceId, status: 'ONLINE', organizationId })

3. EventEmitter listeners fire in parallel:

   Path A — GraphQL Subscription:
   → IntegrationsResolver.handleReadingCreated()
   → pubSub.publish('DEVICE_READING_{orgId}', payload)
   → Apollo Server pushes to all subscribed graphql-ws connections
   → Frontend useDeviceStream hook receives payload via useSubscription
   → readings buffer updated → recharts LineChart re-renders

   Path B — WebSocket Gateway:
   → DeviceTelemetryGateway.broadcastReading()
   → socket.io server.to('device:{deviceId}').emit('reading', payload)
   → Frontend Socket.IO client receives 'reading' event
   → (Alternative to GraphQL subscription for non-Apollo frontends)

   Path C — Database (REST fallback):
   → EnergyReading row persisted in step 2
   → Frontend SWR polling GET /energy/devices/{deviceId}/readings (10s interval)
   → Renders in LiveTelemetryDashboard as fallback when WS unavailable
```

### Status Change Flow

```
Device goes offline (3 consecutive poll errors):
→ DevicePollingService increments consecutiveErrors to 3
→ eventEmitter.emit('device.status.changed', { status: 'OFFLINE', previousStatus: 'ONLINE' })
→ prisma.energyDevice.update({ status: 'OFFLINE' })
→ prisma.energyAlert.create({ severity: 'warning', message: 'Device unreachable after 3 attempts' })
→ IntegrationsResolver.handleStatusChanged() → pubSub.publish('DEVICE_STATUS_{orgId}')
→ DeviceTelemetryGateway.broadcastStatus() → socket.io emit
→ Frontend DeviceStatusBadge transitions from green pulse → grey dot
→ Frontend LiveTelemetryDashboard shows "Last seen X minutes ago" banner
```

### Manual Poll Flow

```
User clicks "Manual Poll" in LiveTelemetryDashboard:
→ POST /integrations/devices/{deviceIntegrationId}/poll
→ IntegrationsService.manualPoll() → DevicePollingService.pollDevice() (immediate, bypasses cron)
→ Returns { readings: [...], status: { online: true } } synchronously
→ Frontend updates chart immediately without waiting for next cron tick
```


---

## Error Handling and Reconnection Strategy

### Adapter-Level Error Handling

Each adapter's `fetchReadings` and `fetchStatus` methods follow this contract:
- **Never throw** — catch all errors internally and return a `DeviceStatus` with `online: false` and a descriptive `message`.
- **Timeout**: All outbound HTTP/TCP/UDP calls use `AbortSignal.timeout(5000)` (5s) or equivalent socket timeout.
- **HTTP errors**: Map status codes to human-readable messages (401 → "Invalid credentials", 403 → "Access denied", 429 → "Rate limited — backing off", 5xx → "Device API error").

### Polling Service Error Escalation

```
consecutiveErrors = 0  → normal operation
consecutiveErrors = 1  → log warning, continue polling
consecutiveErrors = 2  → log error, continue polling
consecutiveErrors = 3  → emit 'device.status.changed' OFFLINE, create EnergyAlert
consecutiveErrors = 10 → disable polling (set PollingConfig.enabled = false), emit alert
```

On next successful poll: reset `consecutiveErrors` to 0, emit `device.status.changed` ONLINE, resolve the alert.

### WebSocket Reconnection (Frontend)

Apollo Client's `graphql-ws` link handles reconnection automatically with exponential backoff (built into the `graphql-ws` library). The `useDeviceStream` hook detects subscription network errors via Apollo's `networkStatus` and activates the SWR polling fallback:

```typescript
const { data, error, loading } = useSubscription(DEVICE_READING_UPDATED, { ... });

// Activate SWR fallback when subscription is unavailable
const useFallback = !!error || typeof window === 'undefined' || !window.WebSocket;
const { data: swrData } = useSWR(
  useFallback ? `/energy/devices/${deviceId}/readings` : null,
  fetcher,
  { refreshInterval: 10000 },
);
```

### Socket.IO Reconnection (WebSocket Gateway)

Socket.IO's built-in reconnection handles transient disconnects. The frontend `DeviceTelemetryGateway` client uses:
```typescript
const socket = io('/device-telemetry', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 30000,
});
```

### MQTT Reconnection (MqttGatewayAdapter)

The MQTT adapter's TCP socket reconnects with exponential backoff (1s, 2s, 4s, 8s, max 60s). After 5 failed reconnects, the adapter marks the device OFFLINE and stops attempting until the next scheduled poll cycle.

### Rate Limiting

- **SolarEdge**: 300 req/day free tier. `PollingConfig.intervalMs` minimum enforced at 300s (5 min) for SolarEdge connections.
- **Enphase**: 10 req/min. Minimum interval: 60s.
- **Fronius / Mesh / WiFi Router**: Local network — no rate limit. Default 30s interval applies.
- **MQTT**: Event-driven, no polling rate limit. The adapter subscribes once and receives pushed messages.

Rate limit enforcement: `DevicePollingService` checks `PollingConfig.intervalMs` against adapter-specific minimums on `registerDevice()` and clamps if necessary.

### Credential Rotation

When `saveConnection` is called for an existing hardware integration (re-save with new credentials), `DevicePollingService.registerDevice()` is called again, which reloads credentials from the database on the next poll tick. No restart required.


---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write unit tests that call `IntegrationsService.saveConnection()`, `testConnection()`, and `getCatalog()` with hardware integration IDs. Run these tests on the UNFIXED code to observe `NotFoundException` and stub responses.

**Test Cases**:
1. **Catalog missing hardware entries** (will fail on unfixed code): `getCatalog()` returns array with no entry where `id === 'solar-inverter-solaredge'` — assert `catalog.find(e => e.id === 'solar-inverter-solaredge')` is `undefined`.
2. **saveConnection throws NotFoundException** (will fail on unfixed code): call `saveConnection(orgId, 'solar-inverter-solaredge', { apiKey: 'x', siteId: '1' })` — assert it throws `NotFoundException`.
3. **testConnection returns stub** (will fail on unfixed code): mock a connected `IntegrationConnection` for `iot-gateway-mqtt`, call `testConnection()` — assert `result.message === 'Connection saved'` (the stub).
4. **All 7 hardware IDs throw** (will fail on unfixed code): parameterized test over all 7 hardware IDs — assert each throws `NotFoundException` from `saveConnection`.

**Expected Counterexamples**:
- `NotFoundException: Integration 'solar-inverter-solaredge' not found` from `saveConnection`
- `{ success: false, message: 'Integration is not connected' }` from `testConnection` (because save always fails)
- Possible causes: missing catalog entries (confirmed root cause 1), missing switch cases (confirmed root cause 2)

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL integrationId IN HARDWARE_IDS DO
  result := integrationsService.saveConnection(orgId, integrationId, validCreds)
  ASSERT result.status IN ['connected', 'error']  // not NotFoundException

  catalogEntry := integrationsService.getCatalog().find(e => e.id === integrationId)
  ASSERT catalogEntry IS NOT NULL
  ASSERT catalogEntry.category === 'Energy & IoT'

  testResult := integrationsService.testConnection(orgId, integrationId)
  ASSERT testResult.message !== 'Connection saved'  // not the stub
END FOR
```

**Test Cases**:
1. **SolarEdge save + catalog**: mock fetch to return valid site details; assert `saveConnection` returns `{ status: 'connected' }` and catalog contains entry.
2. **Fronius test**: mock HTTP GET to local IP; assert `testConnection` returns `{ success: true, message: 'Fronius inverter reachable...' }`.
3. **MQTT gateway test**: mock TCP socket CONNACK; assert `testConnection` returns `{ success: true }`.
4. **WiFi router SNMP test**: mock UDP dgram response; assert `testConnection` returns sysDescr string.
5. **All 7 hardware IDs in catalog**: assert `getCatalog()` returns exactly 15 entries (8 SaaS + 7 hardware).

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL integrationId IN SAAS_IDS DO
  ASSERT getCatalog_original().find(e => e.id === integrationId)
       = getCatalog_fixed().find(e => e.id === integrationId)

  ASSERT saveConnection_original(orgId, integrationId, creds)
       = saveConnection_fixed(orgId, integrationId, creds)

  ASSERT runConnectionTest_original(integrationId, creds)
       = runConnectionTest_fixed(integrationId, creds)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because it generates many credential combinations automatically and catches edge cases in the encryption/decryption path.

**Test Cases**:
1. **Stripe catalog entry unchanged**: assert `getCatalog()` entry for `stripe` has identical `id`, `name`, `category`, `color`, `fields`, `capabilities`, `webhookPath` before and after fix.
2. **Slack connection test unchanged**: mock Slack `auth.test` endpoint; assert `testConnection('slack', creds)` returns same message format.
3. **Encryption round-trip preserved**: property test — for any `Record<string, string>` credentials, `decrypt(encrypt(creds))` equals `creds` (unchanged crypto path).
4. **All 8 SaaS IDs in catalog**: assert `getCatalog()` still contains all 8 original entries with unchanged field counts.
5. **Existing connection CRUD unchanged**: assert `getConnections`, `disconnectIntegration`, `getStats` return same shapes for SaaS connections.

### Unit Tests

- Test each adapter's `testConnection()` with mocked network responses (success and failure cases)
- Test `DevicePollingService.pollDevice()` with mocked adapters — verify `EnergyReading` creation and event emission
- Test `runConnectionTest` switch routing — verify each hardware case delegates to the correct adapter
- Test `INTEGRATION_CATALOG` length (15 entries) and hardware entry field validation
- Test `PollingConfig` interval clamping for rate-limited adapters (SolarEdge min 300s, Enphase min 60s)
- Test error escalation: 3 consecutive errors → OFFLINE status + alert creation

### Property-Based Tests

- Generate random `Record<string, string>` credential objects and verify AES-256-CBC encrypt/decrypt round-trip is lossless (preservation of encryption path)
- Generate random `organizationId` + SaaS `integrationId` pairs and verify `saveConnection` behavior is identical between original and fixed code
- Generate random polling intervals and verify `DevicePollingService` clamps to adapter minimums correctly
- Generate random sequences of poll success/failure and verify `consecutiveErrors` counter and status transitions follow the escalation rules

### Integration Tests

- Full flow: save SolarEdge connection → verify `DeviceIntegration` + `PollingConfig` created → trigger manual poll → verify `EnergyReading` rows in DB → verify GraphQL subscription payload received
- WebSocket gateway: connect Socket.IO client to `/device-telemetry` → subscribe to org room → trigger poll → verify `reading` event received with correct payload
- Preservation integration: save Stripe connection → test connection → verify Stripe API mock called with correct auth header (unchanged behavior)
- Catalog endpoint: `GET /integrations/catalog` → verify response contains 15 entries, 7 with `category: 'Energy & IoT'`, 8 with original SaaS categories
