import React from 'react'

import { Row, Col } from 'antd'
import { Label, LabelGrey, Center, Text, Colour } from './components'
import { prettify } from './utils'


export const PoolCard = (props) => {

    const poolStyles = {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 6,
        borderColor: Colour().gold,
        margin: '30px 0',
        padding: '20px',
        backgroundColor: Colour().black,
    }
    const lineStyle = {
        borderLeft: '1px dashed',
        borderColor: '#97948e47',
        paddingLeft: 5
    }
    return (
        <>
            <Col xs={24} sm={24} xl={12} style={poolStyles}>
                <Row>
                    <Col xs={12}>
                        <Text size={20} style={{textAlign: 'left', display: 'block', margin: '0'}}>ETH Ξ</Text>
                        <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(props.uniswapData.eth)}</Text></Center>
                        <Center><Text margin={"5px 0px 30px"}>${prettify(props.marketData.ethPrice * props.uniswapData.eth)}</Text></Center>
                    </Col>
                    <Col xs={12} style={lineStyle}>
                        <Text size={20} style={{textAlign: 'left', display: 'block', margin: '0 0 0 15px'}}>$VETH</Text>
                        <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(props.uniswapData.veth)}</Text></Center>
                        <Center><Text margin={"5px 0px 30px"}>${prettify(props.marketData.ethPrice * props.uniswapData.eth)}</Text></Center>
                    </Col>
                </Row>
            </Col>
        </>
    )
}

export const WalletCard = (props) => {

    const cardStyles = {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 5,
        borderColor: Colour('0.2').yellow,
        padding: 10,
        marginBottom: 30,
        marginRight: 20,
        backgroundColor: Colour().dgrey
    }

    return (
        <div>
            <Col style={cardStyles}>
                <Label>YOUR WALLET</Label>
                <br />
                <LabelGrey>{props.accountData.address}</LabelGrey>
                <br /><br />
                <Row>
                    <Col xs={8}>
                        <Text size={32} margin={"20px 0px 0px"}>{prettify((+props.accountData.ethBalance))}</Text>&nbsp;
                        <br />
                        <LabelGrey>ETH</LabelGrey>
                    </Col>
                    <Col xs={8}>
                        <Text size={32} margin={"20px 0px 0px"}>{prettify((+props.accountData.vethBalance))}</Text>
                        <br />
                        <LabelGrey>VETH</LabelGrey>
                    </Col>
                    {(+props.accountData.uniBalance > 0) &&
                        <Col xs={8}>
                            <Text size={32} margin={"20px 0px 0px"}>{prettify((+props.accountData.uniBalance))}</Text>
                            <br />
                            <LabelGrey>VETH-UNI</LabelGrey>
                        </Col>
                    }
                </Row>
            </Col>
        </div>
    )
}

export const UniswapCard = (props) => {

    const account = props.accountData
    const uniswapData = props.uniswapData

    const cardStyles = {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 5,
        borderColor: Colour('0.2').yellow,
        padding: 10,
        marginBottom: 30,
        backgroundColor: Colour().dgrey
    }

    const getUniShare = () => {
		const share = +account.uniBalance / +account.uniSupply
		// console.log(account.uniBalance, account.uniSupply, share )
		if (share > 0) {
			return share
		} else {
			return 0
		}
    }
    
    return (
        <>
            <Col style={cardStyles}>
                <Label>YOUR UNISWAP SHARE</Label>
                <br />
                <LabelGrey>{uniswapData.address}</LabelGrey>
                <br /><br />
                <Row>
                    <Col xs={8}>
                        <Text size={32} margin={"20px 0px 0px"}>{prettify(+uniswapData.eth * getUniShare())}</Text>&nbsp;
                        <br />
                        <LabelGrey>ETH</LabelGrey>
                    </Col>
                    <Col xs={8}>
                        <Text size={32} margin={"20px 0px 0px"}>{prettify(+uniswapData.veth * getUniShare())}</Text>
                        <br />
                        <LabelGrey>VETH</LabelGrey>
                    </Col>
                    {(+account.uniBalance > 0) &&
                        <Col xs={8}>
                            <Text size={32} margin={"20px 0px 0px"}>{prettify(getUniShare() * 100)}%</Text>
                            <br />
                            <LabelGrey>Share of the Pool</LabelGrey>
                        </Col>
                    }
                </Row>
            </Col>
        </>
    )
}

export const BurnCard = (props) => {

    function convertEthtoUSD(ether) {
        return (ether * props.marketData.ethPrice).toFixed(3)
    }

    return (
        <>
            <Col xs={24} sm={9}>
                <Row>
                    <Col xs={24} sm={12}>
                        <Center>
                            <Text size={32}>{prettify(+props.eraData.currentBurn)} ETH</Text>
                        </Center>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Center>
                            <Text size={32}>${prettify(convertEthtoUSD(props.eraData.currentBurn))}</Text>
                        </Center>
                    </Col>
                </Row>
                <Row>
                    <Center><LabelGrey margin={"0px 0px 10px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>
                    <br/>
                </Row>
                <Row>
                    <Col xs={24} sm={12}>
                        <Center><Text size={24} margin={"0px 0px"}>{(props.eraData.currentBurn / props.eraData.emission).toFixed(5)} ETH</Text></Center>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Center><Text size={24} margin={"0px 0px"}>${prettify(convertEthtoUSD(props.eraData.currentBurn / props.eraData.emission))}</Text></Center>
                    </Col>
                </Row>
                <Row>
                    <Center><LabelGrey margin={"0px 0px 10px"}>IMPLIED VALUE OF VETHER TODAY</LabelGrey></Center>
                    <br/>
                </Row>
            </Col>

        </>
    )
}
