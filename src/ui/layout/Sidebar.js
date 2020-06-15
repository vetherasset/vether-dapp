import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Menu, Layout } from 'antd';
import { Text, Icon, Colour } from '../components'

import Footer from './Footer'

import Breakpoint from 'react-socks';

const Sidebar = (props) => {

  const menu_items = [
    "overview",
    "acquire",
    "stake",
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

//   const getIcon = (key) => {
//     if (isSelected(key)) {
//       return key + "-active"
//     } else {
//       return key + "-inactive"
//     }
//   }

  const isSelected = (key) => {
    return key === page
  }

  const handleClick = ({ key }) => {
    setPage(key)
  }

  const sidebarStyles = {
    backgroundColor: Colour().black
  }

  const selected_styles = {
    backgroundColor: Colour().dgrey,
    color: Colour().grey,
  }

  const getStyles = (key) => {
    if (key === page) {
      return selected_styles
    } else {
      return {}
    }
  }

  const icon_styles = {
    fontSize: "14px",
    color: Colour().grey,
  }

  const icon_selected_styles = {
    fontSize: "14px",
    color: "#fff",
  }

    const getIconStyles = (key) => {
    if (isSelected(key)) {
      return icon_selected_styles
    } else {
      return icon_styles
    }
  }

  return (

    <Layout.Sider style={sidebarStyles} width={"150"} trigger={null} collapsible breakpoint="md"
    collapsedWidth="0">

  <Breakpoint small down>
      <Menu onClick={handleClick} mode="inline" selectedKeys={[page]}>
        {menu_items.map((item) => (
          <Menu.Item key={item} style={getStyles(item)}>
            <Link to={"/" + item}>             
              <Icon icon={item} style={getIconStyles(item)} />
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      </Breakpoint>

      <Breakpoint medium up>
      <Menu onClick={handleClick} mode="inline" theme="light" selectedKeys={[page]}>
        {menu_items.map((item) => (
          <Menu.Item key={item} style={getStyles(item)}>
            <Link to={"/" + item}>             
                <Icon icon={item} style={getIconStyles(item)} />
                <span>{isSelected(item) ? <Text bold={true} color="#fff">{item}</Text> : 
                <Text bold={true} color="#97948E">{item}</Text>}</span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      </Breakpoint>
      <Footer />
    </Layout.Sider>
  )
}

export default Sidebar
