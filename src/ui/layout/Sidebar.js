import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Row, Menu, Layout } from 'antd'
import { Text, Icon } from '../components'
import DiscordIcon from '../../assets/discord.svg'
import GithubIcon from '../../assets/github.svg'
import TelegramIcon from '../../assets/telegram.svg'


import Breakpoint from 'react-socks';

const Sidebar = (props) => {

  const menu_items = [
    "overview",
    "acquire",
    //"upgrade",
    // "stake",
    "trade",
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
                    {isSelected(item) ?
                        <Text bold={true} color="#fff">{item}</Text> :
                        <Text color="#97948E">{item}</Text>
                    }
                  </Link>
                </Menu.Item>
            ))}
          </Menu>
        </Row>
        <Row type="flex" span={24} style={{ width: '100%', justifyContent: 'center', paddingBottom: '14px' }} align="end">
          <ul style={{ listStyle: 'none', display: 'inline-flex' }}>
              <li>
                <a href="https://discord.gg/c5aBC7Q" rel="noopener noreferrer" target="_blank">
                  <img src={DiscordIcon} alt="Vether Discord Server Logo" style={{ maxWidth: '21px' }}/>
                </a>
              </li>
              <li style={{ marginLeft: '14px'}}>
                <a href="https://t.me/vetherasset" rel="noopener noreferrer" target="_blank">
                  <img src={TelegramIcon} alt="Vether Telegram Group Logo" style={{ maxWidth: '21px' }}/>
                </a>
              </li>
              <li style={{ marginLeft: '14px'}}>
                <a href="https://github.com/vetherasset" rel="noopener noreferrer" target="_blank">
                  <img src={GithubIcon} alt="Vetherasset Github Logo" style={{ maxWidth: '21px' }}/>
                </a>
              </li>
          </ul>
        </Row>
      </Breakpoint>
    </Layout.Sider>
  )
}

export default Sidebar
