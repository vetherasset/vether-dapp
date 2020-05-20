import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js'
import axios from 'axios'

import emissionArray from '../../data/emissionArray.json';
import {chartStyles, Colour, Font} from '../components'

const getChartConfig = () => {
    return {
    type: 'bar',
    data: {
        labels: '',
        datasets: [{
            label: '',
            data: '',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "L"
        }]
    },
    options: {
        scales: {
            yAxes: [{
                id: "L",
                type: "linear",
                position: "left",
                ticks: {
                    beginAtZero: true,
                },
                scaleLabel: {
                    display: true,
                    labelString: "",
                    fontFamily: Font(),
                    fontSize:16
                },
                gridLines: {
                    display: true ,
                    color: Colour().dgrey,
                    zeroLineColor: Colour().dgrey
                  },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: "",
                    fontFamily: Font(),
                    fontSize:16
                },
                gridLines: {
                    display: false ,
                    color: Colour().dgrey,
                    zeroLineColor: Colour().dgrey
                  },
            }]
        },
        title: {
            display: true,
            text: '',
            fontFamily: Font(),
            padding:20,
            fontSize:20
        },
        legend: {
            display: false,
            position: "bottom",
            labels:{
                fontFamily: Font(),
            }
            
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
}}

const rightAxisConfig = () => {
    return {
    id: "R",
    type: "linear",
    position: "right",
    ticks: {
        beginAtZero: true,
    },
    scaleLabel: {
        display: true,
        labelString: "Total Ether",
        fontFamily: Font(),
        fontSize:16
    },
    gridLines: {
        display: false
      }
}}

export const ChartEther = () => {  

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    var chartConfig = getChartConfig()
    chartConfig.data.datasets[0].label = 'Ether Burnt'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Ether Burnt'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfig.options.title.text = 'Ether Burnt Daily'

    useEffect(() => {
  
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        // eslint-disable-next-line
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data
        chartConfig.data.labels = claimArray.days
        chartConfig.data.datasets[0].data = claimArray.burns
        console.log(claimArray)
        const dataset2 = {
            type: "line",
            label: "Total Burnt",
            data:claimArray.totals,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "R"
        }
        chartConfig.data.datasets.push(dataset2)
        chartConfig.options.scales.yAxes.push(rightAxisConfig())
        chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Ether Burnt'
        newChartInstance.update()
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartClaim = () => {

    var chartConfig = getChartConfig()
    chartConfig.options.title.text = 'Vether Emitted Daily'
    chartConfig.data.datasets[0].label = 'Vether Unclaimed'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfig.options.scales.xAxes[0].stacked = true
    chartConfig.options.scales.yAxes[0].stacked = false

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        // eslint-disable-next-line
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data
        chartConfig.data.labels = claimArray.days
        chartConfig.data.datasets[0].data = claimArray.unclaims
        const dataset2 = {
            label: "Emission",
            data:claimArray.emission,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }
        chartConfig.data.datasets.push(dataset2)

        const dataset3 = {
            type: "line",
            label: "Planned Total",
            data:claimArray.vether,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "R"
        }
        chartConfig.data.datasets.push(dataset3)

        const dataset4 = {
            type: "line",
            label: "Actual Total",
            data:claimArray.claims,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "R"
        }
        chartConfig.data.datasets.push(dataset4)

        chartConfig.options.scales.yAxes.push(rightAxisConfig())
        chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Vether Supply'
        newChartInstance.update()
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartEmission = () => {

    var chartConfig = getChartConfig()
    chartConfig.type = "line"
    chartConfig.data.labels = emissionArray.eras
    chartConfig.data.datasets[0].label = 'Total Supply'
    chartConfig.data.datasets[0].data = emissionArray.total
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Era'
    chartConfig.options.title.text = 'Vether Emission'

    const dataset2 = {
        type: "bar",
        label: "Era Emission",
        data:emissionArray.supply,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
    }
    chartConfig.data.datasets.push(dataset2)

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
        }
        // eslint-disable-next-line
    }, [chartContainer])

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartDistro = () => {

    var chartConfig = getChartConfig()
    chartConfig.type = "bar"
    chartConfig.options.title.text = 'Vether Distribution'
    chartConfig.data.datasets[0].label = 'Member Ownership'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether (linear)'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Member'
    

    const dataset3 = {
        type: "line",
        label: "Ownership",
        data: '',
        fill: false,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        yAxisID: "R"
    }
    chartConfig.data.datasets.push(dataset3)
    chartConfig.options.scales.yAxes.push(rightAxisConfig())
    chartConfig.options.scales.yAxes[1].type = "logarithmic"
    chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Vether (logarithmic)'

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        // eslint-disable-next-line
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        const apiKey = process.env.REACT_APP_ETHPLORER_API
        const baseURL = 'https://api.ethplorer.io/getTopTokenHolders/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey='
        console.log(baseURL+apiKey+'&limit=1000')
        const response = await axios.get(baseURL+apiKey+'&limit=1000')

        // const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/holderArray.json')
        
        let holderArray = response.data
        const holders = holderArray.holders
        
        let holderShip = holders
        .filter(item => convertFromWei(item.balance) < 10000)
        .filter(item => convertFromWei(item.balance) > 0.1)
        .map(item => convertFromWei(item.balance))
        let labels = []
        for(var i=1; i<=holderShip.length; i++){
            labels.push(i)
        }
        chartConfig.data.labels = labels
        chartConfig.data.datasets[0].data = holderShip
        chartConfig.data.datasets[1].data = holderShip
        newChartInstance.update()
    }

    function convertFromWei(number) {
        return number / 1000000000000000000
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartPie = () => {
    

    var chartConfig = getChartConfig()
    chartConfig.type = "pie"
    chartConfig.options.title.text = 'Vether Ownership'
    chartConfig.data.datasets[0].label = 'Member Ownership'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Member'

    chartConfig.options.scales.yAxes[0].scaleLabel.display = false
    chartConfig.options.scales.yAxes[0].gridLines.display = false
    chartConfig.options.scales.xAxes[0].scaleLabel.display = false
    chartConfig.options.scales.xAxes[0].gridLines.display = false
    chartConfig.options.scales.yAxes[0].ticks.display = false
    chartConfig.options.scales.xAxes[0].ticks.display = false

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        // eslint-disable-next-line
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/holderArray.json')
        let holderArray = response.data
        const holders = holderArray.holders
        let labels = []
        for(var i=1; i<=holders.length; i++){
            labels.push(i)
        }
        let holderShip = holders
        .filter(item => convertFromWei(item.balance) < 10000)
        .map(item => convertFromWei(item.balance))
        chartConfig.data.labels = labels
        chartConfig.data.datasets[0].data = holderShip
        newChartInstance.update()
    }

    function convertFromWei(number) {
        return number / 1000000000000000000
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}
