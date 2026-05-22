import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import config from '@payload-config'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap}>
      {children}
    </RootLayout>
  )
}
