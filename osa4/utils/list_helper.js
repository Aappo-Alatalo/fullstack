const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const mostLikedBlog = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorBlogCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})

    const mostBlogsAuthor = Object.keys(authorBlogCounts).reduce((a, b) => {
        return authorBlogCounts[a] > authorBlogCounts[b] ? a : b
    })

    return {
        author: mostBlogsAuthor,
        blogs: authorBlogCounts[mostBlogsAuthor]
    }
}
    
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}