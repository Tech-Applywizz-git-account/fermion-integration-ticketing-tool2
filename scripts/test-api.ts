// scripts/test-api.ts

async function testFermionAPI() {
  const testData = {
    userId: 'test-user-id-123', // Use a test UUID
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser'
  };

  try {
    const response = await fetch('https://fermion-integration-ticketing-tool2.vercel.app/api/create-fermion-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log('API Response:', result);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

testFermionAPI();