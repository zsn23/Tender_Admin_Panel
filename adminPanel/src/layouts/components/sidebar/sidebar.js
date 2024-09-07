import React, { Component, Fragment } from "react";
import classnames from "classnames";
import "../../../assets/scss/components/sidebar/sidebar.scss";
import SideMenuContent from "./sidemenu/sidemenu";
import SidebarHeader from "./sidebarHeader/sidebarHeader";
import { FoldedContentConsumer } from "../../../utility/context/toggleContentContext";
import templateConfig from "../../../templateConfig";
import Customizer from "../../../components/customizer/customizer";
import _EventEmitter from "./../../../constants/emitter";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsedSidebar: true,
      width: window.innerWidth,
      sidebarState: "close",
      mouseEntered: false,
    };

    this.sidebarRef = React.createRef(); // Initialize a ref for the sidebar
    _EventEmitter.on("handleLeftSideBar", this.handleLeftSideBar);
  }

  updateWidth = () => {
    const newWidth = window.innerWidth;
    this.setState({
      width: newWidth,
      collapsedSidebar: newWidth >= 991,
    });

    // Close the sidebar if it's open when the screen size changes
    if (this.state.sidebarState === "open") {
      this.setState({ sidebarState: "close" });
    }
  };

  handleCollapsedSidebar = (collapsedSidebar) => {
    this.setState({ collapsedSidebar });
  };

  componentDidMount() {
    if (window) {
      window.addEventListener("resize", this.updateWidth, false);
      window.addEventListener("click", this.handleClickOutside, false);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener("resize", this.updateWidth, false);
      window.removeEventListener("click", this.handleClickOutside, false);
    }
  }

  handleMouseEnter = () => {
    // this.setState({ mouseEntered: true, collapsedSidebar: false });
    if (this.state.width >= 992) {
      this.setState({ mouseEntered: true, collapsedSidebar: false });
    }
  };

  handleMouseLeave = () => {
    // this.setState({ collapsedSidebar: true, mouseEntered: false });
    if (this.state.width >= 992) {
      this.setState({ collapsedSidebar: true, mouseEntered: false });
    }
  };

  handleIconClick = () => {
    this.setState({ mouseEntered: true }); // Ensure sidebar stays expanded on icon click
  };

  handleClickOutside = (event) => {
    if (
      this.sidebarRef.current &&
      !this.sidebarRef.current.contains(event.target)
      && this.state.width <= 992
    ) {
      this.setState({ collapsedSidebar: false, mouseEntered: true });
    }
    
  };

  handleLeftSideBar = () => {
    this.setState((prevState) => ({
      sidebarState: prevState.sidebarState === "open" ? "close" : "open",
    }));
  };

  handleMenuItemClick = () => {
    this.setState({ collapsedSidebar: false, mouseEntered: true });
  };

  handleSidebarItemClick = () => {
    // Close the sidebar when any item inside it is clicked
    if (this.state.width <= 991 && this.state.sidebarState === "open") {
      this.setState({ sidebarState: "close"});
    }
  };

  // Define the sidebarImageUrl method
  sidebarImageUrl = (imageUrl) => {
    this.setState({ sidebarBgImage: imageUrl });
  };
  handleCloseSidebar = () => {
    this.setState({ sidebarState: "close" ,collapsedSidebar: true, mouseEntered: false}); // Function to close the sidebar
  };
  render() {
    return (
      <Fragment>
        <FoldedContentConsumer>
          {(context) => (
            <div
              ref={this.sidebarRef}
              data-active-color="white"
              data-background-color={
                this.props.color === ""
                  ? templateConfig.sidebar.backgroundColor
                  : this.props.color
              }
              className={classnames(
                "app-sidebar",
                {
                  expanded: !this.state.collapsedSidebar,
                  collapsed: this.state.collapsedSidebar,
                },
                {
                  "hide-sidebar":
                    this.state.width < 991 &&
                    this.state.sidebarState === "close",
                  "": this.state.sidebarState === "open",
                }
              )}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.handleSidebarItemClick} // Added this event handler
            >
              <SidebarHeader
                toggleSidebarMenu={this.props.toggleSidebarMenu}
                sidebarBgColor={this.props.color}
                onIconClick={this.handleIconClick} // Pass down the click handler
              />
              <div className="sidebar-content">
              
                <button
                  className="close-sidebar-btn d-lg-none d-md-flex"
                  onClick={this.handleCloseSidebar}
                  style={{
                    position: "relative",
                    top: "0px",
                    left: "89%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                 ✕
                </button>
             
                <SideMenuContent
                  
                  collapsedSidebar={this.state.collapsedSidebar}
                  toggleSidebarMenu={this.props.toggleSidebarMenu}
                  onMenuItemClick={this.handleMenuItemClick} // Pass the click handler
                />
              </div>

              {templateConfig.sidebar.backgroundImage ? (
                <div
                  className="sidebar-background"
                  style={{
                    backgroundImage: this.props.imgurl
                      ? `url('${this.props.imgurl}')`
                      : `url('${templateConfig.sidebar.backgroundImageURL}')`,
                  }}
                ></div>
              ) : this.props.imgurl === "" ? (
                <div className="sidebar-background"></div>
              ) : (
                <div
                  className="sidebar-background"
                  style={{
                    backgroundImage: `url('${this.props.imgurl}')`,
                  }}
                ></div>
              )}
            </div>
          )}
        </FoldedContentConsumer>

        <Customizer
          sidebarBgColor={this.props.sidebarBgColor}
          sidebarImageUrl={this.sidebarImageUrl} // Pass the function here
          sidebarCollapsed={this.props.sidebarCollapsed}
          handleSidebarSize={this.props.handleSidebarSize}
          handleLayout={this.props.handleLayout}
          handleCollapsedSidebar={this.handleCollapsedSidebar}
          toggleThemeCustomizer={this.props.toggleThemeCustomizer}
          customizer={this.props.customizerState}
        />
      </Fragment>
    );
  }
}

export default Sidebar;
