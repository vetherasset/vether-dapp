import React from 'react';

import '../../App.css';
import { H2, Text, Gap } from '../components'
import { ChartEther, ChartClaim } from './chart'

const Stats = () => {

    return(
        <div>
            <Gap />
			<H2>STATS</H2>
			<br></br>
			<Text size={16} bold={'TRUE'}>Stats for the Vether Economy</Text>
            <ChartEther />
            <ChartClaim />
        </div>
    )
    }

export default Stats