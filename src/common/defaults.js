import { ethers } from 'ethers'
const defaults = {}

defaults.network = {}
defaults.network.chainId = 1
defaults.network.connector = 'injected'
defaults.network.provider = ethers.getDefaultProvider(
	defaults.network.chainId, {
		alchemy: 'tot_96ctq6XtnHUl7cj2fg-JY_5rLzRT',
	})
defaults.network.address = {}
defaults.network.address.vether = '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279'
defaults.network.address.uniswap = {}
defaults.network.address.uniswap.veth = '0x3696Fa5Ad6e5C74fdcBCEd9aF74379D94C4B775A'
defaults.network.address.uniswap.usdc = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'

defaults.layout = {}
defaults.layout.width = '768px'

defaults.toast = {}
defaults.toast.duration = 5000

defaults.theme = {}
defaults.theme.mode = 'dark'

export default defaults
