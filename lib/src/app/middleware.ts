import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Ambil username atau ID dari cookie
    const userId = request.cookies.get('username')?.value; // Ganti "username" sesuai nama cookie Anda

    if (userId) {
        // Jika userId ditemukan di cookie, redirect ke URL edit profile
        const url = request.nextUrl.clone();
        url.pathname = `/pegawai/profile/edit/${userId}`;
        return NextResponse.redirect(url);
    }

    // Jika cookie username/ID tidak ditemukan, arahkan ke halaman error atau login
    return NextResponse.redirect(new URL('/login', request.url));  // Atau '/error' jika sesuai
}

// Tentukan route yang akan diterapkan middleware
export const config = {
    matcher: '/pegawai/profile/edit/:id', // Middleware berlaku untuk route ini
};
