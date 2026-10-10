import { LOCALE_COOKIE, resolveLocaleCookie } from '@/i18n/localeCookie'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register', '/reset-password', '/activation']
const assetsRoutes = ['/_next', '/img', '/fonts']

const logos = ['https://base-empreinte.ademe.fr', 'https://www.legifrance.gouv.fr', ''].join(' ')

const ensureLocaleCookie = (req: NextRequest, response: NextResponse) => {
  const fallback = resolveLocaleCookie(req.cookies.get(LOCALE_COOKIE)?.value)
  if (fallback) {
    response.cookies.set(LOCALE_COOKIE, fallback)
  }
  return response
}

const isPublicPath = (pathname: string) =>
  publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

const isHttpsRequest = (req: NextRequest) =>
  req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https'

const buildContentSecurityPolicy = (nonce: string) => {
  // One CSP for all routes: soft navigations keep the document CSP, so public vs
  // authenticated policies must not diverge (otherwise Emotion styles lose their nonce).
  const scriptSrc =
    process.env.NODE_ENV === 'development'
      ? `'self' 'unsafe-inline' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`

  const styleSrc = process.env.NODE_ENV === 'development' ? `'self' 'unsafe-inline'` : `'self' 'nonce-${nonce}'`

  return `
    default-src 'self';
    script-src ${scriptSrc};
    style-src ${styleSrc};
    style-src-attr 'unsafe-inline';
    img-src 'self' data: ${logos};
    font-src 'self';
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
        return ensureLocaleCookie(req, NextResponse.redirect(new URL('/', req.url)))
      }
    }
  } else if (!assetsRoutes.find((route) => pathname.startsWith(route))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL('/login', req.url)
      return ensureLocaleCookie(req, NextResponse.redirect(loginUrl))
    }
  }

  const contentSecurityPolicyHeader = buildContentSecurityPolicy(nonce)

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeader)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')

  if (isHttpsRequest(req)) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return ensureLocaleCookie(req, response)
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|images|logos|fonts|api/auth|api/ressources/*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
