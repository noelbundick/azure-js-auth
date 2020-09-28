# azure-js-auth

Securing an API using AAD appRoles

## Server

* The API defines 3 roles: [Reader, Writer, Admin]
* Secured via `passport-azure-ad`
* Copy `server/.env.template` to `server/.env` and fill in values
* `cd server && node server.js`

### Server App Registration

* Edit the AAD manifest
  * Add 3x `appRoles`: [Reader, Writer, and Admin] (see below)
  * Set `accessTokenAcceptedVersion: 2` - this is important because we have `passport-azure-ad` configured with v2 metadata, so we'll be validating against v2 tokens

Example snippet:

```json
"accessTokenAcceptedVersion": 2,
"appRoles": [
  {
    "allowedMemberTypes": [
      "Application"
    ],
    "description": "Write data",
    "displayName": "Data Writer",
    "id": "191686f2-892f-485e-ac7b-5a38a0a39692",
    "isEnabled": true,
    "lang": null,
    "origin": "Application",
    "value": "Writer"
  },
  {
    "allowedMemberTypes": [
      "Application"
    ],
    "description": "Read data",
    "displayName": "Data Reader",
    "id": "191686f2-892f-485e-ac7b-5a38a0a39691",
    "isEnabled": true,
    "lang": null,
    "origin": "Application",
    "value": "Reader"
  },
  {
    "allowedMemberTypes": [
      "Application"
    ],
    "description": "Admin",
    "displayName": "Admin",
    "id": "191686f2-892f-485e-ac7b-5a38a0a39693",
    "isEnabled": true,
    "lang": null,
    "origin": "Application",
    "value": "Admin"
  }
],
```

## Client

* The client is granted 2 of the 3 roles on the server: [Reader, Writer]
* Gets tokens via `@azure/identity`
* Copy `client/.env.template` to `client/.env` and fill in values
* `cd client && node client.js`

## Client App Registration

* Add a clientSecret - used to authenticate the client. In production, you'd want to use a Managed Identity instead if possible
* Use API Permissions to assign Reader & Writer roles. Grant admin consent (requires Azure AD Global Admin)
