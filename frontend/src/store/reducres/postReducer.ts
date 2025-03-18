import {
  ADD_POST,
  FETCH_POSTS,
  UPDATE_POST,
  DELETE_POST,
  LIKE_POST,
  COMMENT_POST,
  FETCH_USER_POSTS,
} from "../actions/postActions";
import { UPDATE_POSTS_USERNAME } from "../actions/userActions";

interface Post {
  _id: string;
  username: string;
  avatar?: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
}

interface Comment {
  user: string;
  username: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

interface PostState {
  posts: Post[];
  userPosts: Post[];
}

const initialState: PostState = {
  posts: [],
  userPosts: [],
};

export const postReducer = (state = initialState, action: any): PostState => {
  switch (action.type) {
    case FETCH_POSTS:
      return { ...state, posts: action.payload };

    case FETCH_USER_POSTS:
      return { ...state, userPosts: action.payload };

    case ADD_POST:
      return { ...state, posts: [action.payload, ...state.posts] };

    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };

    case LIKE_POST:
    case COMMENT_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    case UPDATE_POSTS_USERNAME:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.username === action.payload.oldUsername
            ? {
                ...post,
                username: action.payload.username,
                avatar: action.payload.profileImage,
              }
            : post
        ),
      };

    default:
      return state;
  }
};
