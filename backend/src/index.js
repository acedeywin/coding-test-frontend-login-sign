import express from "express"
import expressValidator from "express-validator"
import dotenv from "dotenv-safe"

import { errorResponse, successResponse } from "./utils"

dotenv.config({ silent: true })

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(expressValidator())

app.get("/token", (req, res) => {
  let nonce = Math.floor(Math.random() * 1000000).toString() // in a real life scenario we would random this after each login and fetch it from the db as well
  return successResponse(res, nonce)
})
app.post("/auth", (req, res) => {
  const { address, signature, nonce } = req.body

  // TODO: Validate signature by using eth tools (tip: ethereumjs-util and eth-sig-util)

  const recoveredAddress = "the_address_recovered_from_the_signature"

  if (recoveredAddress !== address) {
    return errorResponse(res, 401)
  }

  return successResponse(res, "Hello World!")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
