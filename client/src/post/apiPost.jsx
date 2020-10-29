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
