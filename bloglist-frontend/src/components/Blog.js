import React from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'



class Blog extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      title: props.title,
      author: props.author,
      url: props.url,
      likes: props.likes,
      user: props.user,
      visible: false,
      deleteThis: props.deleteBlog,
      loggedUser: props.loggedUser
    }
  }


  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }
  updateBlog = async () => {
    try {
      const blogObject = {
        title: this.state.title,
        author: this.state.author,
        url: this.state.url,
        likes: this.state.likes + 1,
        user: this.state.user
      }
      const updatedBlog = await blogService.update(this.state.id, blogObject)

      this.setState({
        likes: updatedBlog.likes
      })
    } catch (exception) {
      console.log(exception)
    }
  }

  render() {

    const showWhenVisible = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
      display: this.state.visible ? '' : 'none'
    }
    const hideWhenVisible = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
      display: this.state.visible ? 'none' : ''
    }


    return (
      <div>
        <div style={hideWhenVisible}>
          <h4 onClick={this.toggleVisibility}>{this.state.title}</h4>
        </div>
        <div style={showWhenVisible}>
          <h4 onClick={this.toggleVisibility}>title: {this.state.title}</h4>
          <p>author: {this.state.author}</p>
          <p>url: <a href="">{this.state.url}</a></p>
          <p>likes: {this.state.likes} <button onClick={this.updateBlog}>like</button></p>
          <p>added by: {this.state.user.name}</p>
          {this.props.children}

        </div>
      </div>
    )
  }
}

export default Blog