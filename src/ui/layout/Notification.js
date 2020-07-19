import React, { useEffect } from 'react'

import '../less/notification.less'
import {Row} from 'antd'

const Notification = (props) => {

    const pathname = window.location.pathname.split("/")[1]

    useEffect(() => {
        if  (props.pathname === pathname) {
            document.getElementById('root').classList.add('notification-on')
        }
        return () => {
            document.getElementById('root').classList.remove('notification-on')
        }
    }, [props.pathname, pathname])

    return (
        <Row id="notification">
            {props.message}
        </Row>
    )
}

export default Notification

