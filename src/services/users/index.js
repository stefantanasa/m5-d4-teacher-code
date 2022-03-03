// ************************************* USERS ENDPOINTS ************************************************

/* ************************************* USERS CRUD *****************************************************

1. CREATE --> POST http://localhost:3001/users/ (+ body)
2. READ --> GET http://localhost:3001/users/ (+ optional query parameters)
3. READ (single user) --> GET http://localhost:3001/users/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId

*/

import express from "express" // 3RD PARTY MODULE (needs to be installed with npm i express)
import fs from "fs" // CORE MODULE (no need to be installed)
import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE
import uniqid from "uniqid" // 3RD PARTY MODULE

//  HOW TO GET users.json PATH ON DISK --> C:\Strive\FullStack\2021\Nov21\M5\strive-m5-d2-nov21\src\services\users\users.json

// 1. I'll start from current file's path --> C:\Strive\FullStack\2021\Nov21\M5\strive-m5-d2-nov21\src\services\users\index.js
// console.log("CURRENT FILE URL: ", import.meta.url)
const currentFilePath = fileURLToPath(import.meta.url)
// console.log("CURRENT FILE PATH: ", currentFilePath)

// 2. From currentFilePath I can get the parent's folder path --> C:\Strive\FullStack\2021\Nov21\M5\strive-m5-d2-nov21\src\services\users
const parentFolderPath = dirname(currentFilePath)
// console.log("PARENT FOLDER PATH ", parentFolderPath)

// 3. Concatenate parentFolderPath with the name of the file --> C:\Strive\FullStack\2021\Nov21\M5\strive-m5-d2-nov21\src\services\users\users.json
// Normally you would concatenate strings with "+", please don't do that when dealing with paths --> use JOIN instead
const usersJSONPath = join(parentFolderPath, "users.json")
// console.log("USERS JSON FILE PATH: ", usersJSONPath)

const usersRouter = express.Router() // all the endpoints attached to the router will have http://localhost:3001/users as PREFIX

// 1.
usersRouter.post("/", (request, response) => {
  // 1. Read request body obtaining new user's data
  console.log("BODY: ", request.body) // DO NOT FORGET server.use(express.json()) in server.js

  // 2. Add some server generated informations (unique id, creation Date, ...)
  const newUser = { ...request.body, createdAt: new Date(), id: uniqid() } // uniqid is a 3rd party module that generates unique identifiers
  console.log(newUser)

  // 3. Read users.json --> obtaining an array
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 4. Add new user to the array
  usersArray.push(newUser)

  // 5. Write the array back to users.json file
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray)) // we cannot pass an array to this function, but we can pass the stringified version of it

  // 6. Send a proper response back

  response.status(201).send({ id: newUser.id })
})

// 2.
usersRouter.get("/", (request, response) => {
  // 1. Read the content of users.json file
  const fileContent = fs.readFileSync(usersJSONPath) // You obtain a BUFFER object, which is MACHINE READABLE ONLY
  console.log("FILE CONTENT: ", JSON.parse(fileContent))

  // 2. Get back an array from the file
  const usersArray = JSON.parse(fileContent) // JSON.parse() converts BUFFER into a real ARRAY

  // 3. Send back the array as a response

  response.send(usersArray)
})

// 3.
usersRouter.get("/:userId", (request, response) => {
  console.log("REQ PARAMS: ", request.params.userId)

  // 1. Read the file --> obtaining an array
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Find the specific user by id in the array
  const foundUser = usersArray.find(user => user.id === request.params.userId)

  // 3. Send a proper response
  response.send(foundUser)
})

// 4.
usersRouter.put("/:userId", (request, response) => {
  // 1. Read the content of the file --> obtaining an array of users
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Modify specified user into the array by merging previous properties and new properties coming from req.body
  const index = usersArray.findIndex(user => user.id === request.params.userId)
  const oldUser = usersArray[index]
  const updatedUser = { ...oldUser, ...request.body, updatedAt: new Date() }

  usersArray[index] = updatedUser

  // 3. Save file back with the updated list of users
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray))

  // 4. Send back a proper response

  response.send(updatedUser)
})

// 5.
usersRouter.delete("/:userId", (request, response) => {
  // 1. Read the file --> obtaining an array of users
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Filter out the specified user from the array, obtaining an array of just the remaining users
  const remainingUsers = usersArray.filter(user => user.id !== request.params.userId) // ! = =

  // 3. Save the remaining users back to users.json file
  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers))

  // 4. Send a proper response

  response.status(204).send()
})

export default usersRouter
