import React from 'react'
import { Button as AntButton } from "antd"
import { HomeOutlined, FileTextOutlined, RightSquareOutlined, LoginOutlined, LineChartOutlined, PieChartOutlined, CheckSquareOutlined } from '@ant-design/icons';

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

export const H1 = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "24px"
  styles.fontWeight = "bold"
  styles.color = Colour().white

    if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
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

export const Subtitle = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
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
  styles.fontSize = "16px"
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

export const LabelGrey = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = Colour().grey
  styles.margin = "20px 0px"

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

export const Sublabel = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = ""
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

export const Text = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.color = Colour().white
  styles.margin = "20px 0px"

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
  return (
    <span style={styles}>
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

export const Button = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = Colour().gold
  styles.textDecoration = "underline"
  styles.marginTop = 30
  styles.marginBottom = 30
  styles.margin = "0px 0px"
  styles.backgroundColor = Colour().dgrey
  styles.borderColor = Colour().dgrey
  styles.display= "inline-block"
  styles.borderBottom = "1px solid #D09800"
  styles.height = "20px"
  styles.padding = "0px 0px"

  if (props.size) {
    styles.fontSize = props.size
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

export const HR = () => (
  <div>
    <hr style={{border: "1px dashed #97948E", marginTop:40}}/>
  </div>
)

export const Gap = () => (
  <div>
    <br></br><br></br>
  </div>
)

export const Icon = (props) => {

  let styles = {...props.style || {}}
  styles.margin = "0px 10px 0px 0px"
  styles.fontWeight = "bold"

  if (props.color) {
    styles.color = props.color
  }
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.margin) {
    styles.margin = props.margin
  }

  if(props.icon === "overview"){
    return (
      <HomeOutlined style={styles}>
        {props.children}
      </HomeOutlined>
    )
  }
  if(props.icon === "acquire"){
    return (
      <RightSquareOutlined style={styles}>
        {props.children}
      </RightSquareOutlined>
    )
  }
  if(props.icon === "claim"){
    return (
      <CheckSquareOutlined style={styles}>
        {props.children}
      </CheckSquareOutlined>
    )
  }
  if(props.icon === "stake"){
    return (
      <LoginOutlined style={styles}>
        {props.children}
      </LoginOutlined>
    )
  }
  if(props.icon === "trade"){
    return (
      <LineChartOutlined style={styles}>
        {props.children}
      </LineChartOutlined>
    )
  }
  if(props.icon === "stats"){
    return (
      <PieChartOutlined style={styles}>
        {props.children}
      </PieChartOutlined >
    )
  }
  
  
  if(props.icon === "whitepaper"){
    return (
      <FileTextOutlined style={styles}>
        {props.children}
      </FileTextOutlined>
    )
  }
}

