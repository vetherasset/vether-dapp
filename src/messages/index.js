import defaults from '../common/defaults'

const connected = {
	title: 'Wallet connected',
	description: 'Your wallet account has been connected.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const destroyed = {
	title: 'Share acquired',
	description: 'Ether was burnt. Claim your Veth share later.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const claimed = {
	title: 'Veth claimed',
	description: 'Your share of Veth has been withdrawn.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const insufficientBalance = {
	title: 'Insufficient balance',
	description: 'Your account balance is insufficient.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const rejected = {
	title: 'Transaction rejected',
	description: 'You have rejected the transaction.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const failed = {
	title: 'Transaction failed',
	description: 'Something happened. Proccessing failed.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const walletNotConnected = {
	title: 'Wallet not connected',
	description: 'Please connect a wallet.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const eraNotSelected = {
	title: 'Era not selected',
	description: 'Please select an emission era.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const dayNotSelected = {
	title: 'Day not selected',
	description: 'Please select an emission day.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const amountOfEthToBurnNotEntered = {
	title: 'Amount of ETH to burn not entered',
	description: 'Please enter the amount of ETH to burn.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

export {
	connected, failed, rejected, insufficientBalance, destroyed, claimed,
	walletNotConnected, eraNotSelected, dayNotSelected, amountOfEthToBurnNotEntered,
}
