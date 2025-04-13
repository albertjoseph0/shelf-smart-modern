import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { getAccountByUserId, createAccount } from '../../lib/db'

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)
    
    if (eventType === 'user.created') {
      console.log('userId:', evt.data.id)
      
      try {
        // Check if account exists
        const existingAccount = await getAccountByUserId(evt.data.id)
        
        if (!existingAccount) {
          // Create new account
          const newAccount = await createAccount(evt.data.id)
          console.log('Created new account:', newAccount)
        } else {
          console.log('Account already exists for user:', evt.data.id)
        }
      } catch (error) {
        console.error('Error handling user creation:', error)
      }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}