import {Responsive, WidthProvider} from "react-grid-layout";
import * as React from "react";
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import App from "./App";
import Login from "./Login";
import "./mainscreen.css"
import MainDashboard from "./maindashboard";


const ResponsiveGridLayout = WidthProvider(Responsive);
let current_view_tab = App();


class MyFirstGrid extends React.Component {

    myState = {
        "isEdit": true
    };
    sidenav = (
        <div style={{display: 'flex', height: '100vh', overflow: 'scroll initial'}}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader pitrefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/" className="text-decoration-none" style={{color: 'inherit'}}>
                        Sidebar
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <CDBSidebarMenuItem icon="columns"
                                            onClick={() => this.switchComponent()}>Dashboard</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="table">Tables (NYI)</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="user">Profile page (NYI)</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line">Analytics (NYI)</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line">Launch Control (NYI)</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line">Signal Control (NYI)</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line">Experiment Control (NYI)</CDBSidebarMenuItem>
                        <CDBSidebarMenuItem icon="chart-line">Resource Control (NYI)</CDBSidebarMenuItem>

                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter style={{textAlign: 'center'}}>
                    <div
                        style={{
                            padding: '20px 5px',
                        }}
                    >
                        Sidebar Footer
                    </div>
                    <CDBSidebarMenuItem icon="exclamation-circle"
                                        onClick={() => this.logoutUser()}>Logout</CDBSidebarMenuItem>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );

    constructor(props) {
        super(props);
        this.state =
            {
                dashboard: true,
                date: new Date(),
                ox: 0,
                lf: 0,
                sf: 0,
                ec: 0,
                user_auth: false,
                user_name: "",
                test_username: "tuser1",
                test_password: "tuser1",
                user_password: ""
            };
    }

    switchComponent() {
        this.setState({dashboard: true})
    };

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    logoutUser() {
        this.setState({user_auth: false})
    }

    loginUser(username, password) {
        console.log("Login");
        console.log(username);
        console.log(password);
        if (username.toString() === this.state.test_username.toString() && password.toString() === this.state.test_password) {
            this.setState({user_auth: true})
        }
    }

    tick() {
        if (this.state.ox < 100) {
            this.setState({
                ox: this.state.ox += 1
            });
        }
        if (this.state.lf < 100) {
            this.setState({
                lf: this.state.lf += 1
            });
        }
        if (this.state.sf < 100) {
            this.setState({
                sf: this.state.sf += 1
            });
        }
        if (this.state.ec < 100) {
            this.setState({
                ec: this.state.ec += 1
            });
        }


        console.log("Time")
    }

    render() {
        // layout is an array of objects, see the demo for more complete usage
        function getLayout() {
            return (
                {
                    lg: [
                        {i: "1", x: 2, y: 0, w: 8, h: 1, minW: 8, maxW: 8, static: true},

                    ],
                }
            )
        }

        const layouts = getLayout();


        return (

            <div className="main_flex_container">
                {(!this.state.user_auth) ? <br/> : this.sidenav}
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{lg: 19690, md: 16690}}
                    cols={{lg: 12, md: 6, sm: 12, xs: 12, xxs: 12}}
                >
                    <div key="1">
                        {(!this.state.user_auth) ? <Login login={this.loginUser.bind(this)}/> :
                            (!this.state.dashboard) ? <App/> :
                                <MainDashboard ox={this.state.ox} lf={this.state.lf} ec={this.state.ec}
                                               sf={this.state.sf}/>
                        }
                    </div>

                </ResponsiveGridLayout>
            </div>
        );
    }
}

export default MyFirstGrid