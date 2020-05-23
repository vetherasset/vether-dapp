import React from 'react'

import { Row, Col } from 'antd';
import { Colour, HR, Click } from '../components'

import Breakpoint from 'react-socks';

const FooterMobile = () => {
    const footerStyles = {
        background: Colour().dgrey,
    }
    return (
        <div style={footerStyles}>
            <Breakpoint small down>
                <HR />
                <Row>
                    <Col>
                        <Click><a rel="noopener noreferrer" href="https://bitcointalk.org/index.php?topic=5243406" style={{ color: "#97948E", fontSize: "12px" }} target="_blank">[ANN]</a></Click>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Click><a rel="noopener noreferrer" href="https://github.com/vetherasset" style={{ color: "#97948E", fontSize: "12px" }} target="_blank">[CODE]</a></Click>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Click><a rel="noopener noreferrer" href="https://discord.gg/c5aBC7Q" style={{ color: "#97948E", fontSize: "12px" }} target="_blank">[DISCORD]</a></Click>
                    </Col>
                </Row>
                <Row>
                <Col>
                    <Click><a rel="noopener noreferrer" href="https://t.me/vetherasset" style={{ color: "#97948E", fontSize: "12px" }} target="_blank">[TELEGRAM]</a></Click>
                </Col>
                </Row>
            </Breakpoint>
        </div >
    )
}

export default FooterMobile