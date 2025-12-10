import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to serve the Workbox library for PWA Service Worker
 * This ensures the workbox file is properly served with correct headers
 * even when using Next.js standalone output mode
 */
export async function GET() {
  try {
    // Read the workbox file from public directory
    const workboxPath = path.join(
      process.cwd(),
      'public',
      'workbox-1bb06f5e.js'
    );

    // Check if file exists
    if (!fs.existsSync(workboxPath)) {
      return new NextResponse('Workbox file not found', { status: 404 });
    }

    const workboxContent = fs.readFileSync(workboxPath, 'utf-8');

    return new NextResponse(workboxContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving workbox-1bb06f5e.js:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
