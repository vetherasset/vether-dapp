import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js'
import axios from 'axios'

import claimArray from '../../data/claimArray.json';
import emissionArray from '../../data/emissionArray.json';
import holderArray from '../../data/holderArray.json';
import {chartStyles, Colour, Font} from '../components'

const chartConfig = () => {
    return {
    type: 'bar',
    data: {
        labels: '',
        datasets: [{
            label: '',
            data: '',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
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

export const ChartEther = () => {  

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    var chartConfigEther = chartConfig()
    chartConfigEther.data.datasets[0].label = 'Ether Burnt'
    chartConfigEther.options.scales.yAxes[0].scaleLabel.labelString = 'Ether Burnt'
    chartConfigEther.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfigEther.options.title.text = 'Ether Burnt Daily'

    useEffect(() => {
  
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigEther)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data
        chartConfigEther.data.labels = claimArray.days
        chartConfigEther.data.datasets[0].data = claimArray.burns
        let totals = claimArray.burns.reduce((a, total) => +a + +total, 0)
        console.log(totals, claimArray.burns)
        const dataset2 = {
            type: "line",
            label: "Totals",
            data:totals,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }
        chartConfigEther.data.datasets.push(dataset2)
        newChartInstance.update()
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartClaim = () => {

    var chartConfigClaim = chartConfig()
    chartConfigClaim.options.title.text = 'Vether Emitted Daily'
    chartConfigClaim.data.datasets[0].label = 'Vether Unclaimed'
    chartConfigClaim.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfigClaim.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfigClaim.options.scales.xAxes[0].stacked = true
    chartConfigClaim.options.scales.yAxes[0].stacked = false

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigClaim)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data
        chartConfigClaim.data.labels = claimArray.days
        chartConfigClaim.data.datasets[0].data = claimArray.unclaims
        const dataset2 = {
            label: "Emission",
            data:claimArray.emission,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }
        chartConfigClaim.data.datasets.push(dataset2)
        newChartInstance.update()
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartEmission = () => {

    var chartConfigEmission = chartConfig()
    chartConfigEmission.type = "line"
    chartConfigEmission.data.labels = emissionArray.eras
    chartConfigEmission.data.datasets[0].label = 'Total Supply'
    chartConfigEmission.data.datasets[0].data = emissionArray.total
    chartConfigEmission.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfigEmission.options.scales.xAxes[0].scaleLabel.labelString = 'Era'
    chartConfigEmission.options.title.text = 'Vether Emission'

    const dataset2 = {
        type: "bar",
        label: "Era Emission",
        data:emissionArray.supply,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
    }
    chartConfigEmission.data.datasets.push(dataset2)

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigEmission)
            setChartInstance(newChartInstance)
        }
    }, [chartContainer])

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartDistro = () => {

    var chartConfigDistro = chartConfig()
    chartConfigDistro.type = "bar"
    chartConfigDistro.options.title.text = 'Vether Distribution'
    chartConfigDistro.data.datasets[0].label = 'Vether Distribution'
    chartConfigDistro.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfigDistro.options.scales.xAxes[0].scaleLabel.labelString = 'Member'

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigDistro)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        // const dataDistro = await axios.get('https://api.ethplorer.io/getTopTokenHolders/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey=freekey&limit=1000')
        // const holders = dataDistro.data.holders
        const holders = holderArray.holders
        let labels = []
        for(var i=1; i<=holders.length; i++){
            labels.push(i)
        }
        let holderShip = holders
        .filter(item => convertFromWei(item.balance) < 10000)
        .map(item => convertFromWei(item.balance))
        chartConfigDistro.data.labels = labels
        chartConfigDistro.data.datasets[0].data = holderShip
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
    

    var chartConfigPie = chartConfig()
    chartConfigPie.type = "pie"
    chartConfigPie.options.title.text = 'Vether Distribution'
    chartConfigPie.data.datasets[0].label = 'Vether Distribution'
    chartConfigPie.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfigPie.options.scales.xAxes[0].scaleLabel.labelString = 'Member'

    chartConfigPie.options.scales.yAxes[0].scaleLabel.display = false
    chartConfigPie.options.scales.yAxes[0].gridLines.display = false
    chartConfigPie.options.scales.xAxes[0].scaleLabel.display = false
    chartConfigPie.options.scales.xAxes[0].gridLines.display = false
    chartConfigPie.options.scales.yAxes[0].ticks.display = false
    chartConfigPie.options.scales.xAxes[0].ticks.display = false

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigPie)
            setChartInstance(newChartInstance)
            getData(newChartInstance)
        }
        
    }, [chartContainer])

    const getData = async (newChartInstance) => {
        // const dataDistro = await axios.get('https://api.ethplorer.io/getTopTokenHolders/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey=freekey&limit=1000')
        // const holders = dataDistro.data.holders
        const holders = holderArray.holders
        let labels = []
        for(var i=1; i<=holders.length; i++){
            labels.push(i)
        }
        let holderShip = holders
        .filter(item => convertFromWei(item.balance) < 10000)
        .map(item => convertFromWei(item.balance))
        chartConfigPie.data.labels = labels
        chartConfigPie.data.datasets[0].data = holderShip
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
