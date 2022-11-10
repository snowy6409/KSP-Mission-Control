import { Line } from "react-chartjs-2";
import * as React from "react";
import "chartjs-plugin-streaming";
import moment from "moment";

const Chart = require("react-chartjs-2").Chart;

const chartColors = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)"
};

const color = Chart.helpers.color;
const data = {
    datasets: [
        {
            label: "Altitude",
            backgroundColor: color(chartColors.red)
                .alpha(0.5)
                .rgbString(),
            borderColor: chartColors.red,
            fill: false,
            lineTension: 0,
            borderDash: [8, 4],
            data: []
        },
        {
            label: "Apoapsis",
            backgroundColor: color(chartColors.blue)
                .alpha(0.5)
                .rgbString(),
            borderColor: chartColors.blue,
            fill: false,
            lineTension: 0,
            borderDash: [8, 4],
            data: []
        }
    ]
};
let current_data =0;
let current_data_apoapsis=0;
// Event source information
let source = new EventSource('/listen');
source.addEventListener("altitude", (event)=>{
    current_data = event.data;
})
source.addEventListener("apoapsis", (event)=>{
    current_data_apoapsis = event.data;
})
source.onmessage = function (e) {
    console.log("Data")
    console.log(e.data)
};
source.onerror = (err) => {
    console.error("EventSource failed:", err);
};

//////////////////////////
const options = {
    elements: {
        line: {
            tension: 0.5
        }
    },
    scales: {
        xAxes: [
            {
                type: "realtime",
                distribution: "linear",
                realtime: {
                    onRefresh: function(chart) {
                        chart.data.datasets[0].data.push({
                            x: moment(),
                            y: parseFloat(current_data)
                        });
                        chart.data.datasets[1].data.push({
                            x: moment(),
                            y: parseFloat(current_data_apoapsis)
                        });
                    },
                    delay: 1000,
                    time: {
                        displayFormat: "h:mm"
                    }
                },
                ticks: {
                    displayFormats: 1,
                    maxRotation: 0,
                    minRotation: 0,
                    stepSize: 1,
                    maxTicksLimit: 30,
                    minUnit: "second",
                    source: "auto",
                    autoSkip: true,
                    callback: function(value) {
                        return moment(value, "HH:mm:ss").format("mm:ss");
                    }
                }
            }
        ],
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    max: 1000000
                }
            }
        ]
    }
};





class ChartDisplay extends React.Component {

constructor(props) {
    super(props);
}
    render()
    {
        return(
            <div>
                <Line data={data} options={options}/>
            </div>
        )
    }
}
export default ChartDisplay