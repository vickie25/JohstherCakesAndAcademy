const fetch = require('node-fetch');

async function test() {
  const response = await fetch('http://localhost:5000/api/settings', {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN_HERE' // This might be hard to test without a valid token.
    }
  });
  const data = await response.json();
  console.log(data);
}
// test();
console.log("Manual verification required via Browser or API request since tokens are required.");
