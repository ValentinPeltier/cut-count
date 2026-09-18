import { Environment } from '@/db-common/enums'
import { Locale } from '@/lib/i18n/config'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const ENVIRONMENT_COOKIE = 'ENVIRONMENT'
const LOCALE_COOKIE = 'NEXT_LOCALE'
const publicRoutes = ['/login', '/register', '/reset-password', '/activation', '/preview', '/count']
const assetsRoutes = ['/_next', '/img']

const bucketName = process.env.SCW_BUCKET_NAME as string
const region = process.env.SCW_REGION

const scaleway = `https://${bucketName}.s3.${region}.scw.cloud`
const logos = ['https://base-empreinte.ademe.fr', 'https://www.legifrance.gouv.fr', ''].join(' ')

const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

const normalizeCookies = (response: NextResponse) => {
  response.cookies.set(ENVIRONMENT_COOKIE, Environment.CUT)
  response.cookies.set(LOCALE_COOKIE, Locale.FR)
  return response
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (pathname === '/count' || pathname.startsWith('/count/')) {
    const rest = pathname === '/count' ? '/login' : pathname.replace(/^\/count/, '')
    const url = new URL(rest || '/login', req.url)
    url.search = req.nextUrl.search
    return normalizeCookies(NextResponse.redirect(url))
  }

  if (![...publicRoutes, ...assetsRoutes].find((route) => pathname.startsWith(route))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL('/login', req.url)
      return normalizeCookies(NextResponse.redirect(loginUrl))
    }
  }

  const nonceRestriction = process.env.NODE_ENV === 'development' ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}'`

  const cspHeader = `
    default-src 'self';
    script-src 'self' ${nonceRestriction} https://embed.typeform.com;
    style-src 'self' ${nonceRestriction} https://fonts.cdnfonts.com https://embed.typeform.com;
    img-src 'self' data: ${logos};
    font-src 'self' https://fonts.cdnfonts.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' ${scaleway} https://www.youtube.com https://form.typeform.com;
    connect-src 'self' ${scaleway} https://api.typeform.com;
  `
  const contentSecurityPolicyHeader = cspHeader.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeader)
  requestHeaders.set('x-url', req.url)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  return normalizeCookies(response)
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|images|logos|api/auth|api/schools/*|api/cron/*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
