'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '../lib/api'

type User = {
  id: string
  email: string
  name?: string
  role?: string
}

type AdminContextValue = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
})

export function useAdmin() {
  return useContext(AdminContext)
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    api.me()
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else if (!pathname.includes('/login')) {
          router.replace('/cwm-admin/login')
        }
      })
      .catch(() => {
        if (!pathname.includes('/login')) {
          router.replace('/cwm-admin/login')
        }
      })
      .finally(() => setLoading(false))
  }, [pathname, router])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // ignore logout errors
    }
    setUser(null)
    router.replace('/cwm-admin/login')
  }, [router])

  return (
    <AdminContext.Provider value={{ user, loading, logout }}>
      {children}
    </AdminContext.Provider>
  )
}
