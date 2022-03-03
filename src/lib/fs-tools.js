import fs from "fs-extra" // 3RD PARTY MODULE
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON } = fs

const getJSONPath = filename => join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename)

const booksJSONPath = getJSONPath("books.json")
const usersJSONPath = getJSONPath("users.json")

export const getBooks = () => readJSON(booksJSONPath)
export const writeBooks = content => writeJSON(booksJSONPath, content)
export const getUsers = () => readJSON(usersJSONPath)
export const writeUsers = content => writeJSON(usersJSONPath, content)
