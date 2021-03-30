import defaults from '../common/defaults'

const connected = {
	title: 'Wallet connected',
	description: 'Your wallet account has been successfully connected.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const destroyed = {
	title: 'Ether destroyed',
	description: 'Submited ether was successfully destroyed. Claim your share later.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const insufficientBalance = {
	title: 'Insufficient balance',
	description: 'Your account balance is insufficient. You might want lower the amount.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const rejected = {
	title: 'Transaction rejected',
	description: 'You have rejected the transaction. Your balance remains unaffected.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const failed = {
	title: 'Transaction failed',
	description: 'Something bad happened. Transaction proccessing failed.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

export {
	connected, failed, rejected, insufficientBalance, destroyed,
}