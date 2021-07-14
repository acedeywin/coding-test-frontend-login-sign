import express from "express"
import expressValidator from "express-validator"
import cors from "cors"
import etherUtil from "ethereumjs-util"
import dotenv from "dotenv-safe"

import { errorResponse, successResponse } from "./utils"

dotenv.config({ silent: true })

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cors())

app.get("/token", (req, res) => {
  let nonce = Math.floor(Math.random() * 1000000).toString() // in a real life scenario we would random this after each login and fetch it from the db as well
  return successResponse(res, nonce)
})
app.post("/auth", (req, res) => {
  const { address, signature, nonce } = req.body

  // TODO: Validate signature by using eth tools (tip: ethereumjs-util and eth-sig-util)

  try {
    const signedMessage = Buffer.from(
      `\x19Ethereum Signed Message:\n${nonce.toString().length}${nonce}`
    )
    const hashedMessage = etherUtil.keccak(signedMessage)
    const { v, r, s } = etherUtil.fromRpcSig(signature)
    const prefixedMessage = etherUtil.toBuffer(hashedMessage)
    const publicKey = etherUtil.ecrecover(prefixedMessage, v, r, s)
    const publicKeyAddress = etherUtil.pubToAddress(publicKey)
    const recoveredAddress = etherUtil.bufferToHex(publicKeyAddress)

    if (recoveredAddress !== address) {
      return errorResponse(res, 401)
    }

    return successResponse(res, "Hello world")
  } catch (err) {
    throw err.message
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
