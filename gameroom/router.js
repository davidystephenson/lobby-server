// const express = require('express')
//
// const { Router } = express

const { Router } = require('express')

const Gameroom = require('./model')

function factory (stream) {
  const router = new Router()

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
