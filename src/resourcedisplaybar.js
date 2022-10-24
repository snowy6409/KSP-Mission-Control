import ProgressBar from 'react-bootstrap/ProgressBar';
import React from "react";
import "./bars.css"

function MultiResourceManager({lf, ox, sf, ec, max_lf, max_ox, max_sf, max_ec}) {
    return (
        <div className={"bars"}>
            <ProgressBar variant="success" now={lf} label={"Liquid Fuel " + lf.toString()}/>
            <ProgressBar variant="info" now={ox} label={"Oxidiser " + ox.toString()}/>
            <ProgressBar variant="danger" now={sf} label={"Solid Fuel " + sf.toString()}/>
            <ProgressBar variant="warning" now={ec} label={"Electric Charge " + ec.toString()}/>
        </div>
    );
}

export default MultiResourceManager;