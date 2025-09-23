// // api/fermion-redirectvivek.ts
// import type { VercelRequest, VercelResponse } from '@vercel/node';
// import jwt from 'jsonwebtoken';

// // GET /api/fermion-redirect?labId=...&uid=...   (uid is optional; see note below)
// export default function handler(req: VercelRequest, res: VercelResponse) {
//   const apiKey = process.env.FERMION_API_KEY;
//   const schoolHost = process.env.FERMION_SCHOOL_HOST; // e.g. your-school.fermion.app

//   if (!apiKey || !schoolHost) {
//     return res.status(500).send('Server is not configured: missing FERMION_API_KEY or FERMION_SCHOOL_HOST');
//   }

//   const labId = (req.query.labId as string) || process.env.DEFAULT_FERMION_LAB_ID;
//   if (!labId) return res.status(400).send('labId is required');

//   // ⚠️ For production, resolve userId from your server-side session instead of query.
//   const userId = (req.query.uid as string) || 'anon-user';

//   const token = jwt.sign(
//     {
//       labId,
//       userId,
//       playgroundOptions: {
//         isCodeCopyPasteAllowed: false,
//         shouldHideLogo: false,
//         overrideDefaultFilesystemForLab: { isEnabled: false },
//       },
//     },
//     apiKey,
//     { algorithm: 'HS256', expiresIn: '1h' }
//   );

//   const url = `https://careerbadge.apply-wizz.com/contest/nose-surrounded?token=${encodeURIComponent(token)}`
//   res.setHeader('Cache-Control', 'no-store');
//   return res.redirect(302, url);

// }

// api/fermion-redirectvivek.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

// HARD-CODED API URL as requested (no .env for the URL)
const ENROLL_URL = 'https://backend.codedamn.com/api/public/enroll-user-into-digital-product';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.FERMION_API_KEY;
    const schoolHost = process.env.FERMION_SCHOOL_HOST; // e.g., your-school.fermion.app
    const fermionProductId = process.env.FERMION_PRODUCT_ID_VIVEK; // <-- set this in env

    if (!apiKey || !schoolHost) {
      return res
        .status(500)
        .send('Server is not configured: missing FERMION_API_KEY or FERMION_SCHOOL_HOST');
    }
    if (!fermionProductId) {
      return res
        .status(500)
        .send('Server is not configured: missing FERMION_PRODUCT_ID_VIVEK');
    }

    const labId = (req.query.labId as string) || process.env.DEFAULT_FERMION_LAB_ID;
    if (!labId) return res.status(400).send('labId is required');

    // ⚠️ In production, resolve userId from your server-side session
    const userId = (req.query.uid as string) || 'anon-user';

    // 1) ENROLL the user into the Fermion digital product (contest)
    //    This keeps your API key secret and ensures enrollment happens before redirect.
    const enrollRes = await fetch(ENROLL_URL, {
      method: 'POST',
      headers: {
        'FERMION-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            data: {
              fermionDigitalProductId: fermionProductId,
              userId: userId,
            },
          },
        ],
      }),
    });

    if (!enrollRes.ok) {
      const errText = await enrollRes.text();
      // You can log this on the server for debugging
      console.error('Fermion enroll failed:', enrollRes.status, errText);
      return res
        .status(enrollRes.status)
        .send(`Enrollment failed: ${errText || 'unknown error'}`);
    }

    // 2) Generate the token for the lab session (same as your current logic)
    const token = jwt.sign(
      {
        labId,
        userId,
        playgroundOptions: {
          isCodeCopyPasteAllowed: false,
          shouldHideLogo: false,
          overrideDefaultFilesystemForLab: { isEnabled: false },
        },
      },
      apiKey,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // 3) Redirect to your contest URL
    const url = `https://careerbadge.apply-wizz.com/contest/nose-surrounded?token=${encodeURIComponent(
      token
    )}`;

    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(302, url);
  } catch (e: any) {
    console.error('fermion-redirectvivek error:', e);
    return res.status(500).send(`Unexpected server error: ${e?.message || e}`);
  }
}
