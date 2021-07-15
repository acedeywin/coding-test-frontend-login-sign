import "./App.css"
import Web3 from "web3"
import { useState } from "react"
import fetch from "node-fetch"

const url = "http://localhost:3000"

function App() {
  const [error, setError] = useState("")
  const [token, setToken] = useState("")

  const handleSignin = async () => {
    try {
      //Nonce to serve as message to be signed
      const getNonce = await fetch(`${url}/token`)
      const nonce = await getNonce.json()

      //Check to see if Metamask is installed
      if (!window.ethereum) {
        setError(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        )
      }

      //Get an account from Metamask
      const address = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      if (address.length < 0) {
        setError("No account found. Please, configure an account")
      }

      const web3 = new Web3(Web3.givenProvider)

      //Signs data to unlock account
      const signature = await web3.eth.personal.sign(
        nonce.toString(),
        address[0]
      )

      const data = {
        address: address[0],
        signature,
        nonce,
      }

      //Authenticate user and return a token
      const authentication = await fetch(`${url}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const token = await authentication.text()
      setToken(token)
      setError("")
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="App mt-5">
      <p> Authentication token: {token} </p>
      <button onClick={() => handleSignin()} className="btn btn-primary">
        {"Sign in"}
      </button>
      <p>{error ? error : null} </p>
    </div>
  )
}

export default App
