import { API_URL } from "../config";

export const getPosts = () =>
  fetch(`${API_URL}/post/posts`, { method: "GET" })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const postPost = (formData, token) =>
  fetch(`${API_URL}/post/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const updatePost = (formData, id, token) =>
  fetch(`${API_URL}/post/update/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const deletePost = (id, token) =>
  fetch(`${API_URL}/post/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const likePost = (userId, postId, token) =>
  fetch(`${API_URL}/post/like`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, postId }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const unlikePost = (userId, postId, token) =>
  fetch(`${API_URL}/post/unlike`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, postId }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const commentPost = (userId, postId, text, token) =>
  fetch(`${API_URL}/post/comment`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, userId, postId }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const uncommentPost = (userId, postId, text, token) =>
  fetch(`${API_URL}/post/uncomment`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, userId, postId }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const findPost = (find) =>
  fetch(`${API_URL}/post/find`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ find }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
