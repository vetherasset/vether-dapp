// 2do: This should be dispatched with Redux instead
import VETHER from '../artifacts/Vether3.json'
import WETHER from "../artifacts/Wether.json"
import VADERROUTER from "../artifacts/VaderRouter.json"
import VADERUTILS from "../artifacts/VaderUtils.json"

const defaults = {}

const testnet = (process.env.REACT_APP_TESTNET === 'TRUE')
const apikey = process.env.REACT_APP_INFURA_API

defaults.color= {}
defaults.color.background = '#2b2515'
defaults.color.dark = '#110d01'
defaults.color.accent = '#d09800'
defaults.color.highlight = '#ffba00'
defaults.color.gray = '#97948e'

defaults.vether = {}
defaults.vether.name = 'Vether'
defaults.vether.symbol = 'VETH'
defaults.vether.supply = 1000000
defaults.vether.decimals = 18
defaults.vether.genesis = 1589271741
defaults.vether.secondsPerDay = 84200
defaults.vether.address = testnet ? '0x95d0c08e59bbc354ee2218da9f82a04d7cdb6fdf' : '0x4ba6ddd7b89ed838fed25d208d4f644106e34279'
defaults.vether.abi = VETHER.abi

defaults.vader = {}
defaults.vader.router = {}
defaults.vader.router.address = '0xAa5CCD27Aba925F6885D7A9AdeB54dFf22185d1C'
defaults.vader.router.abi = VADERROUTER.abi
defaults.vader.utils = {}
defaults.vader.utils.address = '0x2E74525c491954BE67E8847B087ed1c3C988635d'
defaults.vader.utils.abi = VADERUTILS.abi
defaults.vader.pools = {}
defaults.vader.pools.eth = '0x0000000000000000000000000000000000000000'

defaults.wrappedEther = {}
defaults.wrappedEther.abi = WETHER.abi

defaults.infura = {}
defaults.infura.api = testnet ? 'https://rinkeby.infura.io/v3/' + apikey : 'https://mainnet.infura.io/v3/' + apikey
defaults.infura.callRate = 210000

defaults.etherscan = {}
defaults.etherscan.url = testnet ? 'https://rinkeby.etherscan.io/' : 'https://etherscan.io/'

export default defaults