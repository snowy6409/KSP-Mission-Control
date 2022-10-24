import React from "react";
import "./bars.css"

function ShipStatus() {
    return (
        <div className={"bars"}>
            <label>{"Situation: " + "Landed"}</label>
            <label>{"Destination: " + "Mun"}</label>
            <label>{"Max Delta V: " + "2700 m/s"}</label>
            <label>{"Gravity Turn: 2700 m"}</label>
            <label>{"Control: Unmanned"}</label>
            <label>{"Signal: 98%"}</label>
            <label>{"SAS: Enabled"}</label>
            <label>{"RCS: Disabled"}</label>
        </div>
    );
}

export default ShipStatus;