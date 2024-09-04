// App.js file
import React, { Component } from "react";
import history from "./history";
import "react-perfect-scrollbar/dist/css/styles.css";
import Router from "./router";
import _EventEmitter from "../constants/emitter";
import Cookies from "universal-cookie";
import "./../views/alert/ConfirmationDialog.css"
import { localStorageService } from "../services/LocalStorageService";
import 'bootstrap/dist/css/bootstrap.min.css';


const cookies = new Cookies();

class App extends Component {
    constructor(props) {
        super(props);
        _EventEmitter.on("changeLayout", this.toggleDarkMode);
    }

    toggleDarkMode = () => {
        var darkModeLink = document.getElementById("darkmodeCss");

        if (darkModeLink != null) {
            document.head.removeChild(darkModeLink);
            return;
        }

        this.loadCssIntoDom("darkmodeCss", "/css/" + process.env.REACT_APP_DARKMODE_STYLESHEET);
    };

    componentDidMount() {
        fetch(process.env.PUBLIC_URL + '/version.json')
        .then(response => response.json())
        .then(data => {
            localStorageService.persistInLocalStorage("APP_VERSION",data?.latest_Version)
        })
        .catch(error => {
            console.log('Error:', error);
        });

      
        let layoutMode = cookies.get("LayoutMode");

        if (layoutMode?.toString() === "layout-dark") {
            this.toggleDarkMode();
        }

        // this.loadCssIntoDom("globalCss", "/css/" + process.env.REACT_APP_STYLESHEET);
    }

    isDarkThemeRequested = () => {
        var value = localStorage.getItem("LayoutMode") ?? "layout-light";
        return value !== "layout-light";
    };

    loadCssIntoDom = (id, path) => {
        var existingElement = document.getElementById(id);

        if (existingElement != null) {
            return;
        }

        var link = document.createElement("link");

        link.setAttribute("id", id);
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = process.env.PUBLIC_URL + path;
        document.head.appendChild(link);
    }


    render() {
        return <Router history={history} />;
    }
};
export default App;
