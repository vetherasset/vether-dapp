import React from 'react'

import { Breakpoint } from 'react-socks';

import { Text, P } from './components'
import icon from '../assets/VETHER.svg';

export const Abstract = (props) => {
	// const [abstract, setAbstract] = useState(false)

	// if(props.abstract === true){
	// 	setA
	// }
	return (
		<div>
			{props.abstract &&
				<div>
					<Text bold={true} size={14}>Abstract. </Text>
					<Text>
						Vether is designed to be a store-of-value with properties of strict scarcity,
						unforgeable costliness [1] and a fixed emission schedule. Vether mimics
						characteristics of Bitcoin [2], where miners compete to expend capital to acquire
						newly-minted coins and chase ever-decreasing margins.  Instead of expending capital,
						Vether participants compete to purchase it by destroying capital on-chain.
						As a result, all units of Vether are acquired at-cost and by anyone.
						This mechanism is called Proof-of-Value.
			</Text>
				</div>
			}
			{!props.abstract &&
				<p>
						Vether is designed to be a store-of-value with properties of strict scarcity,
						unforgeable costliness and a fixed emission schedule. Vether mimics
						characteristics of Bitcoin, where miners compete to expend capital to acquire
						newly-minted coins and chase ever-decreasing margins.  Instead of expending capital,
						Vether participants compete to purchase it by destroying capital on-chain.
						As a result, all units of Vether are acquired at-cost and by anyone.
						This mechanism is called Proof-of-Value.
				</p>
			}
		</div>
	)
}

export const Logo = () => {
	return (
		<img src={icon} alt="vether-icon" height={100} style={{ marginLeft: 40, marginRight: 40 }} />
	)
}

