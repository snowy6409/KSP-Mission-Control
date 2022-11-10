export default class Endpoint_api{
    static StageRocket()
    {
        return fetch("/stage")
            .then(res=>res.json())
            .then(
                (result) => {

                },
                (error) => {
                    console.log("Error with staging rocket")
                }
            )
    }
    static ToggleSolarPanels(){
        return fetch("/actions/solar_panels")
            .then(res=>res.json())
    }

    static DeployParachutes() {
        return fetch("/actions/deploy_parachutes")
            .then(res=>res.json())
    }
}