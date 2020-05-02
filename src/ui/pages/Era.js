import React from 'react'

import { H2, Subtitle, HR, Gap } from '../components'
import { EraTable } from './era-web3'

const Era = () => {

    return (
        <div>
            <Gap />
            <H2>CURRENT ERA</H2><br />
            <Subtitle>Today's emission of Vether.</Subtitle>
            <EraTable></EraTable>
            <Gap />
            <HR />
        </div>
    )
}
export default Era