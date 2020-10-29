import { GET_ALL_POST } from "../actions/actionTypes";

const init = [];

export const postsReducer = (state = init, action) => {
  switch (action.type) {
    case GET_ALL_POST:
      return [...action.payload];
    default:
      return state;
  }
};
