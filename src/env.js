require('dotenv').config()

export const getNet = () => {
    console.log(process.env.TESTNET)
    return process.env.TESTNET
}