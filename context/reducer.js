import { ADD_POST, DELETE_POST, SET_NO_MORE_POSTS } from './actions'

const reducer = (state, action) => {
  if (action.type === ADD_POST) {
    let newPost = []
    action.payload.forEach(post => {
      const exists = state.posts.find(p => p._id === post._id)
      if (!exists) {
        newPost.push(post)
      }
    })
    return { ...state, posts: [...state.posts, ...newPost] }
  }

  if (action.type === DELETE_POST) {
    const filtered = state.posts.filter(post => post._id !== action.payload)
    return {
      ...state,
      posts: [...filtered],
    }
  }

  if (action.type === SET_NO_MORE_POSTS) {
    return {
      ...state,
      noMorePosts: action.paylod,
    }
  }
}

export default reducer
