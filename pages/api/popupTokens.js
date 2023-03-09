import { getSession } from '@auth0/nextjs-auth0'

import stripeInit from 'stripe'

import clientPromise from '../../db/mongodb'

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY)

const handler = async (req, res) => {
  const { user } = await getSession(req, res)

  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ]

  const protocol =
    process.env.NODE_ENV === 'development' ? 'http://' : 'https://'
  const host = req.headers.host

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${protocol}${host}/success`,
    payment_intent_data: {
      metadata: {
        sub: user.sub,
      },
    },
    metadata: {
      sub: user.sub,
    },
  })

  const client = await clientPromise

  const db = client.db('Fatty-Autocompleted-Article')

  const userProfile = await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    }
  )

  res.status(200).json({ session: checkoutSession })
}

export default handler
