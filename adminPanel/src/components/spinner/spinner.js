import React from 'react';
import { ClipLoader } from 'react-spinners';
import logo from "./logo.png";
import blackLogo from "./blackLogo.png";

import "./spinner.css"


class SpinnerComponent extends React.Component {
	state = {
		loading: true
	};
	render() {
		return (
			<div className="loader">  <img src={blackLogo} height="30px" alt="Loading.." className="spinner-img" />
			</div>

		)
	}
}

export default SpinnerComponent;