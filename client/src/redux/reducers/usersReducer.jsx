import { GET_ALL_USER } from "../actions/actionTypes";

const init = [];

export const usersReducer = (state = init, action) => {
  switch (action.type) {
    case GET_ALL_USER:
      return [...action.payload];
    default:
      return state;
  }
};
