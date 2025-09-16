// src/components/Admin/CreateFermionUser.tsx

import { useState } from 'react';

export function CreateFermionUser({ userId, userName, userEmail, employeeId }: {
  userId: string;
  userName: string;
  userEmail: string;
  employeeId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createFermionUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-fermion-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: userName,
          email: userEmail,
          username: employeeId || userEmail.split('@')[0]
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded-lg font-medium"
      onClick={createFermionUser} disabled={loading}>
        {loading ? 'Creating...' : 'Create Fermion User'}
      </button>
      {result && (
        <pre className="mt-2 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}