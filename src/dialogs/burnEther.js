import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import {
	Flex, NumberInput, NumberInputField, Button, Badge, Box,
	useToast, Spinner,
} from '@chakra-ui/react'
import { useWallet } from 'use-wallet'
import { getCurrentBurn, getEmission, getUniswapAssetPrice } from '../common/ethereum'
import { getVetherValueStrict, prettifyCurrency } from '../common/utils'
import { failed, rejected, insufficientBalance, destroyed, walletNotConnected, amountOfEthToBurnNotEntered } from '../messages'
import { HighImpliedPriceWarning } from '../components/HighImpliedPriceWarning'

export const BurnEther = (props) => {

	BurnEther.propTypes = {
		width: PropTypes.string.isRequired,
		visible: PropTypes.number.isRequired,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [amount, setAmount] = useState('')
	const [value, setValue] = useState(0)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [emission, setEmission] = useState(undefined)
	const [ethPrice, setEthPrice] = useState(undefined)
	const [price, setPrice] = useState(undefined)
	const [working, setWorking] = useState(false)
	const [warning, setWarning] = useState(-1)

	useEffect(() => {
		if(props.visible > -1) {
			getCurrentBurn(
				defaults.network.provider)
				.then(n => setCurrentBurn(
					Number(ethers.utils.formatEther(n)),
				))
		}
	}, [props.visible])

	useEffect(() => {
		if(props.visible > -1) {
			getEmission(
				defaults.network.provider)
				.then(n => setEmission(
					Number(ethers.utils.formatEther(n)),
				))
		}
	}, [props.visible])

	useEffect(() => {
		if(props.visible > -1) {
			getUniswapAssetPrice(
				defaults.network.address.uniswap.usdc,
				6,
				18,
				true,
				defaults.network.provider,
			)
				.then(n => setEthPrice(n))
		}
	}, [props.visible])

	useEffect(() => {
		if(props.visible > -1) {
			getUniswapAssetPrice(
				defaults.network.address.uniswap.veth,
				18,
				18,
				false,
				defaults.network.provider,
			)
				.then(n => setPrice(n))
		}
	}, [props.visible])

	useEffect(() => {
		if(currentBurn && emission && price && ethPrice) {
			if (((currentBurn / emission) * (ethPrice)) > (price * ethPrice)) {
				setWarning(1)
			}
		}
		return () => setWarning(-1)
	}, [currentBurn, emission, price, ethPrice, props.visible])

	return (
		<>
			<Flex flexFlow='column' width={props.width}>
				<Box as='h3' fontSize='1.2rem' fontWeight='bold' size='md' textAlign='center'>ACQUIRE VETHER</Box>
				<Box as='span' textAlign='center'>Acquire a share of today’s emission.</Box>
			</Flex>

			<HighImpliedPriceWarning
				state={warning}
				setState={setWarning}
				impliedValue={
					currentBurn && emission && ethPrice
						? prettifyCurrency((currentBurn / emission) * (ethPrice))
						: ''
				}
				price={price && ethPrice ? prettifyCurrency(price * ethPrice, 0, 2) : ''}
			/>

			<Flex flexFlow='column' width={props.width}>
				<Box as='h3' fontSize='1.01rem' fontWeight='bold' mb='11px'>Amount <span style={{ fontFamily: 'arial' }}>Ξ</span> to burn</Box>
				<NumberInput
					min={0}
					value={amount}
					onChange={(n) => {
						setAmount(n)
						getVetherValueStrict(n, currentBurn, emission).then(v => setValue(v))
					}}
					clampValueOnBlur={false}
					variant='filled'
				>
					<NumberInputField placeholder='🔥🔥🔥' />
				</NumberInput>
			</Flex>

			<Flex flexFlow='column' width={props.width}>
				<Box as='h3' fontSize='1.9rem' fontWeight='bold' textAlign='center'>
					{value === 0 ? prettifyCurrency(value, 0, 2, 'VETH') : prettifyCurrency(value, 2, 2, 'VETH')}
				</Box>
				<Box as='h3' fontWeight='bold' textAlign='center'>
					<Badge as='div' background='rgb(214, 188, 250)' color='rgb(128, 41, 251)'>Potential share only
					</Badge>
				</Box>
			</Flex>

			<Flex flexFlow='column' width={props.width}>
				<Button w='100%'
					isLoading={working}
					loadingText='Submitting'
					spinner={<Spinner size='sm' variant='inverted' />}
					onClick={() => {
						if (!wallet.account) {
							toast(walletNotConnected)
							return
						}
						if (!amount) {
							toast(amountOfEthToBurnNotEntered)
							return
						}
						setWorking(true)
						const provider = new ethers.providers.Web3Provider(wallet.ethereum)
						const signer = provider.getSigner(0)
						signer.sendTransaction({
							to: defaults.network.address.vether,
							value: ethers.utils.parseEther(amount),
						})
							.then((tx) => {
								tx.wait().then(() => {
									setWorking(false)
									toast(destroyed)
								}).catch((err) => {
									setWorking(false)
									console.log('Error code is:' + err.code)
									console.log('Error:' + err)
									toast(failed)
								})
							})
							.catch((err) => {
								if(err.code === 'INSUFFICIENT_FUNDS') {
									setWorking(false)
									console.log('Insufficient balance: Your account balance is insufficient.')
									toast(insufficientBalance)
								}
								else if(err.code === 4001) {
									setWorking(false)
									console.log('Transaction rejected: Your have decided to reject the transaction..')
									toast(rejected)
								}
								else {
									setWorking(false)
									console.log('Error code is:' + err.code)
									console.log('Error:' + err)
									toast(failed)
								}
							})
					}}>
					Burn
				</Button>
			</Flex>
		</>
	)
}
