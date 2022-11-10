import * as React from "react";
import Endpoint_api from "./api";
import "./controlPanel.css"




class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
    }
    render()
    {
        return(
            <div>
                <button id={"Stage_Rocket"}    onClick={()=>Endpoint_api.StageRocket()} className={"buttonBlack"}>
                    Stage Rocket
                </button>
                <br/>
                <button id={"Toggle_Solar_Panels"}    onClick={()=>Endpoint_api.ToggleSolarPanels()} className={"buttonBlack"}>
                    Toggle Solar Panels
                </button>
                <button id={"Deploy_Parachutes"}    onClick={()=>Endpoint_api.DeployParachutes()} className={"buttonBlack"}>
                    Deploy Parachutes
                </button>
            </div>
        )
    }
}
export default ControlPanel