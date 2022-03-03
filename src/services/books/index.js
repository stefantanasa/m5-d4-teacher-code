// ************************************* BOOKS ENDPOINTS ************************************************

/* ************************************* BOOKS CRUD *****************************************************

1. CREATE --> POST http://localhost:3001/books/ (+ body)
2. READ --> GET http://localhost:3001/books/ (+ optional query parameters)
3. READ (single book) --> GET http://localhost:3001/books/:bookId
4. UPDATE (single book) --> PUT http://localhost:3001/books/:bookId (+ body)
5. DELETE (single book) --> DELETE http://localhost:3001/books/:bookId

*/

import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newBookValidation } from "./validation.js"
import { getBooks, getUsers, writeBooks } from "../../lib/fs-tools.js"

const booksRouter = express.Router()

const anotherStupidLoggerMiddleware = (req, res, next) => {
  console.log("I am anotherStupidLoggerMiddleware!")
  next()
}

booksRouter.post("/", newBookValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }

      const booksArray = await getBooks()

      booksArray.push(newBook)

      await writeBooks(booksArray)

      res.status(201).send({ id: newBook.id })
    } else {
      next(createHttpError(400, "Some errors occurred in req body", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})

booksRouter.get("/", anotherStupidLoggerMiddleware, async (req, res, next) => {
  try {
    // throw new Error("Kaboooooooooooooooooooooooooom!")
    const books = await getBooks()
    // const users = await getUsers()

    if (req.query && req.query.category) {
      const filteredBooks = books.filter(book => book.category === req.query.category)
      res.send(filteredBooks)
    } else {
      res.send(books)
    }
  } catch (error) {
    next(error) // next(error) is used to send errors to error handlers!
  }
})

booksRouter.get("/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId

    const books = await getBooks()

    const foundBook = books.find(book => book.id === bookId)
    if (foundBook) {
      res.send(foundBook)
    } else {
      next(createHttpError(404, `Book with id ${bookId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

booksRouter.put("/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId

    const books = await getBooks()

    const index = books.findIndex(book => book.id === bookId)

    if (index !== -1) {
      const oldBook = books[index]

      const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() }

      books[index] = updatedBook

      await writeBooks(books)

      res.send(updatedBook)
    } else {
      next(createHttpError(404, `Book with id ${bookId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

booksRouter.delete("/:bookId", async (req, res, next) => {
  try {
    const bookId = req.params.bookId

    const books = await getBooks()

    const remainingBooks = books.filter(book => book.id !== bookId)

    await writeBooks(remainingBooks)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default booksRouter
