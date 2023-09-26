import axios from "axios";

const instance = axios.create({
  baseURL: "https://reqres.in",
});

instance.interceptors.response.use(
  function (response) {
    // Do something before request is sent
    return response.data;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
export default instance;
