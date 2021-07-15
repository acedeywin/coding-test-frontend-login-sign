import express from "express"
import {
  keccak,
  fromRpcSig,
  ecrecover,
  toBuffer,
  bufferToHex,
  pubToAddress,
} from "ethereumjs-util"
import cors from "cors"
import jwt from "jsonwebtoken"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get("/token", (req, res) => {
  let nonce = Math.floor(Math.random() * 1000000).toString() // in a real life scenario we would random this after each login and fetch it from the db as well
  return res.send(nonce)
})
app.post("/auth", (req, res) => {
  const { address, signature, nonce } = req.body

  // TODO: Validate signature by using eth tools (tip: ethereumjs-util and eth-sig-util)
  const nonceLen = nonce.toString().length

  //Adds prefix to the message, makes the calculated signature recognisable as an Ethereum specific signature
  const prefixedMsg = keccak(
    Buffer.from(`\x19Ethereum Signed Message:\n${nonceLen}${nonce}`)
  )
  //Destructure signature into 3 variables
  const { v, r, s } = fromRpcSig(signature)
  //Sends the message and the signature to the network and recover the account
  const publicKey = ecrecover(toBuffer(prefixedMsg), v, r, s)
  //Converts the buffer stream to hexadecimal
  const recoveredAddress = bufferToHex(pubToAddress(publicKey))

  if (recoveredAddress !== address) {
    return res.status(401).send()
  }

  console.log(signature)

  const secret = "your secret in .env"
  const token = jwt.sign(recoveredAddress, secret)

  return res.send(token)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
