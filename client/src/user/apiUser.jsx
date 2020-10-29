import { API_URL } from "../config";

export const signinAPI = (email, password) => {
  return fetch(`${API_URL}/user/signin`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const signupAPI = (formData) => {
  return fetch(`${API_URL}/user/signup`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const getUsers = () =>
  fetch(`${API_URL}/user/users`, { method: "GET" })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const getUser = (id) =>
  fetch(`${API_URL}/user/${id}`, { method: "GET" })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const deleteUser = (id, token) =>
  fetch(`${API_URL}/user/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const updateUser = (id, token, form) =>
  fetch(`${API_URL}/user/update/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const followUser = (userId, followId, token) =>
  fetch(`${API_URL}/user/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ userId, followId }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const unfollowUser = (userId, unfollowId, token) =>
  fetch(`${API_URL}/user/unfollow`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ userId, unfollowId }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const getUserPosts = (id) =>
  fetch(`${API_URL}/post/by/${id}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
