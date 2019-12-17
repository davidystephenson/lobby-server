// const express = require('express')
//
// const { Router } = express

const { Router } = require('express')

const Gameroom = require('./model')
const User = require('../user/model')

function factory (stream) {
  const router = new Router()

  router.put(
    '/join',
    async (request, response, next) => {
      try {
        const user = await User.update(
          {
            gameroomId: request.body.gameroomId
          },
          {
            where: {
              id: request.body.userId
            }
          }
        )

        const everything = await Gameroom
          .findAll({ include: [User] })

        const action = {
          type: 'ALL_GAMEROOMS',
          payload: everything
        }

        const string = JSON
          .stringify(action)

        stream.send(string)

        response.send(user)
      } catch (error) {
        next(error)
      }
    }
  )

  router.post(
    '/gameroom',
    async (request, response, next) => {
      try {
        const gameroom = await Gameroom
          .create(request.body)

        const action = {
          type: 'NEW_GAMEROOM',
          payload: gameroom
        }

        const string = JSON
          .stringify(action)

        stream.send(string)

        response.send(gameroom)
      } catch (error) {
        next(error)
      }
    }
  )

  return router
}

module.exports = factory
