import React, { useState } from 'react'
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import AppLayout from '../../../components/AppLayout'
import clientPromise from '../../../db/mongodb'
import { ObjectId } from 'mongodb'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import getAppProps from '../../../lib/getAppProps'
import { useRouter } from 'next/router'
import { usePosts } from '../../../context/postsProvider'

const Post = props => {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { deletePost } = usePosts()

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/deletePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ postId: props.id }),
      })
      const result = await res.json()

      if (result.success) {
        deletePost(props.id)
        router.replace('/post/new')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="overflow-auto h-full pb-12">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p02 bg-stone-200 rounded-sm">
          SEO 標題及簡介
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDesc}</div>
        </div>
        <div className="text-sm font-bold mt-6 p02 bg-stone-200 rounded-sm">
          關鍵字
        </div>
        <div className="flex flex-wrap pt-4 gap-1">
          {props.keywords?.split(',').map(keyword => (
            <div
              key={keyword}
              className="py-2 px-4 rounded-full bg-slate-800 text-white"
            >
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p02 bg-stone-200 rounded-sm">
          文章內容
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent }} />
        <div className="my-4">
          {!showDeleteConfirm && (
            <button
              className="btn bg-red-600 hover:bg-red-800"
              onClick={() => setShowDeleteConfirm(true)}
            >
              刪除文章
            </button>
          )}
          {showDeleteConfirm && (
            <div>
              <p className="p-2 bg-red-300 text-center">
                確定要刪除這篇文章嗎? 文章一經刪除就不能回復
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn bg-stone-600 hover:bg-stone-700"
                >
                  取消
                </button>
                <button
                  onClick={handleDeletePost}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  確認刪除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Post

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context)
    const userSession = await getSession(context.req, context.res)
    const client = await clientPromise
    const db = client.db('Fatty-Autocompleted-Article')
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub,
    })
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(context.params.postId),
      userId: user._id,
    })

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false,
        },
      }
    }

    return {
      props: {
        id: context.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDesc: post.metaDesc,
        keywords: post.keywords,
        postCreatedAt: post.createdAt.toString(),
        ...props,
      },
    }
  },
})
