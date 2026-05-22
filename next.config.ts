import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  serverExternalPackages: ['@monaco-editor/react', 'monaco-editor'],
}

export default withPayload(nextConfig)
