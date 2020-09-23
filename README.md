# azure-js-auth

Securing an API using AAD appRoles

## Server

* The API defines 3 roles: [Reader, Writer, Admin]
* Secured via `passport-azure-ad`
* Copy `server/.env.template` to `server/.env` and fill in values
* `cd server && node server.js`

### Server App Registration

* Edit the AAD manifest
  * Add 2x `appRoles`
  * Set `accessTokenAcceptedVersion: 2`

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

* Add a clientSecret
* Use API Permissions to assign Reader & Writer roles. Grant admin consent (requires Azure AD Global Admin)
