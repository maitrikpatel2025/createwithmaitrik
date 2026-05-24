/**
 * Access control helpers that support both Payload session auth AND API key auth.
 * Use these in collection access configs instead of raw `({ req }) => Boolean(req.user)`.
 */

import { validateApiKey, hasPermission } from './apiKeyAuth'

type AccessArgs = {
  req: any
}

/**
 * Creates an access function that grants access to:
 * 1. Authenticated Payload users (session/JWT)
 * 2. API keys with the required permission
 */
export function authOrApiKey(collection: string, action: 'read' | 'write') {
  return async ({ req }: AccessArgs): Promise<boolean> => {
    // Payload session user
    if (req.user) return true

    // API key auth
    const authHeader = req.headers?.get?.('authorization') || req.headers?.authorization
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const result = await validateApiKey(authHeader)
      if (result?.valid) {
        return hasPermission(result.permissions, collection, action)
      }
    }

    return false
  }
}
