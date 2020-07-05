import React from 'react'

import { Row, Col } from 'antd';

const styles = {
  textAlign: 'center',
  margin: '86px 0 3rem 0'
}

const Footer = (props) => {

  return (
      <footer>
          <Row>
              <Col style={styles} span={24}>
                  <hr/>
                  <ul>
                      <li>
                          <a href="https://etherscan.io/address/0x4ba6ddd7b89ed838fed25d208d4f644106e34279" target="_blank" rel="noopener noreferrer">
                              Contract
                          </a>
                      </li>
                      <li>
                          <a href="https://github.com/vetherasset/vether-dapp" target="_blank" rel="noopener noreferrer">
                              Sources
                          </a>
                      </li>
                      <li>
                          <a href="https://github.com/vetherasset/vips" target="_blank" rel="noopener noreferrer">
                              Proposals
                          </a>
                      </li>
                      <li>
                          <a href="https://github.com/vetherasset/vether-dapp/issues" target="_blank" rel="noopener noreferrer">
                              Issues
                          </a>
                      </li>
                  </ul>
              </Col>
          </Row>
      </footer>
  )
}

export default Footer
