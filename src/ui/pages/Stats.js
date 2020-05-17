import React from 'react';

import '../../App.css';
import { Row, Col } from 'antd'
import { H2, Text, Gap } from '../components'
import { ChartEther, ChartClaim } from './chart'

const Stats = () => {

    return (
        <div>
            <Gap />
            <H2>STATS</H2>
            <br></br>
            <Text size={16} bold={'TRUE'}>Stats for the Vether Economy</Text>
            <Row>
                <Col xs={24} xl={12}>
                    <ChartEther />
                </Col>
                <Col xs={24} xl={12}>
                    <ChartClaim />
                </Col>
            </Row>
        </div>
    )
}

export default Stats