export const EmissionTable = () => {

	return (
		<>
			<Breakpoint medium up
						style={{
							fontFamily: 'Courier New'
						}}>
				<div style={{ marginLeft: "0px" }}>

					<P size={14}>|-----|--------|-------|-------|-----------|---------|------------|---------|-------|</P>
					<P size={14}>| Era | &nbsp;&nbsp;Days | Total | Years | Per Cycle | &nbsp;&nbsp;Total | Cumulative | Annual% | &nbsp;S2F* |</P>
					<P size={14}>|-----|--------|-------|-------|-----------|---------|------------|---------|-------|</P>
					<P size={14}>| &nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;244 | &nbsp;&nbsp;0.7 | &nbsp;&nbsp;&nbsp;&nbsp;2,048 | 499,714 | &nbsp;&nbsp;&nbsp;499,714 | &nbsp;&nbsp;&nbsp;154% | &nbsp;&nbsp;&nbsp;&nbsp;1 |</P>
					<P size={14}>| &nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;488 | &nbsp;&nbsp;1.3 | &nbsp;&nbsp;&nbsp;&nbsp;1,024 | 249,856 | &nbsp;&nbsp;&nbsp;749,568 | &nbsp;&nbsp;&nbsp;&nbsp;51% | &nbsp;&nbsp;&nbsp;&nbsp;2 |</P>
					<P size={14}>| &nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;732 | &nbsp;&nbsp;2.0 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512 | 144,928 | &nbsp;&nbsp;&nbsp;874,496 | &nbsp;&nbsp;&nbsp;&nbsp;22% | &nbsp;&nbsp;&nbsp;&nbsp;5 |</P>
					<P size={14}>| &nbsp;&nbsp;4 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;976 | &nbsp;&nbsp;2.6 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 | &nbsp;62,464 | &nbsp;&nbsp;&nbsp;936,960 | &nbsp;&nbsp;&nbsp;&nbsp;10% | &nbsp;&nbsp;&nbsp;10 |</P>
					<P size={14}>| &nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1420 | &nbsp;&nbsp;3.3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;128 | &nbsp;31,232 | &nbsp;&nbsp;&nbsp;968,192 | &nbsp;&nbsp;&nbsp;5.0% | &nbsp;&nbsp;&nbsp;20 |</P>
					<P size={14}>| &nbsp;&nbsp;6 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1464 | &nbsp;&nbsp;3.9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 | &nbsp;15,616 | &nbsp;&nbsp;&nbsp;983,808 | &nbsp;&nbsp;&nbsp;2.4% | &nbsp;&nbsp;&nbsp;41 |</P>
					<P size={14}>| &nbsp;&nbsp;7 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1708 | &nbsp;&nbsp;4.6 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 | &nbsp;&nbsp;7,808 | &nbsp;&nbsp;&nbsp;991,616 | &nbsp;&nbsp;&nbsp;1.2% | &nbsp;&nbsp;&nbsp;83 |</P>
					<P size={14}>| &nbsp;&nbsp;8 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1952 | &nbsp;&nbsp;5.2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 | &nbsp;&nbsp;3,904 | &nbsp;&nbsp;&nbsp;995,520 | &nbsp;&nbsp;&nbsp;0.6% | &nbsp;&nbsp;166 |</P>
					<P size={14}>| &nbsp;&nbsp;9 | &nbsp;&nbsp;&nbsp;244 | &nbsp;2196 | &nbsp;&nbsp;5.9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;1,952 | &nbsp;&nbsp;&nbsp;997,472 | &nbsp;&nbsp;&nbsp;0.3% | &nbsp;&nbsp;333 |</P>
					<P size={14}>| &nbsp;10 | &nbsp;&nbsp;&nbsp;244 | &nbsp;2440 | &nbsp;&nbsp;6.5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 | &nbsp;&nbsp;&nbsp;&nbsp;976 | &nbsp;&nbsp;&nbsp;998,448 | &nbsp;&nbsp;&nbsp;0.2% | &nbsp;&nbsp;666 |</P>
					<P size={14}>| &nbsp;11 | &nbsp;&nbsp;&nbsp;244 | &nbsp;2684 | &nbsp;&nbsp;7.2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;488 | &nbsp;&nbsp;&nbsp;998,936 | &nbsp;&nbsp;0.07% | 1,333 |</P>
					<P size={14}>| &nbsp;14 | &nbsp;&nbsp;1064 | 3,748 | &nbsp;10.0 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;1064 | &nbsp;1,000,000 | &nbsp;&nbsp;0.04% | 2,670 |</P>
					<P size={14}>-------------------------------------------------------------------------------------</P>

				</div>
			</Breakpoint>

			<Breakpoint small down
						style={{
							fontFamily: 'Courier New'
						}}>

				<div style={{ marginLeft: "0px" }}>

					<P>|-----|--------|-------|-------|-----------|</P>
					<P>| Era | &nbsp;&nbsp;Days | Total | Years | Per Cycle |</P>
					<P>|-----|--------|-------|-------|-----------|</P>
					<P>| &nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;244 | &nbsp;&nbsp;0.7 | &nbsp;&nbsp;&nbsp;&nbsp;2,048 |</P>
					<P>| &nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;488 | &nbsp;&nbsp;1.3 | &nbsp;&nbsp;&nbsp;&nbsp;1,024 | </P>
					<P>| &nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;732 | &nbsp;&nbsp;2.0 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;514 | </P>
					<P>| &nbsp;&nbsp;4 | &nbsp;&nbsp;&nbsp;244 | &nbsp;&nbsp;976 | &nbsp;&nbsp;2.6 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 | </P>
					<P>| &nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1420 | &nbsp;&nbsp;3.3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;148 |</P>
					<P>| &nbsp;&nbsp;6 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1464 | &nbsp;&nbsp;3.9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 | </P>
					<P>| &nbsp;&nbsp;7 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1708 | &nbsp;&nbsp;4.6 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 | </P>
					<P>| &nbsp;&nbsp;8 | &nbsp;&nbsp;&nbsp;244 | &nbsp;1952 | &nbsp;&nbsp;5.2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 | </P>
					<P>| &nbsp;&nbsp;9 | &nbsp;&nbsp;&nbsp;244 | &nbsp;2196 | &nbsp;&nbsp;5.9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 | </P>
					<P>| &nbsp;10 | &nbsp;&nbsp;&nbsp;244 | &nbsp;2440 | &nbsp;&nbsp;6.5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 | </P>
					<P>| &nbsp;11 | &nbsp;&nbsp;&nbsp;244 | &nbsp;2684 | &nbsp;&nbsp;7.2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | </P>
					<P>| &nbsp;14 | &nbsp;&nbsp;1064 | 3,748 | &nbsp;10.0 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | </P>
					<P>-------------------------------------------</P>
					<br></br>
					<P>|-----|---------|------------|---------|-------|</P>
					<P>| Era | &nbsp;&nbsp;Total | Cumulative | Annual% | &nbsp;S2F* |</P>
					<P>|-----|---------|------------|---------|-------|</P>
					<P>| &nbsp;&nbsp;1 | 499,714 | &nbsp;&nbsp;&nbsp;499,714 | &nbsp;&nbsp;&nbsp;154% | &nbsp;&nbsp;&nbsp;&nbsp;1 |</P>
					<P>| &nbsp;&nbsp;2 | 249,856 | &nbsp;&nbsp;&nbsp;749,568 | &nbsp;&nbsp;&nbsp;&nbsp;51% | &nbsp;&nbsp;&nbsp;&nbsp;2 |</P>
					<P>| &nbsp;&nbsp;3 | 144,928 | &nbsp;&nbsp;&nbsp;874,496 | &nbsp;&nbsp;&nbsp;&nbsp;22% | &nbsp;&nbsp;&nbsp;&nbsp;5 |</P>
					<P>| &nbsp;&nbsp;4 | &nbsp;62,464 | &nbsp;&nbsp;&nbsp;936,960 | &nbsp;&nbsp;&nbsp;&nbsp;10% | &nbsp;&nbsp;&nbsp;10 |</P>
					<P>| &nbsp;&nbsp;5 | &nbsp;31,232 | &nbsp;&nbsp;&nbsp;968,192 | &nbsp;&nbsp;&nbsp;5.0% | &nbsp;&nbsp;&nbsp;20 |</P>
					<P>| &nbsp;&nbsp;6 | &nbsp;15,616 | &nbsp;&nbsp;&nbsp;983,808 | &nbsp;&nbsp;&nbsp;2.4% | &nbsp;&nbsp;&nbsp;41 |</P>
					<P>| &nbsp;&nbsp;7 | &nbsp;&nbsp;7,808 | &nbsp;&nbsp;&nbsp;991,616 | &nbsp;&nbsp;&nbsp;1.2% | &nbsp;&nbsp;&nbsp;83 |</P>
					<P>| &nbsp;&nbsp;8 | &nbsp;&nbsp;3,904 | &nbsp;&nbsp;&nbsp;995,520 | &nbsp;&nbsp;&nbsp;0.6% | &nbsp;&nbsp;166 |</P>
					<P>| &nbsp;&nbsp;9 | &nbsp;&nbsp;1,952 | &nbsp;&nbsp;&nbsp;997,472 | &nbsp;&nbsp;&nbsp;0.3% | &nbsp;&nbsp;333 |</P>
					<P>| &nbsp;10 | &nbsp;&nbsp;&nbsp;&nbsp;976 | &nbsp;&nbsp;&nbsp;998,448 | &nbsp;&nbsp;&nbsp;0.2% | &nbsp;&nbsp;666 |</P>
					<P>| &nbsp;11 | &nbsp;&nbsp;&nbsp;&nbsp;488 | &nbsp;&nbsp;&nbsp;998,936 | &nbsp;&nbsp;0.07% | 1,333 |</P>
					<P>| &nbsp;14 | &nbsp;&nbsp;&nbsp;1064 | &nbsp;1,000,000 | &nbsp;&nbsp;0.04% | 2,670 |</P>
					<P>-----------------------------------------------</P>
				</div>

			</Breakpoint>

			<P>*Stock-To-Flow (the inverse of inflation).</P>
		</>
	)
}

