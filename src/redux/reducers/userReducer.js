import {
  FETCH_USER_LOGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  USER_LOGOUT,
  USER_REFRESH,
} from "../actions/userAction";

const INITIAL_STATE = {
  account: {
    email: "",
    auth: null,
    token: "",
  },
  isLoading: false,
  isError: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case FETCH_USER_SUCCESS:
      console.log("=>>>>>>", action);
      return {
        ...state,
        account: {
          auth: true,
          email: action.data.email,
          token: action.data.token,
        },
        isLoading: false,
        isError: false,
      };
    case FETCH_USER_ERROR:
      return {
        ...state,
        account: {
          auth: false,
        },
        isLoading: false,
        isError: true,
      };
    case USER_LOGOUT:
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      return {
        ...state,
        account: {
          auth: false,
          email: "",
          token: "",
        },
      };
    case USER_REFRESH:
      return {
        ...state,
        account: {
          auth: true,
          email: localStorage.getItem("email"),
          token: localStorage.getItem("token"),
        },
      };
    default:
      return state;
  }
};

export default userReducer;
