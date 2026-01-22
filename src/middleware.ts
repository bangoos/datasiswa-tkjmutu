import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ensureDatabaseSeeded } from "./lib/seed";

export async function middleware(request: NextRequest) {
  // Jalankan auto-seeding hanya di production dan saat pertama kali akses
  if (process.env.NODE_ENV === "production") {
    try {
      await ensureDatabaseSeeded();
    } catch (error) {
      console.error("Middleware seeding error:", error);
      // Tetap lanjutkan meskipun seeding gagal
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
