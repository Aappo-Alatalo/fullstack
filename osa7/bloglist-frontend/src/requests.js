import axios from "axios"

const baseUrl = "api/blogs"

export const updateBlogLikes = (blogToUpdate) =>
  axios
    .put(`${baseUrl}/${blogToUpdate.id}`, {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    })
    .then((res) => res.data)
