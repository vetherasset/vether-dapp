import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Row, Menu, Layout } from 'antd'
import Breakpoint from 'react-socks'

import { HeartFilled, MediumOutlined } from '@ant-design/icons'
import { Text, Icon } from '../components'
import UniswapIcon from '../../assets/uniswap.svg'
import DiscordIcon from '../../assets/discord.svg'
import GithubIcon from '../../assets/github.svg'
import TelegramIcon from '../../assets/telegram.svg'

const Sidebar = (props) => {

  const menu_items = [
    "overview",
    "acquire",
    // "swap",
    // "pool",
    "stats",
    "whitepaper"
  ]

  const [page, setPage] = useState(null)

  useEffect(() => {
    let pathname = window.location.pathname.split("/")[1]
    if(!pathname){
      setPage("overview")
    }
    if (menu_items.includes(pathname)) {
      setPage(pathname)
    }
  }, [menu_items])

  const isSelected = (key) => {
    return key === page
  }

  const handleClick = ({ key }) => {
    setPage(key)
  }

  return (

    <Layout.Sider width={"154"} trigger={null} collapsible breakpoint="md"
    collapsedWidth="0">

      <Breakpoint small down>
        <Menu onClick={handleClick} mode="inline" selectedKeys={[page]}>
          {menu_items.map((item) => (
            <Menu.Item key={item}>
              <Link to={"/" + item}>
                <Icon icon={item}/>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Breakpoint>

      <Breakpoint medium up style={{ height: '100%', width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'end', alignContent: 'space-between' }}>
        <Row type="flex" span={24}>
          <Menu onClick={handleClick} mode="inline" theme="light" selectedKeys={[page]}>
            {menu_items.map((item) => (
                <Menu.Item key={item}>
                  <Link to={"/" + item}>
                    <Icon icon={item}/>
                    {item === 'pool' || item === 'swap' ?
                          <>
                            {isSelected(item) ?
                                <Text bold={true} color="#fff" className="beta">{item}</Text> :
                                <Text color="#97948E" className="beta">{item}</Text>
                            }
                          </> :
                          <>
                            {isSelected(item) ?
                                <Text bold={true} color="#fff">{item}</Text> :
                                <Text color="#97948E">{item}</Text>
                            }
                          </>
                    }
                  </Link>
                </Menu.Item>
            ))}
          </Menu>
        </Row>

        <Row className="sidebar-footer" type="flex" span={24} style={{ width: '100%', justifyContent: 'center', paddingBottom: '14px' }}>
          <ul style={{ listStyle: 'none', display: 'block', width: '100%', textAlign: 'center', margin: '0 0 0 -9px' }}>
            <li>
              <a href="https://uniswap.exchange/swap/0x4ba6ddd7b89ed838fed25d208d4f644106e34279" style={{ fontSize: '14px', color: '#97948e' }} target="_blank" rel="noopener noreferrer">
                <img src={UniswapIcon} alt="Uniswap Exchange Logo" style={{ margin: '0 0 3px 0', maxWidth: '29px', color: 'yellow' }}/>
                Uniswap Pool
              </a>
            </li>
            <li>
              <Link to="/donations" style={{ fontSize: '14px', color: '#97948e' }} onClick={() => handleClick({})}>
                <HeartFilled style={{ margin: 0, maxWidth: '16px', marginRight: '5px' }}/>
                Donations
              </Link>
            </li>
          </ul>
          <hr style={{ width: '100%', margin: '0.9rem 0 1.2rem' }} />
          <ul style={{ listStyle: 'none', display: 'inline-flex' }}>
              <li>
                <a href="https://discord.gg/c5aBC7Q" rel="noopener noreferrer" target="_blank">
                  <img src={DiscordIcon} alt="Vether Discord Server Logo" style={{ maxHeight: '16px' }}/>
                </a>
              </li>
              <li style={{ marginLeft: '14px'}}>
                <a href="https://t.me/vetherasset" rel="noopener noreferrer" target="_blank">
                  <img src={TelegramIcon} alt="Vether Telegram Group Logo" style={{ maxHeight: '16px' }}/>
                </a>
              </li>
              <li style={{ marginLeft: '14px'}}>
                <a href="https://medium.com/vether-asset">
                  <MediumOutlined style={{ margin: '5px 0 0 0', color: '#fff' }}/>
                </a>
              </li>
              <li style={{ marginLeft: '14px'}}>
                <a href="https://github.com/vetherasset" rel="noopener noreferrer" target="_blank">
                  <img src={GithubIcon} alt="Vetherasset Github Logo" style={{ maxHeight: '16px' }}/>
                </a>
              </li>
          </ul>
        </Row>
      </Breakpoint>
    </Layout.Sider>
  )
}

export default Sidebar
