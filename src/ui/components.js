import React from 'react'
import { Button as AntButton } from "antd"
import { HomeOutlined, FileTextOutlined, RightSquareOutlined, UpCircleOutlined,
  LoginOutlined, LineChartOutlined, PieChartOutlined, CheckSquareOutlined } from '@ant-design/icons';

export const Font = () => {
  return "Courier"
}

export const Colour = (alpha) => {
  var colour
  if(alpha){
    colour = {
      "yellow":'rgba(255, 206, 86, ' + alpha + ')'
    }
  } else {
    colour = {
      "black":"#110D01",
      "white":"#FFF",
      "red":"#a8071a",
      "green":"#7cb305",
      "dgrey": "#2B2515",
      "grey": "#97948E",
      "lgrey": "#F4F4F2",
      "rust": "#795900",
      "gold":"#D09800",
      "yellow":'#FFCE56'
    }
  }

  return colour
}

export const H2 = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "20px"
  styles.fontWeight = "bold"
  styles.color = Colour().white
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Label = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "1rem"
  styles.fontWeight = "bold"
  styles.color = Colour().white

  if (props.display) {
    styles.display = props.display
  }
  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.size) {
    styles.fontSize = props.size
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelGrey = (props) => {
  let styles = {...props.style || {}}

  if(props.display) {
    styles.display = props.display
  }
  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.color) {
    styles.color = props.color
  } else {
    styles.color = Colour().grey
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Sublabel = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = ""
  styles.color = Colour().white
  styles.display = "block"
  styles.clear = "both"

  if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Text = (props) => {
  let styles = {...props.style || {}}
  let className
  styles.fontSize = "14px"
  styles.color = Colour().white

  if (props.display) {
    styles.margin = props.display
  }
  if (props.bold) {
    styles.fontWeight = "bold"
  }
  if (props.color) {
    styles.color = props.color
  }
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.className) {
    className = props.className
  }

  return (
    <span style={styles} className={className}>
      {props.children}
    </span>
  )
}

export const P = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "10px"
  styles.color = Colour().grey
  styles.display = "block"
  styles.fontWeight = "bold"
  styles.display = "flex"
  styles.alignItems = "center"
  styles.justifyContent = "center"
  styles.marginBottom = "initial"
  // styles.marginLeft = -80
  if (props.size) {
    styles.fontSize = props.size
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Click = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = Colour().gold
  styles.textDecoration = "underline"
  styles.marginTop = 30
  styles.marginBottom = 30
  styles.margin = "20px 0px"
  if (props.size) {
    styles.fontSize = props.size
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const WalletStateIndicator = (props) => {
  let styles = {...props.style || {}}
  if(props.width) {
    styles.width = props.width
  }
  if(props.height) {
    styles.height = props.height
  }
  if(props.margin) {
    styles.margin = props.margin
  }
  if(props.display) {
    styles.display = props.display
  }
  if(props.state === true) {
    styles.backgroundColor = Colour().green
  } else {
    styles.backgroundColor = Colour().red
  }
  styles.borderRadius = "50%"
  return (
      <div style={styles}/>
  )
}

export const WalletConnectButton = (props) => {
  let styles = {...props.style || {}}
  styles.height = "20px"
  styles.padding = "0px 0px"
  styles.color = Colour().gold
  styles.display = "inline-block"
  styles.border = "none"
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
    styles.borderColor = props.backgroundColor
  }

  return (
      <AntButton
          disabled={props.disabled}
          style={styles}
          onClick={props.onClick}
          onChange={props.onChange}
          type={props.type}
          loading={props.loading}
      >
        {props.children}
      </AntButton>
  )
}

export const Button = (props) => {
  let styles = {...props.style || {}}
  styles.height = "20px"
  styles.padding = "0px 0px"
  styles.display = "inline-block"
  styles.border = "none";

  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
    styles.borderColor = props.backgroundColor
  }

  return (
    <AntButton
      disabled={props.disabled}
      style={styles}
      onClick={props.onClick}
      onChange={props.onChange}
      type={props.type}
      loading={props.loading}
    >
      {props.children}
    </AntButton>
  )
}

export const Center = (props) => (
  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
    {props.children}
  </div>
)

export const Icon = (props) => {

  if(props.icon === "overview"){
    return (
      <HomeOutlined>
        {props.children}
      </HomeOutlined>
    )
  }
  if(props.icon === "upgrade"){
    return (
      <UpCircleOutlined>
        {props.children}
      </UpCircleOutlined>
    )
  }
  if(props.icon === "acquire"){
    return (
      <RightSquareOutlined>
        {props.children}
      </RightSquareOutlined>
    )
  }
  if(props.icon === "claim"){
    return (
      <CheckSquareOutlined>
        {props.children}
      </CheckSquareOutlined>
    )
  }
  if(props.icon === "stake"){
    return (
      <LoginOutlined>
        {props.children}
      </LoginOutlined>
    )
  }
  if(props.icon === "trade"){
    return (
      <LineChartOutlined>
        {props.children}
      </LineChartOutlined>
    )
  }
  if(props.icon === "stats"){
    return (
      <PieChartOutlined>
        {props.children}
      </PieChartOutlined >
    )
  }


  if(props.icon === "whitepaper"){
    return (
      <FileTextOutlined>
        {props.children}
      </FileTextOutlined>
    )
  }
}

