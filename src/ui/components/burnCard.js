import React from 'react'

import { Row, Col } from 'antd'
import { LabelGrey, Center, Text } from '../components'
import { currency } from '../../common/utils'

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
                            <Text size={32} style={{ marginBottom: 0 }}>{currency(+props.eraData.currentBurn, 0, 4, 'ETH')}</Text>
                        </Center>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Center>
                            <Text size={32} style={{ marginBottom: 0 }}>{currency(convertEthtoUSD(props.eraData.currentBurn))}</Text>
                        </Center>
                    </Col>
                </Row>
                <Row>
                    <Center><LabelGrey margin={"0px 0px 10px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>
                    <br/>
                </Row>
                <Row>
                    <Col xs={24} sm={12}>
                        <Center><Text size={24} margin={"0px 0px"}>{currency((props.eraData.currentBurn / props.eraData.emission), 0, 6, 'ETH')}</Text></Center>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Center><Text size={24} margin={"0px 0px"}>{currency(convertEthtoUSD(props.eraData.currentBurn / props.eraData.emission))}</Text></Center>
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
