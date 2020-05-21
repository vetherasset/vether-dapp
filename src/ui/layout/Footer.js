import React from 'react'

import Breakpoint from 'react-socks';

import { Layout, Row, Col } from 'antd';
import { Click } from '../components'

const Footer = (props) => {

  const footerStyles = {
    background: "#110D01",
    textTransform: "uppercase",
    zIndex: 0,
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    fontSize: 10,
    paddingTop: 5,
    paddingBottom: 25,
    paddingLeft: 10,
    paddingRight: 5,
    textAlign: "left"
  }

  return (
    <Layout.Footer style={{background: "#110D01"}}>
      <div>
        <Breakpoint medium up>
          <div style={footerStyles}>
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
          </div>
        </Breakpoint>
      </div>
    </Layout.Footer>
  )
}

export default Footer
