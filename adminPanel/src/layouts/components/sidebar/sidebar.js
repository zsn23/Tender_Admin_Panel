import React, { Component, Fragment } from "react";
import classnames from "classnames";
import "../../../assets/scss/components/sidebar/sidebar.scss";
import SideMenuContent from "./sidemenu/sidemenu";
import SidebarHeader from "./sidebarHeader/sidebarHeader";
import { FoldedContentConsumer } from "../../../utility/context/toggleContentContext";
import templateConfig from "../../../templateConfig";
import Customizer from "../../../components/customizer/customizer";
import _EventEmitter from "./../../../constants/emitter"


class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsedSidebar: true,
      width: window.innerWidth,
      sidebarState: "close",

    };

    _EventEmitter.on("handleLeftSideBar", this.handleLeftSideBar)
  }


  updateWidth = () => {
    if (window.innerWidth <= 991) {
      this.setState({ collapsedSidebar: true });
    } else {
      this.setState({ collapsedSidebar: true });
    }
    this.setState((prevState) => ({
      width: window.innerWidth,
    }));
  };

  handleCollapsedSidebar = (collapsedSidebar) => {
    this.setState({ collapsedSidebar: collapsedSidebar });
  };

  componentDidMount() {
    if (window) {
      window.addEventListener("resize", this.updateWidth, false);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener("resize", this.updateWidth, false);
    }
  }
  handleMouseEnter = (e) => {
    this.setState((prevState) => ({
      collapsedSidebar: false,
    }));
  };

  handleMouseLeave = (e) => {
    this.setState((prevState) => ({
      collapsedSidebar: true,
    }));
  };

  handleLeftSideBar = () => {
    if (this.state.sidebarState == "open") {
      this.setState({ sidebarState: "close" })
    }
    else {
      this.setState({ sidebarState: "open" })
    }
    // this.setState((prevState) => ({
    //   collapsedSidebar: true,
    // }));
  }

  render() {
    return (
      <Fragment>
        <FoldedContentConsumer>
          {(context) => (
            <div
              data-active-color="white"
              data-background-color={
                this.props.color === ""
                  ? templateConfig.sidebar.backgroundColor
                  : this.props.color
              }
              className={classnames(
                "app-sidebar",
                {
                  "": !this.state.collapsedSidebar,
                  collapsed: this.state.collapsedSidebar,
                },
                {
                  "hide-sidebar":
                    this.state.width < 991 &&
                    this.state.sidebarState === "close",
                  "": this.state.sidebarState === "open",
                }
              )}
              onMouseEnter={context.foldedContent ? null : null}
              onMouseLeave={
                context.foldedContent ? this.handleMouseLeave : null
              }
            >
              <SidebarHeader
                toggleSidebarMenu={this.props.toggleSidebarMenu}
                sidebarBgColor={this.props.color}
              />
              <div className="sidebar-content">
                <SideMenuContent
                  collapsedSidebar={this.state.collapsedSidebar}
                  toggleSidebarMenu={this.props.toggleSidebarMenu}
                />
              </div>

              {/* {this.props.img === '' ? ( */}
              {templateConfig.sidebar.backgroundImage ? (
                this.props.imgurl === "" ? (
                  <div
                    className="sidebar-background"
                    style={{
                      backgroundImage:
                        "url('" +
                        templateConfig.sidebar.backgroundImageURL +
                        "')",
                    }}
                  ></div>
                ) : (
                  <div
                    className="sidebar-background"
                    style={{
                      backgroundImage: "url('" + this.props.imgurl + "')",
                    }}
                  ></div>
                )
              ) : this.props.imgurl === "" ? (
                <div className="sidebar-background"></div>
              ) : (
                <div
                  className="sidebar-background"
                  style={{
                    backgroundImage: "url('" + this.props.imgurl + "')",
                  }}
                ></div>
              )}
            </div>
          )}
        </FoldedContentConsumer>

        <Customizer
          sidebarBgColor={this.props.sidebarBgColor}
          sidebarImageUrl={this.props.sidebarImageUrl}
          sidebarCollapsed={this.props.sidebarCollapsed}
          handleSidebarSize={this.props.handleSidebarSize}
          handleLayout={this.props.handleLayout}
          handleCollapsedSidebar={this.handleCollapsedSidebar.bind(this)}
          toggleThemeCustomizer={this.props.toggleThemeCustomizer}
          customizer={this.props.customizerState}
        />
      </Fragment>
    );
  }
}

export default Sidebar;

