const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({})
    .populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
    response.json(users.map(User.format))
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({username: body.username})
    
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }
    if (body.password.length<3) {
      return response.status(400).json({ error: 'password must be atleast 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    let isAdult = true
    if (body.adult !== undefined) {
        isAdult = body.adult
    }
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: isAdult
    })

    const savedUser = await user.save()

    response.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter