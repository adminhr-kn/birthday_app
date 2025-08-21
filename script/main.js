// need this to encrypt the data
const crypto = require("crypto");

// the api needs date to match the encrypted date apperantly so yeah
const datetime = new Date().toUTCString();

// the data we want to fetch
const requestLine =  "GET /v2/talenta/v3/employees HTTP/1.1";

// data fetched with date time, made into a one string
const payload = [`date: ${datetime}`, requestLine].join('\n');

// encrypting the data with our key, and formatting it as base64, the SHA256 is the algorythm we encrypt the data with
const signature = crypto.createHmac('SHA256', 'gBD610eDf2uMyoXLHQZiFJmSSOzQsx8f').update(payload).digest('base64');

console.log(`date: ${datetime}`)
// digestheader with sha256 containing request body

// and then with all that we pass the clg insides into yaak and the datetime, so when they match we get the data in response

console.log(`hmac username="S5cNHginfEyLdSze", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`)