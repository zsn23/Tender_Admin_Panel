// import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
// import { ToggleLeft, ToggleRight, X } from "react-feather";
// import { FoldedContentConsumer } from "../../../../utility/context/toggleContentContext";
// import imgSrc from "../../../../assets/img/logos/my_logo.png";


// class SidebarHeader extends Component {
//   handleClick = (e) => {
//     this.props.toggleSidebarMenu("close");
//   };

//   render() {
//     return (
//       <FoldedContentConsumer>
//         {(context) => (
//           <div className="sidebar-header">
//             <div className="logo clearfix">
//               <NavLink to="/dashboard" className="logo-text ">
//                 <img src={imgSrc} alt="logo" />
//               </NavLink>

//               <span className="nav-toggle d-none d-sm-none d-md-none m-0 p-0">
//                 {context.foldedContent ? (
//                   <ToggleLeft
//                     onClick={context.makeNormalContent}
//                     className="toggle-icon"
//                     size={16}
//                   />
//                 ) : (
//                   <ToggleRight
//                     onClick={context.makeFullContent}
//                     className="toggle-icon"
//                     size={16}
//                   />
//                 )}
//               </span>

//             </div>
//           </div>
//         )}
//       </FoldedContentConsumer>
//     );
//   }
// }

// export default SidebarHeader;
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ToggleLeft, ToggleRight } from "react-feather";
import { FoldedContentConsumer } from "../../../../utility/context/toggleContentContext";
import imgSrc from "../../../../assets/img/logos/my_logo.png";
import './sidebarheader.css'

class SidebarHeader extends Component {
  handleClick = (e) => {
    this.props.toggleSidebarMenu("close");
  };

  render() {
    return (
      <FoldedContentConsumer>
        {(context) => (
          <div className="sidebar-header____ d-flex align-items-center justify-content-between ">
            <NavLink to="/dashboard" className="logo-container_______">
              <img
                src={imgSrc}
                alt="logo"
                className="sidebar-logo_____"
                style={{ width: "120px", height: "auto" }} // Adjust width and height as needed
              />
            </NavLink>

            <span className="nav-toggle d-none d-sm-none d-md-none m-0 p-0">
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
          </div>
        )}
      </FoldedContentConsumer>
    );
  }
}

export default SidebarHeader;
