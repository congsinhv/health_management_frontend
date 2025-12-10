import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to serve the PWA Service Worker
 * This ensures the service worker is properly served with correct headers
 * even when using Next.js standalone output mode
 */
export async function GET() {
  try {
    // Read the service worker file from public directory
    const swPath = path.join(process.cwd(), 'public', 'sw.js');

    // Check if file exists
    if (!fs.existsSync(swPath)) {
      return new NextResponse('Service worker not found', { status: 404 });
    }

    const swContent = fs.readFileSync(swPath, 'utf-8');

    return new NextResponse(swContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Service-Worker-Allowed': '/',
      },
    });
  } catch (error) {
    console.error('Error serving sw.js:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
