# Bugfix Requirements Document

## Introduction

NexoraGrid's `IntegrationsModule` currently supports only SaaS/business integrations (Stripe, Slack, HubSpot, WhatsApp, etc.) via its catalog and connection management system. The integration layer is missing support for the hardware and IoT device types that are central to NexoraGrid's energy management mission: solar inverter APIs, IoT gateways, mesh grid nodes, and WiFi routers.

As a result, the system cannot discover, connect to, or retrieve data from any physical energy infrastructure devices. The `INTEGRATION_CATALOG` has no entries for these device types, `runConnectionTest` has no handlers for them, and there are no adapter patterns for the varied protocols these devices use (REST, MQTT, Modbus, local network discovery). This gap means the energy monitoring and grid management features have no live data source to draw from.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user attempts to connect a solar inverter API (e.g., SolarEdge, Fronius, Enphase) THEN the system returns a "not found" error because no solar inverter entries exist in `INTEGRATION_CATALOG`

1.2 WHEN a user attempts to connect an IoT gateway device THEN the system returns a "not found" error because no IoT gateway entries exist in `INTEGRATION_CATALOG`

1.3 WHEN a user attempts to connect a mesh grid node THEN the system returns a "not found" error because no mesh grid node entries exist in `INTEGRATION_CATALOG`

1.4 WHEN a user attempts to connect a WiFi router for network-based device discovery THEN the system returns a "not found" error because no WiFi router entries exist in `INTEGRATION_CATALOG`

1.5 WHEN `testConnection` is called for any hardware/IoT integration ID THEN the system falls through to the default `return 'Connection saved'` stub with no actual connectivity verification

1.6 WHEN the integrations catalog is fetched THEN the system returns only SaaS business integrations, with no hardware or IoT device category present

1.7 WHEN a solar inverter is available on the local network or via a cloud API THEN the system has no mechanism to discover or poll it for energy readings

### Expected Behavior (Correct)

2.1 WHEN a user connects a solar inverter integration (providing API key/endpoint) THEN the system SHALL save the connection, validate the credentials against the inverter's API, and return a `connected` status

2.2 WHEN a user connects an IoT gateway THEN the system SHALL save the connection credentials (host, port, protocol) and verify reachability of the gateway endpoint

2.3 WHEN a user connects a mesh grid node THEN the system SHALL save the node's address and authentication details and confirm the node is reachable

2.4 WHEN a user connects a WiFi router integration THEN the system SHALL save the router credentials and verify API or SNMP reachability for device discovery

2.5 WHEN `testConnection` is called for a solar inverter, IoT gateway, mesh grid node, or WiFi router integration THEN the system SHALL execute a real connectivity check specific to that device type and return a meaningful success or error message

2.6 WHEN the integrations catalog is fetched THEN the system SHALL include a dedicated "Energy & IoT" category containing entries for solar inverter APIs, IoT gateways, mesh grid nodes, and WiFi routers

2.7 WHEN a solar inverter integration is connected and available THEN the system SHALL be able to poll it for current power output, daily yield, and device status readings

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user connects or tests an existing SaaS integration (Stripe, Slack, HubSpot, Twilio, WhatsApp, AWS, Salesforce, Plaid) THEN the system SHALL CONTINUE TO handle those integrations exactly as before, with no change to their catalog entries, credential fields, or connection test logic

3.2 WHEN `getConnections`, `saveConnection`, `disconnectIntegration`, and `getStats` are called for any existing SaaS integration THEN the system SHALL CONTINUE TO return the same data shapes and behavior as the current implementation

3.3 WHEN API keys are created, listed, or revoked THEN the system SHALL CONTINUE TO function identically to the current implementation

3.4 WHEN credentials are stored for any integration THEN the system SHALL CONTINUE TO encrypt them using the existing AES-256-CBC scheme before persisting to the database

3.5 WHEN the `IntegrationConnection` Prisma model is used THEN the system SHALL CONTINUE TO use the existing `organizationId_integrationId` unique constraint and schema without breaking migrations

3.6 WHEN the `IntegrationsModule` is imported by `AppModule` THEN the system SHALL CONTINUE TO export `IntegrationsService` for use by other modules (e.g., `EnergyModule`)

---

## Bug Condition

**Bug Condition Function:**

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type IntegrationRequest
  OUTPUT: boolean

  // Returns true when the request targets a hardware/IoT device integration
  RETURN X.integrationId IN ['solar-inverter-solaredge', 'solar-inverter-fronius',
                              'solar-inverter-enphase', 'iot-gateway', 
                              'mesh-grid-node', 'wifi-router']
END FUNCTION
```

**Property: Fix Checking**

```pascal
// Property: Fix Checking — Hardware/IoT integrations are handled
FOR ALL X WHERE isBugCondition(X) DO
  result ← integrationsService.saveConnection(X) OR integrationsService.testConnection(X)
  ASSERT result.status IN ['connected', 'error']  // not NotFoundException
  ASSERT catalog.find(X.integrationId) IS NOT NULL
END FOR
```

**Property: Preservation Checking**

```pascal
// Property: Preservation Checking — Existing SaaS integrations unaffected
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)  // behavior identical before and after the fix
END FOR
```
