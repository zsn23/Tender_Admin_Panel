
import React, { Component } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { XCircle } from "react-feather";
import { FoldedContentConsumer } from "../../utility/context/toggleContentContext";
import _EventEmitter from "../../constants/emitter";
import PerfectScrollbar from "react-perfect-scrollbar";
import Cookies from "universal-cookie";

const circleStyle = {
  width: "20px",
  height: "20px",
};

const cookies = new Cookies();

class Customizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customizer: false,
      selectedLayout: false,
    };

    this.customizerState = this.customizerState.bind(this);

    _EventEmitter.on("CloseCustomizer", this.closeCustomizer);
    _EventEmitter.on("handleCustomizer", this.handleCustomizer);
  }

  componentDidMount() {
    let layoutMode = cookies.get("LayoutMode");

    if (layoutMode?.toString() === "layout-dark") {
      this.setState({ selectedLayout: true });
    }
  }

  customizerState = (nextProps) => {
    this.setState({
      customizer: nextProps.customizer,
    });
  };

  handleCustomizer = () => {
    this.setState({
      customizer: !this.state.customizer,
    });
  };

  closeCustomizer = () => {
    this.setState({
      customizer: false,
    });
  };

  isThemeOpen = () => {
    const customizerVal = !this.state.customizer;
    this.setState({
      customizer: customizerVal,
    });
    this.props.toggleThemeCustomizer(customizerVal);
  };

  handleSizeChange = (size) => {
    this.props.handleSidebarSize(size);
  };

  handleLayout = (checked, layout) => {
    this.setState({ selectedLayout: checked });
    this.persistLayout(layout);
    this.props.handleLayout(layout);
  };

  persistLayout = (value) => {
    cookies.set("LayoutMode", value);
    _EventEmitter.emit("changeLayout", value);
  };

  handleSidebarChange = (state) => {
    this.props.handleCollapsedSidebar(state);
  };

  render() {
    // Ensure customizer does not automatically open on small screens
    const customizerClass = `customizer border-left-blue-grey border-left-lighten-4 ${
      this.state.customizer ? "open" : ""
    }`;

    return (
      <FoldedContentConsumer>
        {(context) => (
          <div className={customizerClass}>
            <span
              className="customizer-toggle"
              id="customizer-toggle-icon"
              onClick={this.isThemeOpen}
            >
              <XCircle size={18} />
            </span>
            <PerfectScrollbar>
              <div className="customizer-content mt-5">
                <h4 className=" mb-0 text-bold-400 text-center ">
                  Dark Theme Customizer
                </h4>
                <hr className="my-3" />

                <div>
                  <Form>
                    <div className="togglebutton">
                      <FormGroup check>
                        <Label check>
                          <Input
                            value={this.state.selectedLayout}
                            checked={this.state.selectedLayout}
                            type="checkbox"
                            id="cz-bg-image-display"
                            onChange={(e) => {
                              this.handleLayout(e.target.checked, e.target.checked ? "layout-dark" : "layout-light");
                            }}
                          />
                          Layout dark
                        </Label>
                      </FormGroup>
                    </div>

                    <hr className="my-3" />

                    <div></div>
                  </Form>
                </div>
              </div>
            </PerfectScrollbar>
          </div>
        )}
      </FoldedContentConsumer>
    );
  }
}

export default Customizer;

