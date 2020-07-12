import React from 'react'

import { Row, Col } from 'antd'
import { Label, LabelGrey, Center, Text, Colour } from './components'
import { prettify } from './utils'

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
                            <Text size={32} style={{ marginBottom: 0 }}>{prettify(+props.eraData.currentBurn)} ETH</Text>
                        </Center>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Center>
                            <Text size={32} style={{ marginBottom: 0 }}>${prettify(convertEthtoUSD(props.eraData.currentBurn))}</Text>
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
