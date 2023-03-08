import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import AppLayout from '../../../components/AppLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import getAppProps from '../../../lib/getAppProps'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NewPost() {
  const router = useRouter()
  const [post, setPost] = useState({
    topic: '',
    keywords: '',
  })
  const [generating, setGenerating] = useState(false)

  const handleChange = e => {
    setPost({ ...post, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setGenerating(true)
    try {
      const res = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          topic: post.topic,
          keywords: post.keywords.split(' ').join(','),
        }),
      })
      const result = await res.json()
      if (result?.postId) {
        router.push(`/post/${result.postId}`)
      }
      setGenerating(false)
    } catch (error) {
      setGenerating(false)
      console.error(error)
    }
  }

  return (
    <div className="h-full overflow-hidden">
      {!!generating && (
        <div className="text-green-[#2f4f4f] flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>文章生成中...</h6>
        </div>
      )}
      {!generating && (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl shadow-slate-200 border"
          >
            <div>
              <label>
                <strong>設定文章主題:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={post.topic}
                onChange={handleChange}
                name="topic"
                placeholder="ex: 新手養寵物要注意什麼?"
              />
            </div>
            <div>
              <label>
                <strong>設定文章關鍵字:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={post.keywords}
                onChange={handleChange}
                name="keywords"
                placeholder="ex: 飲食 活動空間... 非必填"
              />
              <small className="block">請用空格或是半形逗號分隔</small>
            </div>
            <button
              type="submit"
              className="btn bg-[#2f4f4f] hover:bg-[#2a9696]  w-4/5 mx-auto mt-4"
              disabled={!post.topic.trim()}
            >
              生成文章
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context)

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-popup',
          permanent: false,
        },
      }
    }

    return {
      props,
    }
  },
})
