import React from 'react'
const AddBlogForm = ({ onSubmit, handleChange, title, author, url }) => (
    <div>
        <h2>Create new</h2>
        <form onSubmit={onSubmit}>
            <div>
                title
           <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </div>
            <div>
                author
           <input
                    type="text"
                    name="author"
                    value={author}
                    onChange={handleChange}
                />
            </div>
            <div>
                url
           <input
                    type="text"
                    name="url"
                    value={url}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Create</button>
        </form>
    </div>
)

export default AddBlogForm