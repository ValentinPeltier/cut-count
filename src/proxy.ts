import { Locale } from '@/lib/i18n/config'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const LOCALE_COOKIE = 'NEXT_LOCALE'
const publicRoutes = ['/login', '/register', '/reset-password', '/activation']
const assetsRoutes = ['/_next', '/img']

const logos = ['https://base-empreinte.ademe.fr', 'https://www.legifrance.gouv.fr', ''].join(' ')

const normalizeCookies = (response: NextResponse) => {
  response.cookies.set(LOCALE_COOKIE, Locale.FR)
  return response
}

const isPublicPath = (pathname: string) =>
  publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

const isHttpsRequest = (req: NextRequest) =>
  req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https'

const buildContentSecurityPolicy = (pathname: string, nonce: string) => {
  const isPublic = isPublicPath(pathname)

  if (isPublic) {
    const scriptSrc =
      process.env.NODE_ENV === 'development' ? `'self' 'unsafe-inline' 'unsafe-eval'` : `'self' 'unsafe-inline'`

    return `
      default-src 'self';
      script-src ${scriptSrc};
      style-src 'self' 'unsafe-inline' https://fonts.cdnfonts.com;
      img-src 'self' data: ${logos};
      font-src 'self' https://fonts.cdnfonts.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src 'self' https://www.youtube.com;
      connect-src 'self';
    `
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  const scriptSrc =
    process.env.NODE_ENV === 'development'
      ? `'self' 'unsafe-inline' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`

  const styleSrc =
    process.env.NODE_ENV === 'development'
      ? `'self' 'unsafe-inline' https://fonts.cdnfonts.com`
      : `'self' 'nonce-${nonce}' https://fonts.cdnfonts.com`

  return `
    default-src 'self';
    script-src ${scriptSrc};
    style-src ${styleSrc};
    style-src-attr 'unsafe-inline';
    img-src 'self' data: ${logos};
    font-src 'self' https://fonts.cdnfonts.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://www.youtube.com;
    connect-src 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isPublic = isPublicPath(pathname)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  if (isPublic) {
    if (pathname === '/login') {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      if (token) {
        return normalizeCookies(NextResponse.redirect(new URL('/', req.url)))
      }
    }
  } else if (!assetsRoutes.find((route) => pathname.startsWith(route))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL('/login', req.url)
      return normalizeCookies(NextResponse.redirect(loginUrl))
    }
  }

  const contentSecurityPolicyHeader = buildContentSecurityPolicy(pathname, nonce)

  const requestHeaders = new Headers(req.headers)
  if (!isPublic) {
    requestHeaders.set('x-nonce', nonce)
  }
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeader)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')

  if (isHttpsRequest(req)) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return normalizeCookies(response)
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|images|logos|api/auth|api/ressources/*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
