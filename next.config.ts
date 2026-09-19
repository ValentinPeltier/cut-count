import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
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
