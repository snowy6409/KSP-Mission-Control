import * as React from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import MultiResourceManager from "./resourcedisplaybar";
import ShipStatus from "./shipstatus";

const ResponsiveGridLayout = WidthProvider(Responsive);

class MainDashboard extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        // layout is an array of objects, see the demo for more complete usage
        function getLayout() {
            return (
                {
                    lg: [
                        {i: "1", x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, static: false},
                        {i: "2", x: 2, y: 0, w: 6, h: 1, minW: 6, maxW: 6, minH: 1, static: false},

                    ],
                }
            )
        }

        const layouts = getLayout();


        return (

            <div>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{lg: 19690, md: 16690}}
                    cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
                >
                    <div key="1">
                        <ShipStatus/>
                    </div>
                    <div key="2">
                        <MultiResourceManager ox={this.props.ox} lf={this.props.lf} ec={this.props.ec}
                                              sf={this.props.sf}/>
                    </div>

                </ResponsiveGridLayout>
            </div>
        );
    }
}

export default MainDashboard