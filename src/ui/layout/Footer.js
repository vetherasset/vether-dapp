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
                          <a href="https://etherscan.io/address/0x01217729940055011f17befe6270e6e59b7d0337" target="_blank" rel="noopener noreferrer">
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
