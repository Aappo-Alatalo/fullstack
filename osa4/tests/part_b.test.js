const { test, after, beforeEach } = require('node:test')
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

after(async () => {
  await mongoose.connection.close()
})