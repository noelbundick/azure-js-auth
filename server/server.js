require('dotenv').config();

const express = require('express');
const passport = require('passport');
const passportAzureAd = require('passport-azure-ad');

// Express app
const app = express();

// Trivial role authorization middleware
function authorized(role) {
  return (req, res, next) => {
    if (req.user && req.user.roles && req.user.roles.includes(role)) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}

// Use AAD/OAuth2
passport.use(new passportAzureAd.BearerStrategy({
  clientID: process.env.CLIENT_ID,
  identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`
}, (token, done) => {
  return done(null, token);
}));

// Public endpoint
app.get('/', (req, res) => {
  res.send('Public endpoint');
});

// All endpoints from here forward must be authenticated
app.use(passport.initialize())
  .all('*', passport.authenticate('oauth-bearer', { session: false }));

// GET /data requires Reader
app.get('/data', authorized('Reader'), (req, res) => {
  res.send('You are authorized to get data!');
});

// PUT /data requires Writer
app.put('/data', authorized('Writer'), (req, res) => {
  res.send('You are authorized to write data!');
});

// GET /admin requires Admin
app.get('/admin', authorized('Admin'), (req, res) => {
  res.send('Hello, admin!');
});

app.listen(process.env.PORT, () => {
  console.log('Started server');
});
