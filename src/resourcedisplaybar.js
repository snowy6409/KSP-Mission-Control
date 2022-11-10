import ProgressBar from 'react-bootstrap/ProgressBar';
import React from "react";
import "./bars.css"
let srb_fuel_1 = 0;
let lq_fuel_1 = 0;
let ox_0 = 0;
let ec_0 = 0;
// Event source information
let source = new EventSource('/listen');
source.addEventListener("srb_fuel_1", (event)=>{
    srb_fuel_1 = event.data;
})
source.addEventListener("lq_fuel_1", (event)=>{
    lq_fuel_1 = event.data;
})
source.addEventListener("ox_0", (event)=>{
    ox_0 = event.data;
})
source.addEventListener("ec_0", (event)=>{
    ec_0 = event.data;
})
function MultiResourceManager({lf, ox, sf, ec, max_lf, max_ox, max_sf, max_ec}) {
    return (
        <div className={"bars"}>
            <ProgressBar variant="success" now={lq_fuel_1} label={"Liquid Fuel " + lq_fuel_1.toString()}/>
            <ProgressBar variant="info" now={ox_0} label={"Oxidiser " + ox_0.toString()}/>
            <ProgressBar variant="danger" now={srb_fuel_1} label={"Solid Fuel " + srb_fuel_1.toString()}/>
            <ProgressBar variant="warning" now={ec_0} label={"Electric Charge " + ec_0.toString()}/>
        </div>
    );
}

export default MultiResourceManager;