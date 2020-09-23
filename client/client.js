require('dotenv').config();

const identity = require('@azure/identity');
const fetch = require('node-fetch');

async function main() {
  const cred = new identity.DefaultAzureCredential();
  const accessToken = await cred.getToken(process.env.SCOPE);
  console.log('Acquired token');
  console.log(accessToken);

  // Allowed, this is a public endpoint
  const public = await fetch(process.env.ENDPOINT).then(res => res.text());
  console.log(public);

  // Unauthorized
  const readUnauthenticated = await fetch(`${process.env.ENDPOINT}/data`).then(res => res.text());
  console.log(readUnauthenticated);

  // Allowed, client has the Reader appRole
  const readAuthenticated = await fetch(`${process.env.ENDPOINT}/data`,
    {
      headers: { Authorization: `Bearer ${accessToken.token}` }
    }).then(res => res.text());
  console.log(readAuthenticated);

  // Unauthorized
  const writeUnauthenticated = await fetch(`${process.env.ENDPOINT}/data`, { method: 'PUT' }).then(res => res.text());
  console.log(writeUnauthenticated);

  // Allowed, client has the Writer appRole
  const writeAuthenticated = await fetch(`${process.env.ENDPOINT}/data`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken.token}` }
    }).then(res => res.text());
  console.log(writeAuthenticated);

  // Unauthorized
  const adminUnauthenticated = await fetch(`${process.env.ENDPOINT}/admin`).then(res => res.text());
  console.log(adminUnauthenticated);

  // Forbidden! Client is authenticated but not allowed to perform admin operations
  const adminAuthenticated = await fetch(`${process.env.ENDPOINT}/admin`,
    {
      headers: { Authorization: `Bearer ${accessToken.token}` }
    }).then(res => res.text());
  console.log(adminAuthenticated);
}

main().finally();