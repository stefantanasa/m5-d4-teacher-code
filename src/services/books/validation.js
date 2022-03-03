import { body } from "express-validator"

export const newBookValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
]

// users validation example -->   body("email").isEmail().withMessage("Email is not in the right format!"),
