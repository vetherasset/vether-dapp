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

defaults.layout = {}
defaults.layout.width = '768px'

defaults.toast = {}
defaults.toast.duration = 5000

defaults.theme = {}
defaults.theme.mode = 'dark'

export default defaults
