import axios from "axios";
import { Dispatch } from "redux";

export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_POSTS_USERNAME = "UPDATE_POSTS_USERNAME";

// ✅ Update User Profile & Posts
export const updateProfile =
  (userId: string, updatedData: any) =>
  async (dispatch: Dispatch, getState: any) => {
    try {
      const formData = new FormData();
      formData.append("username", updatedData.username);
      formData.append("email", updatedData.email);
      if (updatedData.profileImage)
        formData.append("profileImage", updatedData.profileImage);

      // ✅ Send update request to backend
      const { data } = await axios.put(
        `http://localhost:5000/api/auth/update-profile/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // ✅ Dispatch action to update user profile in Redux
      dispatch({ type: UPDATE_PROFILE, payload: data.user });

      // ✅ Dispatch action to update all posts of this user
      dispatch({
        type: UPDATE_POSTS_USERNAME,
        payload: {
          username: data.user.username,
          profileImage: data.user.profileImage,
        },
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };
