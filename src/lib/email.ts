/**
 * Email adapter — wire this to ConvertKit or Beehiiv.
 *
 * To activate:
 *  1. Set EMAIL_PROVIDER=convertkit (or beehiiv) in .env
 *  2. Set CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID   OR
 *     BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID
 *  3. Replace the TODO blocks below with the provider SDK calls.
 */

export type SubscribeParams = {
  email: string
  tag?: string        // e.g. 'lead-magnet' | 'newsletter'
  formId?: string     // override the default form/list
}

export async function subscribeEmail(params: SubscribeParams): Promise<void> {
  const { email, tag, formId } = params
  const provider = process.env.EMAIL_PROVIDER

  if (!provider) {
    // Dev mode — log and continue (no error)
    console.log(`[email:stub] subscribe ${email} tag=${tag ?? 'none'} form=${formId ?? 'default'}`)
    return
  }

  if (provider === 'convertkit') {
    // TODO: ConvertKit implementation
    // const ConvertKit = require('@convertkit/convertkit-node')
    // const ck = new ConvertKit(process.env.CONVERTKIT_API_KEY)
    // await ck.subscribeToForm(formId ?? process.env.CONVERTKIT_FORM_ID, { email_address: email })
    throw new Error('ConvertKit wiring not yet implemented — see src/lib/email.ts')
  }

  if (provider === 'beehiiv') {
    // TODO: Beehiiv implementation
    // const res = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, tags: tag ? [tag] : [] })
    // })
    throw new Error('Beehiiv wiring not yet implemented — see src/lib/email.ts')
  }

  throw new Error(`Unknown EMAIL_PROVIDER: ${provider}`)
}
