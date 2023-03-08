import React, { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import Logo from '../Logo'
import { usePosts } from '../../context/postsProvider'

const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreatedAt,
}) => {
  const { user } = useUser()

  const { setPostsFromSSR, posts, getPosts, noMorePosts } = usePosts()

  useEffect(() => {
    setPostsFromSSR(postsFromSSR)
    if (postId) {
      const exists = postsFromSSR.find(post => post._id === postId)
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreatedAt })
      }
    }
  }, [getPosts, postCreatedAt, postId, postsFromSSR, setPostsFromSSR])

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/post/new" className="btn hover:bg-[#2a9696] ">
            創建新文章
          </Link>
          <Link href="/token-popup" className="block mt-4 mb-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} Fatty幣可以使用</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-[#2f4f4f]">
          {posts.map(post => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`block text-ellipsis overflow-hidden whitespace-nowrap my-2 px-2 py-2 mx-2 bg-white/10 cursor-pointer rounded-md  hover:bg-[#2f4f4f] transition-colors ${
                postId === post._id ? 'bg-white/20 border border-white' : ''
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && posts.length > 5 && (
            <div
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].createdAt })
              }
              className="text-sm text-slate-400 text-center cursor-pointer mt-4 hover:underline"
            >
              載入更多文章
            </div>
          )}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <React.Fragment>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </React.Fragment>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default AppLayout
