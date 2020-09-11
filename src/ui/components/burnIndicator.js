import React, { useRef, useEffect, memo, useState } from "react"
import defaults from "../../common/defaults"
import Web3 from "web3"
import { Progress } from 'antd'
import { getSecondsToGo } from "../../common/utils"

const Clock = (props) => {
    const [countdown, setCountdown] = useState(0)
    const time = new Date(countdown * 1000).toISOString().substr(11, 8)

    useEffect(() => {
        const loadData = async () => {
            const web3 = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
            const vether = new web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
            try {
                const seconds = getSecondsToGo(await vether.methods.nextDayTime().call())
                setCountdown(seconds)
            } catch (err) {
                console.log(err)
            }
        }

        const ticker = countdown > 0 && setInterval(() => setCountdown(countdown - 1),
            1000)
        if (countdown <= 0) {
            setCountdown(0)
            loadData()
        }
        return () => clearInterval(ticker)
    }, [countdown])


    let title = {...props.title || {}}
    title.textAlign = 'center'
    title.marginBottom = "2.99rem"
    if (props.titleFontSize) title.fontSize = props.titleFontSize

    let alt = {...props.alt || {}}
    alt.textAlign = 'right'
    alt.display = 'block'
    alt.marginRight = '101px'
    alt.color = defaults.color.gray
    if (props.altFontSize) alt.fontSize = props.altFontSize

    return (
        <>
            <span style={alt}>Remaining Time</span>
            <p style={title}>{time}</p>
        </>
    )
}

const ProgressBar = () => {
    const [countdown, setCountdown] = useState(0)
    const [distribution, setDistribution] = useState({ era: 0, day: 0 })
    const percent = Number((((defaults.vether.secondsPerDay - countdown) / defaults.vether.secondsPerDay) * 100).toFixed(0))

    useEffect(() => {
        const loadData = async () => {
            try {
                const web3 = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
                const vether = new web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const seconds = getSecondsToGo(await vether.methods.nextDayTime().call())
                setCountdown(seconds)

                const day = await vether.methods.currentDay().call()
                const era = await vether.methods.currentEra().call()
                setDistribution({
                    era: era,
                    day: day
                })
            } catch (err) {
                console.log(err)
            }
        }

        const ticker = countdown > 0 && setInterval(() => setCountdown(countdown - 1),
            1000)
        if (countdown <= 0) {
            setCountdown(0)
            loadData()
        }
        return () => clearInterval(ticker)
    }, [countdown])


    return (
        <>
            <div style={{ marginTop: '97px', padding: '0 15px' }}>
                <span>Era {distribution.era}, Day {distribution.day}</span>
                <Progress percent={percent} strokeColor={defaults.color.accent} status="active" />
            </div>
        </>
    )
}

