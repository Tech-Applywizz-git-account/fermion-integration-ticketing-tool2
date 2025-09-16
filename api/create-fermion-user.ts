// api/create-fermion-user.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.FERMION_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'FERMION_API_KEY not configured' });
  }

  try {
    const { userId, name, email, username } = req.body;

    const response = await fetch('https://backend.codedamn.com/api/public/create-new-user', {
      method: 'POST',
      headers: {
        'FERMION-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{
          data: {
            userId,
            profileDefaults: {
              name,
              username: username || email.split('@')[0],
              email,
            },
            shouldSendWelcomeEmail: true
          }
        }]
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error creating Fermion user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}