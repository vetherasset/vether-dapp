import VETHER from '../artifacts/Vether3.json'
import WETHER from "../artifacts/Wether.json"
import VADERROUTER from "../artifacts/VaderRouter.json"
import VADERUTILS from "../artifacts/VaderUtils.json"

const defaults = {}

const testnet = (process.env.REACT_APP_TESTNET === 'TRUE')
const api = 'https://eth-mainnet.alchemyapi.io/v2/PW8dClFJzk12tP2elGQZWznAV2P5xcg0'
const apiTestnet = ''

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
defaults.vether.uniPool = '0x3696Fa5Ad6e5C74fdcBCEd9aF74379D94C4B775A'
defaults.vether.abi = VETHER.abi

defaults.treasury = {}
defaults.treasury.address = '0x0c00DE096F93B3A5A15aaa87895f6964785362Ec'

defaults.vader = {}
defaults.vader.router = {}
defaults.vader.router.address = '0x6d337AD624A327146665e5f515ce964A4D3F0043'
defaults.vader.router.abi = VADERROUTER.abi
defaults.vader.utils = {}
defaults.vader.utils.address = '0x2E74525c491954BE67E8847B087ed1c3C988635d'
defaults.vader.utils.abi = VADERUTILS.abi
defaults.vader.pools = {}
defaults.vader.pools.eth = '0x0000000000000000000000000000000000000000'

defaults.wrappedEther = {}
defaults.wrappedEther.abi = WETHER.abi

defaults.api = {}
defaults.api.url = testnet ? apiTestnet : api
defaults.api.callRate = 210000

defaults.etherscan = {}
defaults.etherscan.url = testnet ? 'https://rinkeby.etherscan.io/' : 'https://etherscan.io/'

export default defaults