export const BurnIndicator = memo((props) => {

    const fireCanvas = useRef()

    const Canvas = () => {
        return (
            <>
                <canvas ref={fireCanvas} style={{ display: 'block', margin: '0 auto', minHeight: 480 }}>
                    Your browser does not support Canvas.
                </canvas>
            </>
        )
    }

    const Fire = (function () {
        let Direction

        (function (Direction) {
            Direction[Direction["U"] = 0] = "U"
            Direction[Direction["D"] = 1] = "D"
            Direction[Direction["L"] = 2] = "L"
            Direction[Direction["R"] = 3] = "R"
        })(Direction || (Direction = {}))
        function Fire(canvas, options) {
            this.COLOR_STOP_SETS = {
                "original": ["#ffffff", "#ffff00", "#ffd700", "#ff69b4", "#ff6633", "#483d8b"],
                "magical": ["#ffffff", "#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
                "magical2": ["#ffffff", "#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
                "reddish": ["#ffffff", "#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
                "purple": ["#ffffff", "#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"]
            }
            this.NUM_COLORS = 16
            this.FIRE_HEIGHT = 60
            this.FIRE_WIDTH = 40
            this.DEFAULT_SCALE = 4
            this.DEFAULT_BACKGROUND_COLOR = "#000000"
            this.DEFAULT_COLOR_STOP_SET_NAME = "purple"
            this.canvas = canvas
            this.backgroundColor = options["backgroundColor"] || this.DEFAULT_BACKGROUND_COLOR
            this.scale = options["scale"] || this.DEFAULT_SCALE
            this.colorStopSetName = options["colorStopSetName"] || this.DEFAULT_COLOR_STOP_SET_NAME
            this.colorStopSet = this.COLOR_STOP_SETS[this.colorStopSetName] || this.COLOR_STOP_SETS[this.DEFAULT_COLOR_STOP_SET_NAME]
            this.started = false
            this.ctx = this.canvas.getContext("2d")
            this.initColors()
            this.canvas.width = this.FIRE_WIDTH * this.scale
            this.canvas.height = this.FIRE_HEIGHT * this.scale
        }
        Fire.prototype.start = function () {
            this.initFire()
            this.startAnimation()
            this.started = true
            this.b00mf()
        }
        Fire.prototype.startAnimation = function () {
            let _this = this
            this.animationId = window.requestAnimationFrame(function () { return _this.animate() })
        }
        Fire.prototype.stop = function () {
            if (this.animationId != null) {
                window.cancelAnimationFrame(this.animationId)
            }
            this.started = false
            this.animationId = null
        }
        Fire.prototype.b00mf = function () {
            for (let i = 0; i < 100; i++) {
                let x = this.FIRE_WIDTH / 2 + this.randomInt(-8, 8)
                let y = this.FIRE_HEIGHT - 8 + this.randomInt(-16, 4)
                this.fire[y][x] = 0
            }
        }
        Fire.prototype.initColors = function () {
            this.canvas.hidden = true
            this.canvas.width = this.NUM_COLORS
            this.canvas.height = 1
            let gradient = this.ctx.createLinearGradient(0, 0, this.NUM_COLORS, 0)
            let f = 1.0 / (this.colorStopSet.length + 1)
            for (let i = 0; i < this.colorStopSet.length; i++) {
                let color = this.colorStopSet[i]
                let offset = (i + 1) * f
                gradient.addColorStop(offset, color)
            }
            gradient.addColorStop(1, this.backgroundColor)
            this.ctx.fillStyle = gradient
            this.ctx.fillRect(0, 0, this.NUM_COLORS, 1)
            let imageData = this.ctx.getImageData(0, 0, this.NUM_COLORS, 1).data
            let colors = new Array(this.NUM_COLORS)
            for (let c = 0, i = 0; i < imageData.length; c++, i += 4) {
                colors[c] = "rgb(" + imageData[i] + ", " + imageData[i + 1] + ", " + imageData[i + 2] + ")"
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.canvas.hidden = false
            this.colors = colors
        }
        Fire.prototype.initFire = function () {
            let fire = []
            for (let r = 0; r < this.FIRE_HEIGHT; r++) {
                fire[r] = new Array(this.FIRE_WIDTH)
                for (let c = 0; c < this.FIRE_WIDTH; c++) {
                    fire[r][c] = this.NUM_COLORS
                }
            }
            this.fire = fire
        }
        Fire.prototype.animate = function () {
            this.update()
            this.render()
            this.startAnimation()
        }
        Fire.prototype.update = function () {
            // Keep adding fire at the base.
            let x = this.FIRE_WIDTH / 2 + this.randomInt(-1, 1)
            let y = this.FIRE_HEIGHT - 8 + this.randomInt(-12, 1)
            this.fire[y][x] = 0
            let row
            for (let r = 0; r < this.FIRE_HEIGHT; r++) {
                for (let c = 0; c < this.FIRE_WIDTH; c++) {
                    let x_1 = c
                    let y_1 = r
                    switch (this.randomDirection()) {
                        case Direction.D:
                            y_1++
                            break
                        case Direction.L:
                            x_1--
                            break
                        case Direction.R:
                            x_1++
                            break
                        case Direction.U:
                            y_1--
                            break
                        default:
                        // No default
                    }
                    let orig = this.fire[r][c]
                    let p = (row = this.fire[y_1]) && row[x_1]
                    let fa = this.randomFlameAdvancement()
                    let q = (p != null && p < orig) ? p : orig
                    q += fa
                    if (q > this.NUM_COLORS)
                        q = this.NUM_COLORS
                    this.fire[r][c] = q
                }
            }
        }

        Fire.prototype.render = function () {
            for (let r = 0; r < this.FIRE_HEIGHT; r++) {
                for (let c = 0; c < this.FIRE_WIDTH; c++) {
                    let color_idx = this.fire[r][c]
                    this.ctx.fillStyle = (color_idx === this.NUM_COLORS) ? this.backgroundColor : this.colors[color_idx]
                    this.ctx.fillRect(c * this.scale, r * this.scale, this.scale, this.scale)
                }
            }
        }

        Fire.prototype.randomFlameAdvancement = function () {
            // Make it slightly more likely to return 0 than 1 or 2. A little of this
            // goes a very long way.
            // `d = 0.05; [t+d, t+d + (t-d/2)]`
            let r = Math.random()
            if (r < 0.3833)
                return 0
            if (r < 0.6916)
                return 1
            else
                return 2
        }
        // Direction *from* which to draw inspiration when updating.
        Fire.prototype.randomDirection = function () {
            let r = Math.random()
            if (r < 0.6666)
                return Direction.D
            if (r < 0.8)
                return Direction.L
            if (r < 0.93)
                return Direction.R
            else
                return Direction.U
        }

        Fire.prototype.randomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }
        return Fire
    }())

    const fireplace = () => {
        return new Fire(fireCanvas.current, {
            backgroundColor: defaults.color.dark,
            scale: props.scale,
            colorStopSetName: "purple"
        })
    }

    const launchFire = () => {
        const fire = fireplace()
        fire.start()
    }

    // const stopFire = () => {
    //     const fire = fireplace()
    //     fire.start()
    // }
    //
    // const b00mf = () => {
    //     const fire = fireplace()
    //     fire.b00mf()
    // }

    useEffect(() => {
        launchFire()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Clock titleFontSize={props.titleFontSize} />
            <Canvas scale={props.scale} />
            <ProgressBar/>
        </>
    )
})