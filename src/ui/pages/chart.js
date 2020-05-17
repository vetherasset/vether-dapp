import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js'
import axios from 'axios'

import claimArray from '../../data/claimArray.json';
import emissionArray from '../../data/emissionArray.json';
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

    useEffect(() => {
        // const claimArray = getData()
        // console.log(claimArray)

        var chartConfigEther = chartConfig()
        chartConfigEther.data.labels = claimArray.days
        chartConfigEther.data.datasets[0].label = 'Ether Burnt'
        chartConfigEther.data.datasets[0].data = claimArray.burns
        chartConfigEther.options.scales.yAxes[0].scaleLabel.labelString = 'Ether Burnt'
        chartConfigEther.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
        chartConfigEther.options.title.text = 'Ether Burnt Daily'

        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigEther)
            setChartInstance(newChartInstance)
        }
    }, [chartContainer])

    // const getData = async () => {
    //     const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
    //     return response.data
    // }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartClaim = () => {

    // const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
    // const claimArray = response.data

    var chartConfigClaim = chartConfig()
    chartConfigClaim.options.title.text = 'Vether Emitted Daily'
    chartConfigClaim.data.labels = claimArray.days
    chartConfigClaim.data.datasets[0].label = 'Vether Emitted Daily'
    chartConfigClaim.data.datasets[0].data = claimArray.unclaims
    chartConfigClaim.options.scales.yAxes[0].scaleLabel.labelString = 'Vether Unclaimed'
    chartConfigClaim.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfigClaim.options.scales.xAxes[0].stacked = true
    chartConfigClaim.options.scales.yAxes[0].stacked = false

    const dataset2 = {
        label: "Emission",
        data:claimArray.emission,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
    }
    chartConfigClaim.data.datasets.push(dataset2)

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigClaim)
            setChartInstance(newChartInstance)
        }
    }, [chartContainer])

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
    // chartConfigEmission.data.datasets[1].label = 'Vether Emission'
    // chartConfigEmission.data.datasets[1].data = emissionArray.supply

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
