import { combineReducers, createStore } from "redux";
import { jwtReducer } from "./reducers/jwtReducer";
import { usersReducer } from "./reducers/usersReducer";

const reducers = combineReducers({
  jwt: jwtReducer,
  users: usersReducer,
});

export const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    : null
);
