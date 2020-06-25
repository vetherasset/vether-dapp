import React from 'react'

import {Row} from 'antd';

const Notification = (props) => {

    return (
        <Row id="notification">
            The new token contract was deployed. <b>Upgrade</b> your Vether now. More details <a href="https://medium.com/@randomizedxyz/vether-upgrade-deployed-56141061263f" target="_blank">here</a>.
        </Row>
    )
}

export default Notification
