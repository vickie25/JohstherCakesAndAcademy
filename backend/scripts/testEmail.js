// Test email functionality
const { testEmailSending } = require('../config/emailSetup');

testEmailSending().then(result => {
  if (result.success) {
    console.log('\nEmail test completed successfully!');
    console.log('Check your inbox or preview URL:', result.previewUrl);
  } else {
    console.log('Email test failed:', result.error);
  }
});
