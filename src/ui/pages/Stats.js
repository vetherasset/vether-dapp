import React from 'react';

import '../../App.css';
import { Row, Col } from 'antd'
import { H2, Text, Gap, Click, Colour } from '../components'
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
            <Click><a href='https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API' rel="noopener noreferrer" title="ETHPlorer link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> DATA FROM ETHPLORER -> </a></Click><br/>
            <Click><a href='https://www.chartjs.org/' rel="noopener noreferrer" title="Chartjs link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> CHARTS FROM CHARTJS -> </a></Click>
            <Gap />
        </div>
    )
}

export default Stats