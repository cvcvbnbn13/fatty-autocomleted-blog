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

  // const response = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   temperature: 0,
  //   max_tokens: 3600,
  //   prompt: `Write a long and detailed SEO-friendly blog post about${topic} in Traditional Chinese ，針對以下用逗號分隔的關鍵字:${keywords}。
  //   The content should be formatted in SEO-friendly HTML.
  //   Please,make sure the content in correct paragraphs.
  //   The response must also include appropriate HTML title and meta description content.
  //   The response format must be stringified JSON in the following format:
  //   {
  //     "postContent": post content here
  //     "title": title goes here
  //     "metaDesc": meta description goes here
  //   }`,
  //   stream: true,
  // })

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

  const response = responseData()

  console.log(response)

  const parsed = JSON.parse(response.data.choices[0]?.text.split('\n').join(''))

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
