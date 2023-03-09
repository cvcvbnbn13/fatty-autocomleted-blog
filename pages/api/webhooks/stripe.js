import Cors from 'micro-cors'
import stripeInit from 'stripe'
import verifyStripe from '@webdeveducation/next-verify-stripe'
import clientPromise from '../../../db/mongodb'

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req, res) => {
  if (req.method === 'POST') {
    let event
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      })
    } catch (error) {
      console.error(error)
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const client = await clientPromise

        const db = client.db('Fatty-Autocompleted-Article')

        const paymentIntent = event.data.object
        const auth0Id = paymentIntent.metadata.sub

        const userProfile = await db.collection('users').updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          {
            upsert: true,
          }
        )
      }
      default:
        console.log('無任何動作')
    }
    res.status(200).json({ received: true })
  }
}

export default cors(handler)
