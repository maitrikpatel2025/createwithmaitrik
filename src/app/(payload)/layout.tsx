import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'
import './custom.css'
import config from '@payload-config'
import React from 'react'

const serverFunction = async (args: Parameters<typeof handleServerFunctions>[0]) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
