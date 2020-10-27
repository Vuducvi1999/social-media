import { GET_USER } from "../actions/actionTypes";

const init = { token: "", user: {} };

export const jwtReducer = (state = init, action) => {
  switch (action.type) {
    case GET_USER:
      return { ...action.payload };
    default:
      return state;
  }
};
