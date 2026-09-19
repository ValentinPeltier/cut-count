import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
  },
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '/*': ['./node_modules/@sparticuz/chromium/**/*', './node_modules/puppeteer-core/**/*'],
  },
  reactCompiler: {
    compilationMode: 'annotation',
  },
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  images: {
    remotePatterns: [],
    qualities: [75, 90],
  },
  transpilePackages: ['mui-color-input', '@publicodes/forms'],
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    },
  ],
}

export default withNextIntl(nextConfig)
