import React, { useEffect, useState} from 'react'
import defaults from "../../common/defaults"
import Web3 from "web3"
import {Row, Tabs} from 'antd'
import '../../App.less'
import { AddLiquidityTable, ProvidedLiquidityTable, RemoveLiquidityTable } from "../components/liquidityDialog"
import { PoolTicker } from "../components/poolTicker"

const Pool = () => {

	const { TabPane } = Tabs
	const [tab, setTab] = useState('1')

	const [account, setAccount] = useState(
		{
			address: '', vethBalance: 0, ethBalance: 0,
			isMember: false, baseAmt: 0, tokenAmt: 0
		})

	useEffect(() => {
		const web3 = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
		const utils = new web3.eth.Contract(defaults.vader.utils.abi, defaults.vader.utils.address)

		const loadData = async () => {
			try {
				const account = (await window.web3.eth.getAccounts())[0]
				if (account) {
					const isMember = await utils.methods.isMember(defaults.vader.pools.eth, account).call()
					const vether = await new web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
					const poolData = await utils.methods.getPoolData(defaults.vader.pools.eth).call()
					const memberShare = await utils.methods.getMemberShare(defaults.vader.pools.eth, account).call()

					const baseAmt = Web3.utils.fromWei(memberShare.baseAmt)
					const tokenAmt = Web3.utils.fromWei(memberShare.tokenAmt)
					const memberTotal = Number(baseAmt) + Number(tokenAmt)
					const poolTotal = Number(Web3.utils.fromWei(poolData.baseAmt)) + Number(Web3.utils.fromWei(poolData.tokenAmt))
					const memberPoolShare = memberTotal / poolTotal
					const ethBalance = Web3.utils.fromWei(await web3.eth.getBalance(account))
					const vethBalance = Web3.utils.fromWei(await vether.methods.balanceOf(account).call())

					const accountData = {
						'address': account,
						'vethBalance': vethBalance,
						'ethBalance': ethBalance,
						'isMember': isMember,
						'baseAmt': Web3.utils.fromWei(memberShare.baseAmt),
						'tokenAmt': Web3.utils.fromWei(memberShare.tokenAmt),
						'memberPoolShare': memberPoolShare ? memberPoolShare : 0
					}
					setAccount(accountData)
				}
			} catch (err) {
				console.log(err)
			}
		}
		loadData()
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<h1>LIQUIDITY POOL</h1>
			<p>Try out the beta liquidity pool.</p>
			<PoolTicker/>
					<Tabs defaultActiveKey='1' activeKey={tab} onChange={(key) => { setTab(key) }}
						  size={'large'} style={{ marginTop: 20, textAlign: "center" }}>
						<TabPane tab="ADD" key="1" style={{ textAlign: "left" }}>
							<h2>ADD LIQUIDITY</h2>
							<p>Provide liquidity to earn share.</p>
							<AddLiquidityTable id={1} />
						</TabPane>
						<TabPane tab="SHARE" key="2" style={{ textAlign: "left" }}>
							<Row>
								<h2>LIQUIDITY SHARE</h2>
								<p>Value of assets you’ve pooled.</p>
							</Row>
							<ProvidedLiquidityTable id={2} accountData={account} />
						</TabPane>
						<TabPane tab="REMOVE" key="3" style={{ textAlign: "left" }}>
							<Row>
								<h2>REMOVE LIQUIDITY</h2>
								<p>Withdraw pooled assets.</p>
							</Row>
							<RemoveLiquidityTable id={3} accountData={account} />
						</TabPane>
					</Tabs>
				</>
	)
}

export default Pool
