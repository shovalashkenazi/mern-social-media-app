import { AnyAction } from "redux";

export interface User {
  _id: string;
  email: string;
  username: string;
  profileImage?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  loading: false,
  error: null,
};

export const authReducer = (
  state = initialState,
  action: AnyAction
): AuthState => {
  switch (action.type) {
    // Login cases
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // Registration cases
    case "REGISTER_START":
      return { ...state, loading: true, error: null };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      };
    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      return {
        accessToken: null,
        refreshToken: null,
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};
