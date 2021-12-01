import React from "react";
import Chart from "react-apexcharts";

function HumidityGraph({value}) {
    const config = {
        colors: ['#58BEF1'],
        options: {
            labels: ['Humedad'],
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
                        opacity: 1,
                        size: '64%',
                    },

                },
            },

        },
    };

    return (
        <div className="chart-container">

            <Chart
                options={config.options}
                series={value}
                type="radialBar"
                width="450"
                className="chart"
            />
            <div className="chart-labels">
                <h2>Humedad</h2>
                <p>{value}%</p>
            </div>
        </div>
    );

}

export default HumidityGraph;