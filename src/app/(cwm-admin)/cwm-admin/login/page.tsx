'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    api.me()
      .then(data => {
        if (data.user) router.replace('/cwm-admin')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.login(email, password)
      if (result.user) {
        router.replace('/cwm-admin')
      } else {
        setError('Invalid credentials')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="adm-login">
        <div className="adm-loading">
          <div className="adm-spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="adm-login">
      <div className="adm-login__card">
        <div className="adm-login__header">
          <div className="adm-login__badge">M</div>
          <h1 className="adm-login__title">Maitrik Patel</h1>
          <p className="adm-login__subtitle">Admin Dashboard</p>
        </div>

        <form className="adm-login__form" onSubmit={handleSubmit}>
          {error && <div className="adm-login__error">{error}</div>}

          <div className="adm-login__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@maitrikpatel.io"
              required
              autoFocus
            />
          </div>

          <div className="adm-login__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn--primary adm-login__submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
