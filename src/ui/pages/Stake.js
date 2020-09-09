import React, {useContext, useEffect, useState} from 'react'
import { Context } from "../../context"
import Web3 from "web3"

import { Tabs } from 'antd'
import '../../App.less'
import {AddLiquidityTable, ProvidedLiquidityTable, RemoveLiquidityTable} from "../components/stakeDialog"
import { PoolTicker } from "../components/poolTicker"
import {ETH, getVetherPrice, infuraAPI, vaderUtilsAbi, vaderUtilsAddr,
	vetherAbi, vetherAddr} from "../../client/web3"
import {convertFromWei} from "../../common/utils"

const { TabPane } = Tabs

const Stake = () => {

	const context = useContext(Context)
	const [tab, setTab] = useState('1')

	const [poolData, setPoolData] = useState(
		{ "eth": "", "veth": '', 'price': "", "fees": "", "volume": "",
			"poolUnits": "", "txCount": "", 'age':"", 'roi': "", 'apy': "" })
	const [account, setAccount] = useState(
		{
			address: '', vethBalance: 0, ethBalance: 0,
			isMember: false, baseAmt: 0, tokenAmt: 0
		})

	const [connected, setConnected ] = useState(false)


	useEffect(() => {
		loadPoolData()
		connect()
		// eslint-disable-next-line
	}, [])

	const loadPoolData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
		const utils = new web3_.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
		const poolData = await utils.methods.getPoolData(ETH).call()
		const price = await getVetherPrice()
		const age = await utils.methods.getPoolAge(ETH).call()
		const roi = await utils.methods.getPoolROI(ETH).call()
		const apy = await utils.methods.getPoolAPY(ETH).call()
		const poolData_ = {
			"eth": convertFromWei(poolData.tokenAmt),
			"veth": convertFromWei(poolData.baseAmt),
			"price": convertFromWei(price),
			"volume": convertFromWei(poolData.volume),
			"poolUnits": poolData.poolUnits,
			"fees": convertFromWei(poolData.fees),
			"txCount": poolData.txCount,
			"age": age,
			"roi": roi,
			"apy": apy
		}
		setPoolData(poolData_)
		context.setContext({
			"poolData": poolData_
		})
	}

	const connect = async () => {
		const accountConnected = (await window.web3.eth.getAccounts())[0]
		if(accountConnected) {
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			await loadAccountData(address)
			setConnected(true)
		}
	}

	const loadAccountData = async (account) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0]
		if (accountConnected) {
			const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
			const utils = await new web3.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
			const vether = await new web3.eth.Contract(vetherAbi(), vetherAddr())
			const ethBalance = convertFromWei(await web3.eth.getBalance(account))
			const vethBalance = convertFromWei(await vether.methods.balanceOf(account).call())

			let isMember = await utils.methods.isMember(ETH, account).call()
			let memberShare = await utils.methods.getMemberShare(ETH, account).call()
			let memberPoolShare = ((memberShare.baseAmt + memberShare.tokenAmt)/(poolData.veth + poolData.eth)*100)

			const accountData = {
				'address': account,
				'vethBalance': vethBalance,
				'ethBalance': ethBalance,
				'isMember': isMember,
				'baseAmt': memberShare.baseAmt,
				'tokenAmt': memberShare.tokenAmt,
				'memberPoolShare': memberPoolShare
			}
			setAccount(accountData)
			context.setContext({ "accountData": accountData })
		}
	}

	const onChange = key => {
		setTab(key)
	}

	return (
		<>
			<h1>LIQUIDITY POOL</h1>
			<p>Try out the beta V3 of Vether liquidity pool.</p>
			<PoolTicker/>

			{connected &&
				<>
					<Tabs defaultActiveKey='1' activeKey={tab} onChange={onChange} size={'large'} style={{ marginTop: 20, textAlign: "center" }}>
						<TabPane tab="STAKE" key="1" style={{ textAlign: "left" }}>
							<h2>ADD LIQUIDITY</h2>
							<AddLiquidityTable accountData={account}/>
						</TabPane>

						{account.isMember &&
							<>
								<TabPane tab="SHARES" key="2" style={{ textAlign: "left" }}>
									<ProvidedLiquidityTable accountData={account}/>
								</TabPane>

								<TabPane tab="UNSTAKE" key="3" style={{ textAlign: "left" }}>
									<RemoveLiquidityTable/>
								</TabPane>
							</>
						}
					</Tabs>
				</>
			}
		</>
	)
}

export default Stake
