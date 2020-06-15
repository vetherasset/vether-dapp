import React from 'react'

import { H2 } from '../components'
import { EraTable } from './era-web3'

const Era = () => {

    return (
        <div>
            <H2>CURRENT ERA</H2><br />
            Today's emission of Vether.
            <EraTable />
            <hr />
        </div>
    )
}
export default Era
