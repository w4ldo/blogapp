const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedContents = response.body.map(n => n.content)
    blogsInDatabase.forEach(blog => {
      expect(returnedContents).toContain(blog.content)
    })
  })

  test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
    const blogsInDatabase = await blogsInDb()
    const aBlog = blogsInDatabase[0]

    const response = await api
      .get(`/api/blogs/${aBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.content).toBe(aBlog.content)
  })

  test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId()

    const response = await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    const invalidId = "5a3d5da59070081a82a3445"

    const response = await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

  describe('addition of a new blog', async () => {

    test('POST /api/blogs succeeds with valid data', async () => {
      const blogsAtStart = await blogsInDb()

      const newBlog = {
        title: 'newBlog',
        author: 'author',
        url: 'www.durr.fi',
        likes: 911
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

      const titles = blogsAfterOperation.map(r => r.title)
      expect(titles).toContain('newBlog')
    })


    test('blog without likes set has 0 likes', async () => {
        const newBlog = {
            title: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
            author: 'true',
            url: 'www.postTest.fi'
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const response = await api
            .get('/api/blogs')
    
        const likes = response.body.map(r => r.likes)
    
        expect(response.body.length).toBe(initialBlogs.length + 2)
        expect(likes).toContain(0)
    })
    
    test('POST /api/blogs fails with proper statuscode if TITLE is missing', async () => {
        const newBlog = {
            author: 'true',
            url: 'www.fake.com',
            likes: 0
        }
    
        const intialBlogs = await api
            .get('/api/blogs')
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const response = await api
            .get('/api/blogs')
    
        expect(response.body.length).toBe(intialBlogs.body.length)
    })
    
    test('POST /api/notes fails with proper statuscode if URL is missing', async () => {
        const newBlog = {
            title: 'fake',
            author: 'true',
            likes: 0
        }
    
        const intialBlogs = await api
            .get('/api/blogs')
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const response = await api
            .get('/api/blogs')
    
        expect(response.body.length).toBe(intialBlogs.body.length)
    })

  })

  describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        title: 'poisto pyynnöllä HTTP DELETE',
        author: 'false',
        url: 'www.delete.fi',
        likes: 100
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(r => r.title)

      expect(titles).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
  })

  afterAll(() => {
    server.close()
  })

})  