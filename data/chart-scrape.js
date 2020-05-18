require('dotenv').config()
const ethers = require('ethers');
const vether = require('./vether.js')
const BigNumber = require('bignumber.js')
const fs = require('fs')
const axios = require('axios')

function BN2Int(BN){return(((new BigNumber(BN)).toFixed()/10**18).toFixed(2))}

const claimArray = async () => {

    const provider = ethers.getDefaultProvider();
    const contract = new ethers.Contract(vether.addr(), vether.abi(), provider)
    const currentEra = 1
    const emission = 2048
    const currentDay = await contract.currentDay()
    var dayArray = []
    var burntArray = []
    var unclaimedArray = []
    var emissionArray = []
    var totals = 0
    var totalsArray = []
    var vetherEmitted = 0
    var vetherArray = []
    var vetherClaimed = 0
    var claimedArray = []
    for (var i = 1; i <= currentEra; i++) {
        for (var j = 1; j < currentDay; j++) {
            const burntForDay = BN2Int(await contract.mapEraDay_Units(i, j))
            // const unclaimedUnits = BN2Int(await contract.mapEraDay_UnitsRemaining(i, j))
            //const emissionForDay = BN2Int(await contract.mapEraDay_Emission(i, j))
            const unclaimedEmission = BN2Int(await contract.mapEraDay_EmissionRemaining(i, j))
            // const claimRate = (((burntForDay - unclaimedUnits) / burntForDay)*100).toFixed(2)
            totals += +burntForDay
            vetherEmitted += emission
            vetherClaimed += emission - +unclaimedEmission
            dayArray.push(j)
            burntArray.push(burntForDay)
            unclaimedArray.push(unclaimedEmission)
            emissionArray.push(emission)
            totalsArray.push(totals)
            vetherArray.push(vetherEmitted)
            claimedArray.push(vetherClaimed)
        }
    }
    const claimObject = {
        days: dayArray,
        burns: burntArray,
        unclaims: unclaimedArray,
        emission: emissionArray,
        totals: totalsArray,
        claims: claimedArray,
        vether: vetherArray
    }
    await fs.writeFileSync('./src/data/claimArray.json', JSON.stringify(claimObject, null,4), 'utf8')
    console.log(claimObject)
}

const holderArray = async () => {
    const apiKey = process.env.REACT_APP_ETHPLORER_API
    const baseURL = 'https://api.ethplorer.io/getTopTokenHolders/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey='
    console.log(baseURL+apiKey+'&limit=1000')
    const response = await axios.get(baseURL+apiKey+'&limit=1000')
    await fs.writeFileSync('./src/data/holderArray.json', JSON.stringify(response.data, null,4), 'utf8')
}

const main = async () => {
    // claimArray()
    holderArray()
}

main()