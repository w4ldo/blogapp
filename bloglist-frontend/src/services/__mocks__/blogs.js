let token = null

const blogs = [
  {
    id: "5a451df7571c224a31b5c8ce",
    title: "eka blogi",
    author: "hessu",
    url: "www.eka.fi",
    likes: 100,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  },
  {
    id: "5a451e21e0b8b04a45638211",
    title: "toka blogi",
    author: "ossi",
    url: "www.toka.fi",
    likes: 101,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  },
  {
    id: "5a451e30b5ffd44a58fa79ab",
    title: "kolmas blogi",
    author: "jussi",
    url: "www.kolmas.fi",
    likes: 102,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll, blogs }