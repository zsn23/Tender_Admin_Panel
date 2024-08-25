import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import helpers from "../../helpers/helpers";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    suggestions: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      // userInput: this.props.searchInput,
      userInput: "",
      autoSuggestions: [],
      activeTab: "",
      inputVal: "",
      clearSearch: this.props.clearSearch,
    };
  }

  changeClearSearch = (e) => {
    const userInput = e.currentTarget.value;

    console.log("userInput 38", userInput);
    if (this.props.searchField == "invoicenumber") {
      this.props.invoiceno(userInput);
    } else if (this.props.searchField == "customer") {
      this.props.customersearch(userInput);
    } else if (this.props.searchField == "interface") {
      this.props.interfacesearch(userInput);
    } else if (this.props.searchField == "title") {
      // roles title
      this.props.rolesearch(userInput);
    } else if (this.props.searchField == "name") {
      // companies name
      this.props.companysearch(userInput);
    } else if (this.props.searchField == "firstname") {
      // accounts firstname
      this.props.usersearch(userInput);
    }
  };

  onChange = (e) => {
    const userInput = e.currentTarget.value;

    console.log("userInput 50", userInput);
    const suggestions = [];

    this.setState({
      activeSuggestion: 0,
      suggestions,
      showSuggestions: false,
      userInput: userInput,
    });
  };

  getSugggestions = (e) => {
    const userInput = e.currentTarget.value;

    console.log("userInput 88", userInput);
    const suggestions = [];

    // if (userInput.length > 3) {
    helpers
      .getAutoComplete(
        this.props.baseurl,
        this.props.searchField,
        this.props.searchFrom,
        userInput,
        this.props.activeTab
      )
      .then((searchinput) => {
        console.log("searchinput result ", searchinput);

        if (searchinput != 0) {
          searchinput.map((search, i) => {
            console.log("index", i);
            console.log("search", search);
            if (this.props.searchField == "invoicenumber") {
              const { id, invoicenumber } = search;
              suggestions[id] = invoicenumber;
            } else if (this.props.searchField == "customer") {
              const { id, customer } = search;
              suggestions[id] = customer;
            } else if (this.props.searchField == "interface") {
              const { id, systeminterface } = search;
              suggestions[id] = systeminterface;
            } else if (this.props.searchField == "title") {
              const { id, title } = search;
              suggestions[id] = title;
            } else if (this.props.searchField == "name") {
              const { id, name } = search;
              suggestions[id] = name;
            } else if (this.props.searchField == "firstname") {
              const { id, firstname } = search;
              suggestions[id] = firstname;
            }
            console.log("suggestions", suggestions);
          });
        }

        // Filter our suggestions that don't contain the user's input
        const filteredSuggestions = suggestions;

        this.setState({
          activeSuggestion: 0,
          filteredSuggestions,
          showSuggestions: true,
          userInput: userInput,
        });
      });
    // } else {
    //   this.setState({
    //     activeSuggestion: 0,
    //     suggestions,
    //     showSuggestions: false,
    //     userInput: userInput,
    //   });
    // }
  };

  onClick = (e, index) => {
    console.log("e.currentTarget", e.currentTarget);
    console.log("e.currentTarget index", index);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });

    if (this.props.searchField == "invoicenumber") {
      this.props.invoiceno(index);
    } else if (this.props.searchField == "customer") {
      console.log("141");
      this.props.customersearch(index);
    } else if (this.props.searchField == "interface") {
      console.log("144");
      this.props.interfacesearch(index);
    } else if (this.props.searchField == "title") {
      console.log("147");
      this.props.rolesearch(index);
    } else if (this.props.searchField == "name") {
      console.log("150");
      this.props.companysearch(index);
    } else if (this.props.searchField == "firstname") {
      console.log("158");
      this.props.usersearch(index);
    }
  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    console.log("keyCode", e.keyCode);
    console.log("onKeyDown");

    this.setState({ clearSearch: false });

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
      console.log("keyCode", e.keyCode);
      console.log("User pressed the enter key");
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
      console.log("keyCode", e.keyCode);
      console.log("User pressed the up arrow");
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      this.getSugggestions(e);
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      // if (this.props.searchField == "invoicenumber") {
      //   this.props.invoiceno(e.currentTarget.innerText);
      // } else if (this.props.searchField == "customer") {
      //   this.props.customersearch(e.currentTarget.innerText);
      // }

      // this.setState({ activeSuggestion: activeSuggestion + 1 });
      // console.log("keyCode", e.keyCode);
      // console.log("User pressed the down arrow");
    }
  };

  updateUserInput() {
    this.setState({ userInput: "" });
    console.log("updateUserInput");
  }

  render() {
    const {
      changeClearSearch,
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;
              console.log("index", index);

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={index}
                  onClick={(e) => onClick(e, index)}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    if (userInput && this.props.clearSearch == true) {
      console.log("updateUserInput");
      this.updateUserInput();
    }

    return (
      <Fragment>
        <input
          type="text"
          id={this.props.searchFrom}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onClick={changeClearSearch}
          value={userInput}
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
