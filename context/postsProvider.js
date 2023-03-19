import React, {
  useCallback,
  useReducer,
  createContext,
  useContext,
} from 'react'
import { ADD_POST, DELETE_POST, SET_NO_MORE_POSTS } from './actions'
import reducer from './reducer'

const initialState = {
  posts: [],
  noMorePosts: false,
}

const postsContext = createContext()

const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const deletePost = useCallback(postId => {
    dispatch({
      type: DELETE_POST,
      payload: postId,
    })
  }, [])

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: ADD_POST,
      payload: postsFromSSR,
    })
  }, [])

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }) => {
      const res = await fetch('/api/getPosts', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ lastPostDate, getNewerPosts }),
      })

      const result = await res.json()
      const postsResult = result.posts || []

      if (postsResult.length < 5) {
        dispatch({
          type: SET_NO_MORE_POSTS,
          paylod: true,
        })
      }
      dispatch({
        type: ADD_POST,
        payload: postsResult,
      })
    },
    []
  )

  return (
    <postsContext.Provider
      value={{ ...state, deletePost, setPostsFromSSR, getPosts }}
    >
      {children}
    </postsContext.Provider>
  )
}

function usePosts() {
  return useContext(postsContext)
}

export { initialState, usePosts }

export default PostsProvider
