import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('better-auth.session-token') || 
                        request.cookies.get('__secure-better-auth.session-token');

  // Proteção de rotas privadas (exclui login e arquivos estáticos)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isPublicFile = request.nextUrl.pathname.match(/\.(.*)$/) || 
                       request.nextUrl.pathname.startsWith('/_next');

  if (!sessionCookie && !isAuthPage && !isPublicFile && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
