import React from 'react';

import '../../App.css';
import { Row, Col } from 'antd'
import { H2, Text, Gap } from '../components'
import { ChartEther, ChartClaim, ChartEmission, ChartDistro, ChartPie } from './chart'

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
            <Row>
                <Col>
                    <ChartEmission />
                </Col>
            </Row>
            <Row>
                <Col xs={24} lg={16}>
                    <ChartDistro />
                </Col>
                <Col xs={24} lg={8}>
                    <ChartPie />
                </Col>
            </Row>
        </div>
    )
}

export default Stats