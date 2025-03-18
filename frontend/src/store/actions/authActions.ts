import { Dispatch } from "redux";
import { User } from "../reducres/authReducer";

// LOGIN ACTIONS
export const loginStart = () => ({ type: "LOGIN_START" });

export const loginSuccess = (
  accessToken: string,
  refreshToken: string,
  user: User
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  return {
    type: "LOGIN_SUCCESS",
    payload: { accessToken, refreshToken, user },
  };
};

export const loginFailure = (error: string) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const logout = () => {
  localStorage.clear();
  return { type: "LOGOUT" };
};

// Thunk for login (email & password)
export const loginUser = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginStart());
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(loginSuccess(data.accessToken, data.refreshToken, data.user));
      } else {
        dispatch(loginFailure(data.message));
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message));
    }
  };
};

// REGISTRATION ACTIONS
export const registerStart = () => ({ type: "REGISTER_START" });

export const registerSuccess = (
  accessToken: string,
  refreshToken: string,
  user: User
) => {
  return {
    type: "REGISTER_SUCCESS",
    payload: { accessToken, refreshToken, user },
  };
};

export const registerFailure = (error: string) => ({
  type: "REGISTER_FAILURE",
  payload: error,
});

// Thunk for registration
export const registerUser = (
  email: string,
  username: string,
  password: string
) => {
  return async (dispatch: Dispatch) => {
    dispatch(registerStart());
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(
          registerSuccess(data.accessToken, data.refreshToken, data.user)
        );
      } else {
        dispatch(registerFailure(data.message));
      }
    } catch (error: any) {
      dispatch(registerFailure(error.message));
    }
  };
};

// OAuth LOGIN (Google/Facebook)
export const oauthLogin = (provider: "google" | "facebook", token: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginStart());
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${provider}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        dispatch(loginSuccess(data.accessToken, data.refreshToken, data.user));
      } else {
        dispatch(loginFailure(data.message));
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message));
    }
  };
};
