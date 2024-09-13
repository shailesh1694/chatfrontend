import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}

export function middleware(request: NextRequest) {

    const token = request.cookies.get('token')
    const pathname = request.nextUrl.pathname;
    const privateRoute = pathname.startsWith('/sign-in')
        || pathname.startsWith('/sign-up')
        || pathname.startsWith('/verify')

        
        if (!token && (!privateRoute)) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
        
        if (token && (privateRoute)) {
            return NextResponse.redirect(new URL('/', request.url))
        }

    return NextResponse.next()
}