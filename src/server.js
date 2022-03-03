// const express = require("express") <-- OLD IMPORT SYNTAX
import express from "express" // <-- NEW IMPORT SYNTAX (remember to add type: "module" to package.json to use it!)
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import usersRouter from "./services/users/index.js"
import booksRouter from "./services/books/index.js"
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express()

const port = 3001

// *********************************** MIDDLEWARES ***********************************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`)
  // console.log(req.headers)
  req.name = "Stefano"
  next()
}

const fakeAuthMiddleware = (req, res, next) => {
  if (req.name !== "Stefano") res.status(401).send({ message: "Only Stefanos are allowed!" })
  else next()
}

server.use(loggerMiddleware) // Global middleware
server.use(cors())
// server.use(fakeAuthMiddleware) // Global middleware
server.use(express.json()) // If you don't add this configuration to our server (BEFORE the endpoints), all requests' bodies will be UNDEFINED

// *********************************** ENDPOINTS *************************************

server.use("/users", usersRouter)
server.use("/books", fakeAuthMiddleware, booksRouter)

// ********************************** ERROR HANDLERS *********************************

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
