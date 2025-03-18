// store.ts
import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducres/authReducer";
import { postReducer } from "./reducres/postReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
