    //========================================VETHER-WHITEPAPER========================================//
    
    # WHITEPAPER
    ### Vether: A strictly-scarce Ethereum-based asset
    
    **Abstract**
    Vether is designed to be a store-of-value with properties of strict scarcity,
    unforgeable costliness [1] and a fixed emission schedule. Vether mimics
    characteristics of Bitcoin [2], where miners compete to expend capital to acquire
    newly-minted coins and chase ever-decreasing margins.  Instead of expending capital,
    Vether participants compete to purchase it by destroying capital on-chain.
    As a result, all units of Vether are acquired at-cost and by anyone.
    This mechanism is called Proof-of-Value.
    
    ## Introduction
    When a new monetary asset is created the key problem is a matter of distribution - how to fairly distribute it
    to a wide number of participants such that anyone can acquire it and all units are distributed at-cost.
    Bitcoin's entire fixed-supply is being distrbuted fairly and at-cost, however Ethereum and the tokens
    created on it have not undergone the same process. As such, the value held by Ethereum and its tokens
    continually inflate as more are created at various cost with unpredictable distribution.
    Vether is designed to return scarcity properties to Ethereum, captured in a single fixed-supply asset,
    emitted in a way that continually absorbs value, at the same time as being distributed fairly and at-cost.
    
    ## Acquiring Vether
    Vether can only be acquired by destroying an asset with existing value, such as Ether or ERC-20 tokens.
    All value is measured in units of Ether, and token value is derived from liquidity-pool markets.
    Unpriced tokens have their value derived from the cost of gas used to destroy them.
    All assets are destroyed by sending them to the Ethereum genesis address.

    ## Emission Period
    Vether is auctioned off in Days of around 23.5 hours. 244 Days make up 1 Era.
    The 12th Era is 1064 Days long and the total Emission Period is 10 years. The overlapping time periods
    ensure Era and Day changes happen across different time periods and seasons globally.
    The Emission begins with 2048 per day, which halves each Era until it is 1 Vether per day in the 12th Era.
    After exactly 10 years the total emitted supply of Vether will be exactly 1,000,000 and cannot ever be increased.

    ## Network Fee
    Each transaction of Vether incurs a small fee of 10 basis points, which is returned to the contract.
    These fees accrue and will be emitted only after the Emission Period, at 1 Vether per Day.
    At a monetary velocity of 1, enough fees accrue in the first 10 years to power emissions for another 30 years.
    At higher velocities, the fee acts as a deflationary force.

    ## Stock-To-Flow
    Vether begins with a stock-to-flow of 1 that doubles each Era to be 2670 after 10 years.
    Since all units are acquired at-cost and emitted continuously, if Vether develops a market the halvings
    will function to reduce supply and increase value. This will reinforce Vether as a store-of-value.
    After the Emission Period, accrued fees provide on-going flow that fixes the stock-to-flow at a minimum of 2670 indefinitely.
    Thus, as long as there is economic activity, Vether can absorb value from Ethereum-based assets in perpetuity.

    ## Conclusion
    Vether is a strictly-scarce asset that has a fixed emission schedule and can only be acquired at-cost.
    Halvings are built in to the emission schedule to target a stock-to-flow of 2670 after 10 years.
    Beyond 10 years accrued fees power the emission, and thus the contract will run for as long as Ethereum exists.
    If Vether attains a monetary premium it will become one of the most valuable assets on the Ethereum network,
    with the widest and fairest distribution.

    ## References
    [1] N. Szabo, "Antiques, time, gold, and bit gold", http://unenumerated.blogspot.com/2005/10/antiques-time-gold-and-bit-gold.html, 2005
    [2] S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System", https://bitcoin.org/bitcoin.pdf, 2008
    [3] PlanB, "Modeling Bitcoin's Value with Scarcity", https://medium.com/@100trillionUSD/modeling-bitcoins-value-with-scarcity-91fa0fc03e25, 2019

    **Appendix A - Emission Schedule**
    The Emission Schedule is as follows:
    |-----|--------|-------|-------|-----------|---------|------------|---------|-------|
    | Era |   Days | Total | Years |   Per Day |   Total | Cumulative | Annual% |  S2F* |
    |-----|--------|-------|-------|-----------|---------|------------|---------|-------|
    |   1 |    244 |   244 |   0.7 |     2,048 | 499,712 |    499,712 |    154% |     1 |
    |   2 |    244 |   488 |   1.3 |     1,024 | 249,856 |    749,568 |     51% |     2 |
    |   3 |    244 |   732 |   2.0 |       512 | 124,928 |    874,496 |     22% |     5 |
    |   4 |    244 |   976 |   2.6 |       256 |  62,464 |    936,960 |     10% |    10 |
    |   5 |    244 |  1220 |   3.3 |       128 |  31,232 |    968,192 |    5.0% |    20 |
    |   6 |    244 |  1464 |   3.9 |        64 |  15,616 |    983,808 |    2.4% |    41 |
    |   7 |    244 |  1708 |   4.6 |        32 |   7,808 |    991,616 |    1.2% |    83 |
    |   8 |    244 |  1952 |   5.2 |        16 |   3,904 |    995,520 |    0.6% |   166 |
    |   9 |    244 |  2196 |   5.9 |         8 |   1,952 |    997,472 |    0.3% |   333 |
    |  10 |    244 |  2440 |   6.5 |         4 |     976 |    998,448 |    0.2% |   666 |
    |  11 |    244 |  2684 |   7.2 |         2 |     488 |    998,936 |   0.07% | 1,333 |
    |  12 |   1064 | 3,748 |  10.0 |         1 |    1064 |  1,000,000 |   0.04% | 2,670 |
    -------------------------------------------------------------------------------------
    *Stock-To-Flow (the inverse of inflation).

    **Appendix B - Fee Era**
    The Fee Period activates after the 12th Era, and begins to emit all accrued fees.
    The emission of fees is a maximum of 1 Vether per Day.

    **Appendix C - Contract Integrity**
    - The contract is an ERC-20 contract that mints all 1 million Vether during construction.
    - There are no owned or whitelisted functions, and no ability to change the contract's parameters.
    - The UniSwap factory interface is used to return token exchange addresses.
    - The UniSwap exchange interface is used to enable token to ether transfers.
    - The contract uses blocktime instead of blockheight since the Ethereum block generation speed can change.
    - The Emission Schedule is updated frequently.

    //===============================================END===============================================//
