import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js'

import claimArray from '../../data/claimArray.json';

const chartConfigEther = {
    type: 'bar',
    data: {
        labels: claimArray.days,
        datasets: [{
            label: 'Ether Burnt',
            data: claimArray.burns,
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
                    labelString: "Ether Burnt",
                    fontFamily: "Courier"
                },
                gridLines: {
                    display: true ,
                    color: "#2B2515"
                  },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Day",
                    fontFamily: "Courier"
                },
                gridLines: {
                    display: false ,
                    color: "#2B2515"
                  },
            }]
        },
        title: {
            display: true,
            text: 'Ether Burnt Daily',
            fontFamily: "Courier",
            padding:20
        },
        legend: {
            display: true,
            position: "bottom",
            labels:{
                fontFamily: "Courier",
            }
            
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        }
    }
}

export const ChartEther = () => {

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigEther)
            setChartInstance(newChartInstance)
        }
    }, [chartContainer])

    const chartStyles = {
        marginLeft:0,
        marginRight:50,
        marginTop:50,
        backgroundColor:'#110D01',
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}


const chartConfigClaim = {
    type: 'bar',
    data: {
        labels: claimArray.days,
        datasets: [{
            label: 'Unclaimed Vether',
            data: claimArray.unclaims,
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
                    labelString: "Vether Unclaimed",
                    fontFamily: "Courier"
                },
                gridLines: {
                    display: true ,
                    color: "#2B2515"
                  },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Day",
                    fontFamily: "Courier"
                },
                gridLines: {
                    display: false ,
                    color: "#2B2515"
                  },
            }]
        },
        title: {
            display: true,
            text: 'Unclaimed Vether',
            fontFamily: "Courier",
            padding:20
        },
        legend: {
            display: true,
            position: "bottom",
            labels:{
                fontFamily: "Courier",
            }
            
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        }
    }
}

export const ChartClaim = () => {

    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfigClaim)
            setChartInstance(newChartInstance)
        }
    }, [chartContainer])

    const chartStyles = {
        marginLeft:0,
        marginRight:50,
        marginTop:50,
        backgroundColor:'#110D01',
    }

    return(
        <div style={chartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}
