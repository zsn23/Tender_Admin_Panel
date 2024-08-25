import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ToggleLeft, ToggleRight, X } from "react-feather";
import { FoldedContentConsumer } from "../../../../utility/context/toggleContentContext";
import imgSrc from "../../../../assets/img/logos/my_logo.png";


class SidebarHeader extends Component {
  handleClick = (e) => {
    this.props.toggleSidebarMenu("close");
  };

  render() {
    return (
      <FoldedContentConsumer>
        {(context) => (
          <div className="sidebar-header">
            <div className="logo clearfix">
              <NavLink to="/dashboard" className="logo-text float-left">
                <img src={imgSrc} alt="" />
              </NavLink>

              <span className="nav-toggle d-none d-sm-none d-md-none">
                {context.foldedContent ? (
                  <ToggleLeft
                    onClick={context.makeNormalContent}
                    className="toggle-icon"
                    size={16}
                  />
                ) : (
                  <ToggleRight
                    onClick={context.makeFullContent}
                    className="toggle-icon"
                    size={16}
                  />
                )}
              </span>
              <span
                href=""
                className="nav-close d-block d-md-block d-lg-none d-xl-none"
                id="sidebarClose"
              >
                <X onClick={this.handleClick} size={20} />
              </span>
            </div>
          </div>
        )}
      </FoldedContentConsumer>
    );
  }
}

export default SidebarHeader;
