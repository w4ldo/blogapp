const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return total
}

const favoriteBlog = (blogs) => {
    let favorite = {
        likes: 0
    }
    for (x in blogs) {
        if (blogs[x].likes >= favorite.likes) {
            favorite = blogs[x]
        }
    }
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    let most = 0
    let author = ""

    const authorsOfBlogs = blogs.reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] || []
        authors[blog.author].push(
            [blog.title]
        )
        return authors
    }, {})

    for (x in authorsOfBlogs) {
        if (authorsOfBlogs[x].length >= most) {
            most = authorsOfBlogs[x].length
            author = x
        }
    }

    return {
        author: author,
        blogs: most
    }
}

const mostLikes = (blogs) => {
    let most = 0
    let author = ""

    const authorsOfBlogs = blogs.reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] || []
        authors[blog.author].push(
            [blog.likes]
        )
        return authors
    }, {})


    for (x in authorsOfBlogs) {
        let helper = 0
        for (y in authorsOfBlogs[x]) {
            helper = helper + Number(authorsOfBlogs[x][y])
        }
        if (helper >= most) {
            most = helper
            author = x
        }
    }

    return {
        author: author,
        likes: most
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}