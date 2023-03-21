import { responseData } from '../../lib/openaiConfig'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import clientPromise from '../../db/mongodb'

const handler = withApiAuthRequired(async (req, res) => {
  const { user } = await getSession(req, res)
  const client = await clientPromise
  const db = client.db('Fatty-Autocompleted-Article')
  const userProflie = await db
    .collection('users')
    .findOne({ auth0Id: user.sub })

  if (!userProflie?.availableTokens) {
    res.status(403)
    return
  }

  const { topic, keywords } = req.body

  if (!topic) {
    res.status(422)
    return
  }

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  )

  const parsed = await responseData(topic, keywords)

  const post = await db.collection('posts').insertOne({
    postContent: parsed?.postContent,
    title: parsed?.title,
    metaDesc: parsed?.metaDesc,
    topic,
    keywords,
    userId: userProflie._id,
    createdAt: new Date(),
  })

  res.status(200).json({
    postId: post.insertedId,
  })
})

export default handler
