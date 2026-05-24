import { getPayloadClient } from './payload'

export type ApiKeyResult = {
  valid: boolean
  permissions: string[]
  keyId?: number | string
  label?: string
}

/**
 * Validate an API key from the Authorization header.
 * Returns permissions if valid, null if invalid.
 */
export async function validateApiKey(authHeader: string | null): Promise<ApiKeyResult | null> {
  if (!authHeader?.startsWith('Bearer ')) return null

  const key = authHeader.slice(7).trim()
  if (!key || !key.startsWith('cwm_')) return null

  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'api-keys',
      where: { key: { equals: key } },
      limit: 1,
    })

    if (result.docs.length === 0) return null

    const apiKey = result.docs[0] as any

    // Check active
    if (!apiKey.active) return null

    // Check expiry
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) return null

    // Update usage stats (non-blocking)
    payload.update({
      collection: 'api-keys',
      id: apiKey.id,
      data: {
        lastUsedAt: new Date().toISOString(),
        usageCount: (apiKey.usageCount || 0) + 1,
      },
    }).catch((err) => console.error('[apiKeyAuth:usage]', err))

    return {
      valid: true,
      permissions: apiKey.permissions || [],
      keyId: apiKey.id,
      label: apiKey.label,
    }
  } catch (err) {
    console.error('[apiKeyAuth]', err)
    return null
  }
}

/**
 * Check if a permission set grants access to a collection+action.
 * Permissions are formatted as "collection:action" (e.g. "contacts:read", "deals:write").
 * "full-access" grants everything.
 */
export function hasPermission(
  permissions: string[],
  collection: string,
  action: 'read' | 'write',
): boolean {
  if (permissions.includes('full-access')) return true
  return permissions.includes(`${collection}:${action}`)
}
