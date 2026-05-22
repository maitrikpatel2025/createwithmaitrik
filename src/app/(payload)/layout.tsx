import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import config from '@payload-config'
import React from 'react'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  return RootLayout({ children, config, importMap })
}
