import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Menu, Layout } from 'antd';
import { Text, Icon } from '../components'

import Breakpoint from 'react-socks';

const Sidebar = (props) => {

  const menu_items = [
    "overview",
    "acquire",
    //"upgrade",
    // "stake",
    // "trade",
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

    <Layout.Sider width={"150"} trigger={null} collapsible breakpoint="md"
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

      <Breakpoint medium up>
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
      </Breakpoint>
    </Layout.Sider>
  )
}

export default Sidebar
