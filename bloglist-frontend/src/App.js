import React from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import LogoutForm from './components/LogoutForm'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      error: null,
      username: '',
      password: '',
      user: null,
      title: '',
      author: '',
      url: ''
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  handleTextFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.setState({
        error: 'käyttäjätunnus tai salasana virheellinen',
        username: '',
        password: ''
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  logout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      await this.setState({ user: null })
      blogService.setToken(null)
    } catch (exception) {
      this.setState({
        error: 'something went wrong',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  addBlog = async (event) => {
    event.preventDefault()
    this.addBlogForm.toggleVisibility()
    try {
      if (this.state.title === '' || this.state.url === '') {
        await this.setState({
          title: undefined,
          url: undefined
        })
      }
      const blogObject = {
        title: this.state.title,
        author: this.state.author,
        url: this.state.url,
      }

      const newBlog = await blogService.create(blogObject)
      newBlog.user = this.state.user
      newBlog.user._id = this.state.user.id

      this.setState({
        error: 'blog succesfully added',
        blogs: this.state.blogs.concat(newBlog),
        title: '',
        author: '',
        url: ''
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)

    } catch (exception) {
      this.setState({
        error: 'title or url missing',
        title: '',
        author: '',
        url: ''
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  deleteBlog = (id) => async () => {
    if (window.confirm("Delete blog?")) {
      try {
        await blogService.remove(id)
        const blogs = this.state.blogs
        blogs
          .splice(
          blogs.findIndex(x => x.id === id),
          1)
        this.setState({
          error: 'blog succesfully deleted',
          blogs: blogs
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 5000)
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  render() {

    const DeleteButton = ({ user, loggedUser, deleteThis }) => {
      if (user._id === loggedUser.id) {
        return (
          <div>
            <p><button onClick={deleteThis}>Delete</button></p>
          </div>
        )
      }
      return (
        ""
      )

    }

    const sortedBlogs = (
      this.state.blogs.sort(function (a, b) {
        return b.likes - a.likes;
      })
    )

    if (this.state.user === null) {
      return (
        <div>
          <Notification message={this.state.error} />
          <Togglable buttonLabel="login">
            <LoginForm
              visible={this.state.visible}
              username={this.state.username}
              password={this.state.password}
              handleTextFieldChange={this.handleTextFieldChange}
              handleSubmit={this.login}
            />
          </Togglable>
        </div>
      )
    }

    return (
      <div>
        <Notification message={this.state.error} />
        <h2>blogs</h2>
        <p>{this.state.user.name} logged in</p>
        <LogoutForm logout={this.logout} />
        <br />
        <Togglable buttonLabel="new blog" ref={component => this.addBlogForm = component}>
          <AddBlogForm
            onSubmit={this.addBlog}
            title={this.state.title}
            author={this.state.author}
            url={this.state.url}
            handleChange={this.handleTextFieldChange}
          />
        </Togglable>
        <br />
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            id={blog.id}
            title={blog.title}
            author={blog.author}
            url={blog.url}
            likes={blog.likes}
            user={blog.user}
          >
            <DeleteButton
              user={blog.user}
              loggedUser={this.state.user}
              deleteThis={this.deleteBlog(blog.id)}
            />
          </Blog>
        )}
      </div>
    )
  }
}

export default App;
