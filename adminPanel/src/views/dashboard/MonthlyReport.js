import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function VerticalBarDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Tenders',
                    backgroundColor: "#F6FF00",
                    barThickness: 12,
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                    }, // Rounded corners for the top of the bars
                    data: [65, 59, 80, 81, 56, 55]
                },
                {
                    label: ' ',
                    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent bars for spacing
                    barThickness: 12,
                    data: [null, null, null, null, null, null] // Empty data for spacing
                },
                {
                    label: ' ',
                    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent bars for spacing
                    barThickness: 12,
                    data: [null, null, null, null, null, null] // Empty data for spacing
                },
                {
                    label: 'Categories',
                    backgroundColor: "#118b44",
                    barThickness: 12,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                    }, // Rounded corners for the top of the bars
                    data: [28, 48, 40, 19, 86, 27]
                },
                {
                    label: ' ',
                    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent bars for spacing
                    barThickness: 12,
                    data: [null, null, null, null, null, null] // Empty data for spacing
                },
                {
                    label: ' ',
                    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent bars for spacing
                    barThickness: 12,
                    data: [null, null, null, null, null, null] // Empty data for spacing
                },
                {
                    label: 'Organizations',
                    backgroundColor:"#000",
                    barThickness: 12,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                    }, // Rounded corners for the top of the bars
                    data: [28, 48, 40, 19, 86, 27]
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.5,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="card">
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    )
}
