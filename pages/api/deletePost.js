import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { ObjectId } from 'mongodb'
import clientPromise from '../../db/mongodb'

export default withApiAuthRequired(async function (req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res)
    const client = await clientPromise
    const db = client.db('Fatty-Autocompleted-Article')
    const userProfile = await db.collection('users').findOne({ auth0Id: sub })

    const { postId } = req.body

    await db.collection('posts').deleteOne({
      userId: userProfile._id,
      _id: new ObjectId(postId),
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
  }
  return
})
