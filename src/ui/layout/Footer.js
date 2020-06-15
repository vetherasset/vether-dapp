import React from 'react'

import { Row, Col } from 'antd';

const styles = {
  textAlign: 'center',
  margin: '86px 0 64px 0'
}

const Footer = (props) => {

  return (
      <Row>
        <Col style={styles} span={24}>
          <hr/>
          <span style={{
            fontSize: '14px',
            color: '#97948e',
            textTransform: 'uppercase'
          }}>
            Contract deployed on 12th May 2020
          </span>
        </Col>
      </Row>
  )
}

export default Footer
