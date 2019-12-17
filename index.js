const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Sse = require('json-sse')
const Gameroom = require(
  './gameroom/model'
)

const gameroomFactory = require(
  './gameroom/router'
)

const app = express()

const port = 4000

function onListen () {
  console.log(`Listening on :${port}`)
}

const jsonParser = bodyParser.json()
app.use(jsonParser)

const corsMiddleware = cors()
app.use(corsMiddleware)

const stream = new Sse()
const gameroomRouter = gameroomFactory(
  stream
)
app.use(gameroomRouter)

app.get('/', (request, response) => {
  stream.send('test')

  response.send('hello')
})

app.get(
  '/stream',
  async (request, response, next) => {
    try {
      const gamerooms = await Gameroom
        .findAll()

      const action = {
        type: 'ALL_GAMEROOMS',
        payload: gamerooms
      }

      const string = JSON
        .stringify(action)

      stream.updateInit(string)
      stream.init(request, response)
    } catch (error) {
      next(error)
    }
  }
)

app.listen(port, onListen)
