// scripts/test-with-real-user.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function testWithRealUser() {
  // Get a real user from your database
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, employeeid')
    .limit(1);

  if (error || !users?.length) {
    console.error('Error fetching users:', error);
    return;
  }

  const user = users[0];
  console.log('Testing with real user:', user);

  const response = await fetch('https://fermion-integration-ticketing-tool2.vercel.app/api/create-fermion-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      name: user.name,
      email: user.email,
      username: user.employeeid || user.email.split('@')[0]
    }),
  });

  const result = await response.json();
  console.log('Fermion API response:', result);
  console.log('Status:', response.status);
}

testWithRealUser();