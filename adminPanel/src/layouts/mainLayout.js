// import external modules
import React, { PureComponent } from "react";
import classnames from "classnames";
import _EventEmitter from "../constants/emitter"

// import internal(own) modules
import {
  FoldedContentConsumer,
  FoldedContentProvider,
} from "../utility/context/toggleContentContext";
import Sidebar from "./components/sidebar/sidebar";
import Navbar from "./components/navbar/navbar";
import templateConfig from "../templateConfig";

class MainLayout extends PureComponent {
  state = {
    width: window.innerWidth,
    customizerState: false,
    sidebarState: "close",
    sidebarSize: "",
    layout: "",
  };

  updateWidth = () => {
    this.setState((prevState) => ({
      width: window.innerWidth,
    }));
  };

  handleSidebarSize = (sidebarSize) => {
    this.setState({ sidebarSize });
  };

  handleLayout = (layout) => {
    // this.setState({ layout });
  };

  componentDidMount() {
    if (window !== "undefined") {
      window.addEventListener("resize", this.updateWidth, false);
    }
  }

  componentWillUnmount() {
    if (window !== "undefined") {
      window.removeEventListener("resize", this.updateWidth, false);
    }
  }

  toggleSidebarMenu(sidebarState) {
    this.setState({ sidebarState });
  }

  toggleThemeCustomizer(customizerState) {
    this.setState({ customizerState });
    console.log("customizer", customizerState);
  }

  closeCustomizerMenu = () => {
    _EventEmitter.emit("CloseCustomizer", "")
  }
  render() {

    return (
      <FoldedContentProvider>
        <FoldedContentConsumer>
          {(context) => (
            <div
              className={classnames("wrapper ", {
                "menu-collapsed":
                  context.foldedContent || this.state.width < 991,
                "main-layout": !context.foldedContent,
                [`${templateConfig.sidebar.size}`]:
                  this.state.sidebarSize === "",
                [`${this.state.sidebarSize}`]: this.state.sidebarSize !== "",
                //    "layout-dark": (this.state.layout === 'layout-dark'),
                //    " layout-dark": (this.state.layout === '' && templateConfig.layoutDark === true)
                [`${templateConfig.layoutColor}`]: this.state.layout === "",
                [`${this.state.layout}`]: this.state.layout !== "",
              })}
            >
              <Sidebar
                toggleSidebarMenu={this.toggleSidebarMenu.bind(this)}
                sidebarState={this.state.sidebarState}
                handleSidebarSize={this.handleSidebarSize.bind(this)}
                handleLayout={this.handleLayout.bind(this)}
                toggleThemeCustomizer={this.toggleThemeCustomizer.bind(this)}
                customizerState={this.state.customizerState}
              />
              <Navbar
                toggleSidebarMenu={this.toggleSidebarMenu.bind(this)}
                sidebarState={this.state.sidebarState}
                toggleThemeCustomizer={this.toggleThemeCustomizer.bind(this)}
                customizerState={this.state.customizerState}
              />
              <main onClick={this.closeCustomizerMenu}>{this.props.children}</main>
            </div>
          )}
        </FoldedContentConsumer>
      </FoldedContentProvider>
    );
  }
}

export default MainLayout;
