// Server API route for subscribing via Resend
// POST /api/subscribe { email, name }
import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        return { error: 'Method not allowed' }
    }

    const config = useRuntimeConfig()
    if (!config.resendApiKey) {
        return { error: 'Server configuration error' }
    }

    const body = await readBody(event)
    const { email, name } = body ?? {}

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return { error: 'Invalid email address' }
    }
    if (!name || typeof name !== 'string' || !name.trim() || name.length > 100) {
        return { error: 'Missing first name' }
    }

    const resend = new Resend(config.resendApiKey)

    try {
        await resend.contacts.create({
            email: email.trim().toLowerCase(),
            firstName: name.trim(),
            unsubscribed: false,
        })
        return { success: true }
    } catch (e) {
        return { error: e.message || 'Failed to subscribe' }
    }
})
