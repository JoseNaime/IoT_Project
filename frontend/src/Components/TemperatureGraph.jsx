import React from "react";
import Chart from "react-apexcharts";

function TemperatureGraph({value}) {
    const config = {
        colors: ['#58BEF1'],
        options: {
            labels: ['Temperatura (Cº)'],
            fill: {
                opacity:1,
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    gradientToColors: ["#FFAE50"],
                    stops: [-145, 145]
                }
            },
            stroke: {
                lineCap: "round"
            },
            plotOptions: {
                radialBar: {
                    startAngle: -145,
                    endAngle: 145,
                    track: {
                        background: '#18152A',
                        startAngle: -145,
                        endAngle: 145,
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            show: false
                        }
                    },
                    hollow: {
                        size: '64%',
                    }
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Chart
                options={config.options}
                series={[value*2]}
                type="radialBar"
                width="450"

                className="chart"
            />
            <div className="chart-labels">
                <h2>Temperatura</h2>
                <p>{value}º</p>
            </div>
        </div>
    );

}

export default TemperatureGraph;