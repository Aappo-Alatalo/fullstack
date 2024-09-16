import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL,
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogURL('')
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
                title:
          <input data-testid='titleInput' id='titleInput' value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)}/>
        </div>
        <div>
                author:
          <input data-testid='authorInput' id='authorInput' value={newBlogAuthor} onChange={(e) => setNewBlogAuthor(e.target.value)}/>
        </div>
        <div>
                url:
          <input data-testid='urlInput' id='urlInput' value={newBlogURL} onChange={(e) => setNewBlogURL(e.target.value)}/>
        </div>
        <button data-testid='submitBlogButton' id='submitBlogButton' type='submit'>create</button>
      </form>
    </>
  )
}

export default BlogForm