const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initBlogs)
})

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 2)
})

test('blog identifier name is "id"', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  blogs.forEach(blog => {
    assert.strictEqual(blog.id !== undefined, true, 'Blog does not have field "id"')
    assert.strictEqual(blog._id, undefined, 'Blog has "_id" field, should have just "id"')
  })
})

test('creation of a new blog is possible', async () => {
  const title = 'test blog'
  const newBlog = {
    title: title,
    author: 'Aappo Alatalo',
    url: 'bebebeb//::htmljeeejee',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  
  assert.strictEqual(response.body.length, helper.initBlogs.length + 1)
  assert(titles.includes(title))
})

// 4.11*
test('value of likes is set to 0 if a value is not given', async () => {
  // Blog is missing value for likes
  const flawedBlog = {
    title: 'This blog is flawed',
    author: 'Aappo Alatalo',
    url: 'bebebeb//::htmljeeejee',
  }

  await api
    .post('/api/blogs')
    .send(flawedBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const likesArray = response.body.map(r => r.likes)
  assert(!likesArray.includes(undefined))
})

// 4.12*
describe('POST request fails if', () => {
  test('title is missing', async () => {
      // Blog is missing value for title
      const flawedBlog = {
        author: 'Aappo Alatalo',
        url: 'bebebeb//::htmljeeejee',
        likes: 4
      }
      await api
        .post('/api/blogs')
        .send(flawedBlog)
        .expect(400)
  })
  test('url is missing', async () => {
    // Blog is missing value for url
    const flawedBlog = {
      title: 'flawed blog',
      author: 'Aappo Alatalo',
      likes: 4
    }
    await api
      .post('/api/blogs')
      .send(flawedBlog)
      .expect(400)
  })
  test('title AND url are missing', async () => {
    // Blog is missing value for title and url
    const flawedBlog = {
      author: 'Aappo Alatalo',
      likes: 4
    }
    await api
      .post('/api/blogs')
      .send(flawedBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})