import axios from "axios";
import { Dispatch } from "redux";

export const FETCH_POSTS = "FETCH_POSTS";
export const ADD_POST = "ADD_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";
export const LIKE_POST = "LIKE_POST";
export const COMMENT_POST = "COMMENT_POST";
export const FETCH_USER_POSTS = "FETCH_USER_POSTS";
export const UPDATE_POSTS_USERNAME = "UPDATE_POSTS_USERNAME";

// Fetch all posts
export const fetchPosts = () => async (dispatch: Dispatch) => {
  const { data } = await axios.get("http://localhost:5000/api/posts/");
  dispatch({ type: FETCH_POSTS, payload: data });
};

// Fetch posts by user
export const fetchUserPosts =
  (userId: string) => async (dispatch: Dispatch) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/posts/user/${userId}`
    );
    dispatch({ type: FETCH_USER_POSTS, payload: data });
  };

// Create a new post
export const addPost =
  (content: string, image: File | null) =>
  async (dispatch: Dispatch, getState: any) => {
    const { auth } = getState();
    if (!auth.user || !auth.user._id) {
      console.error("❌ Missing user ID when creating a post");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("userId", auth.user._id);
    formData.append("username", auth.user.username);
    formData.append("avatar", auth.user.profileImage || "");

    if (image) formData.append("image", image);

    const { data } = await axios.post(
      "http://localhost:5000/api/posts",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    dispatch({ type: ADD_POST, payload: data });
  };

// Edit a post
export const updatePost =
  (postId: string, updatedData: { content: string; image?: File | null }) =>
  async (dispatch: Dispatch) => {
    const formData = new FormData();
    formData.append("content", updatedData.content);
    if (updatedData.image) formData.append("image", updatedData.image);

    const { data } = await axios.put(
      `http://localhost:5000/api/posts/${postId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    dispatch({ type: UPDATE_POST, payload: data });
  };

// Delete a post
export const deletePost = (postId: string) => async (dispatch: Dispatch) => {
  await axios.delete(`http://localhost:5000/api/posts/${postId}`);
  dispatch({ type: DELETE_POST, payload: postId });
};

// Like a post
export const likePost =
  (postId: string) => async (dispatch: Dispatch, getState: any) => {
    const { auth } = getState();
    if (!auth.user || !auth.user._id) return;

    const { data } = await axios.put(
      `http://localhost:5000/api/posts/like/${postId}`,
      {
        userId: auth.user._id,
      }
    );
    dispatch({ type: LIKE_POST, payload: data });
  };

// Comment on a post
export const commentPost =
  (postId: string, text: string) =>
  async (dispatch: Dispatch, getState: any) => {
    const { auth } = getState();
    if (!auth.user || !auth.user._id) return;

    const { data } = await axios.post(
      `http://localhost:5000/api/posts/comment/${postId}`,
      {
        userId: auth.user._id,
        username: auth.user.username,
        avatar: auth.user.profileImage,
        text,
      }
    );

    dispatch({ type: COMMENT_POST, payload: data });
  };
