import React from 'react';

import { Breakpoint } from 'react-socks';

import '../../App.less';
import { Abstract, EmissionTable } from '../content'

const Whitepaper = () => {

	return (
		<>
			<h1>WHITEPAPER</h1>
			<h2 style={{
				textAlign: 'center'
			}}>
				Vether: A strictly-scarce Ethereum-based asset
			</h2>

			<Breakpoint medium up>
				<p style={{
					marginLeft: "45px",
					marginRight: "45px",
					textAlign: "justify"
				}}>
					<Abstract/>
				</p>
			</Breakpoint>

			<Breakpoint small down>
				<p style={{
					fontSize: "0.8rem",
					padding: '0 20px',
					marginBottom: '2rem',
					textAlign: "justify"
				}}>
					<Abstract/>
				</p>
			</Breakpoint>

			<h2>Introduction</h2>
			<p style={{
				textAlign: "justify"
			}}>
				When a new monetary asset is created the key problem is a matter of distribution - how to fairly distribute it
				to a wide number of participants such that anyone can acquire it and all units are distributed at-cost.
				Bitcoin's entire fixed-supply is being distributed fairly and at-cost, however Ethereum and the tokens
				created on it have not undergone the same process. As such, the value held by Ethereum and its tokens
				continually inflate as more are created at various cost with unpredictable distribution.
				Vether is designed to return scarcity properties to Ethereum, captured in a single fixed-supply asset,
				emitted in a way that continually absorbs value, at the same time as being distributed fairly and at-cost.
			</p>

			<h2>Acquiring Vether</h2>
			<p style={{
				textAlign: "justify"
			}}>
				Vether can only be acquired (mined) by destroying an asset with existing value, such as Ether or ERC-20 tokens.
				All value is measured in units of Ether, and token value is derived from liquidity-pool markets.
				Unpriced tokens have their value derived from the cost of gas used to destroy them.
				All assets are destroyed by sending them to an unspendable Ethereum address.
			</p>

			<h2>Emission Period</h2>
			<p style={{
				textAlign: "justify"
			}}>
				Vether is auctioned off in Days of around 23.5 hours. 244 Days make up 1 Era.
				The 12th Era is 1064 Days long and the total Emission Period is 10 years. The overlapping time periods
				ensure Day and Era changes happen across different time periods and seasons globally.
				The Emission begins with 2048 per day, which halves each Era until it is 1 Vether per day in the 12th Era.
				After exactly 10 years the total emitted supply of Vether will be exactly 1,000,000 and cannot ever be increased.
			</p>

			<h2>Network Fee</h2>
			<p style={{
				textAlign: "justify"
			}}>
				Each transaction of Vether incurs a small fee of 10 basis points, which is returned to the contract.
				These fees accrue and will be emitted only after the Emission Period, at 1 Vether per Day.
				At a monetary velocity of 1, enough fees accrue in the first 10 years to power emissions for another 30 years.
				At higher velocities, the fee acts as a deflationary force.
			</p>

			<h2>Stock-To-Flow [3]</h2>
			<p style={{
				textAlign: "justify"
			}}>
				Vether begins with a stock-to-flow of 1 that doubles each Era to be 2670 after 10 years.
				Since all units are acquired at-cost and emitted continuously, if Vether develops a market the halvings
				will function to reduce supply and increase value. This will reinforce Vether as a store-of-value.
				After the Emission Period, accrued fees provide on-going flow that fixes the stock-to-flow at a minimum of 2670 indefinitely.
				Thus, as long as there is economic activity, Vether can absorb value from Ethereum-based assets in perpetuity.
			</p>

			<h2>Conclusion</h2>
			<p style={{
				textAlign: "justify"
			}}>
				Vether is a strictly-scarce asset that has a fixed emission schedule and can only be acquired at-cost.
				Halvings are built in to the emission schedule to target a stock-to-flow of 2670 after 10 years.
				Beyond 10 years accrued fees power the emission, and thus the contract will run for as long as Ethereum exists.
				If Vether attains a monetary premium it will become one of the most valuable assets on the Ethereum network,
				with the widest and fairest distribution.
			</p>

			<h2>References</h2>
			<p style={{
				textAlign: "justify"
			}}>
				[1] N. Szabo, "Antiques, time, gold, and bit gold", http://unenumerated.blogspot.com/2005/10/antiques-time-gold-and-bit-gold.html, 2005<br />
				[2] S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System", https://bitcoin.org/bitcoin.pdf, 2008<br />
				[3] PlanB, "Modeling Bitcoin's Value with Scarcity", https://medium.com/@100trillionUSD/modeling-bitcoins-value-with-scarcity-91fa0fc03e25, 2019
			</p>

			<h2>Appendix A - Emission Schedule</h2>
			<p>The Emission Schedule is as follows:</p>

			<EmissionTable /><br />

			<h2>Appendix B - Fee Era</h2>
			<p style={{
				textAlign: "justify"
			}}>
				The Fee Period activates after the 12th Era, and begins to emit all accrued fees.<br />
				The emission of fees is a maximum of 1 Vether per Day.
			</p>

			<h2>Appendix C - Contract Integrity</h2>
			<p style={{
				textAlign: "justify"
			}}>
				- The contract is a compliant SafeMath ERC-20 that mints all 1 million Vether during construction. <br />
				- There are no owned or whitelisted functions, and no ability to change the contract's parameters. <br />
				- The UniSwap Factory interface is used to return token exchange addresses. <br />
				- The UniSwap Exchange interface is used to enable token to ether transfers. <br />
				- The contract uses blocktime instead of blockheight since the Ethereum block generation speed can change.<br />
				- The UpdateEmission() function is called where possible to ensure frequent Emission Schedule updates.
			</p>
		</>
	)
}

export default Whitepaper
