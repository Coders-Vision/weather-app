import React, { useState, useRef, useEffect } from "react";
import "../style/auto-suggest.css";

const AutoSuggestField = ({ data, getCity }) => {
  /*Variable Declartion */
  const [Suggestions, setSuggestions] = useState([]);
  const [Search, setSearch] = useState("");
  const [KeyUpDownCounter, setKeyUpDownCounter] = useState(0);
  const ListRef = useRef([]);
  const List = useRef();

  /*Passing prop data to custom useRef 'ListRef' array and intializing current object to null */
  useEffect(() => {
    //Add or access property if any.
    data.forEach((val) => (ListRef.current[val.name] = { current: null }));
  }, [data]);

  /* Intially the List will be hidden */
  useEffect(() => {
    if (KeyUpDownCounter <= 0) List.current.style.display = "none"; //References the 'ul' element on DOM
  }, [KeyUpDownCounter]);

  /* Function fires when there is a change in 'input' field */
  const handleOnTextChange = (e) => {
    const value = e.target.value;
    let suggestion = [];
    if (value.length > 2) {
      List.current.style.display = "block";
      const regex = new RegExp(`${value}`, "i");
      suggestion = data.sort().filter((val) => regex.test(val.name));
    }
    setSuggestions(suggestion);
    setSearch(value);
  };

  /* Setting search value to input field , resetting 'KeyUpDownCounter' and 'Suggestions' states */
  const suggestionSelected = (city) => {
    setSearch(city.name); //Set Name property to inputfield
    let sendData = {
      id: city.id,
    };
    getCity(sendData);
    setKeyUpDownCounter(0);
    List.current.style.display = "none";
    setSuggestions([]);
  };

  /* Handle 'Up' and 'Down Arrow keys for Navigating the List*/
  const handleKeyNavigation = (e) => {
    if (e.keyCode === 38 && KeyUpDownCounter > 0) {
      setKeyUpDownCounter((preCounter) => preCounter - 1);
      //Add or access property if any.
      ListRef.current[
        Suggestions[KeyUpDownCounter - 1].name
      ].current.scrollIntoView({
        behavior: "smooth",
      });
    } else if (e.keyCode === 40 && KeyUpDownCounter < Suggestions.length - 1) {
      //Add or access property if any.
      ListRef.current[
        Suggestions[KeyUpDownCounter].name
      ].current.scrollIntoView({
        behavior: "smooth",
      });

      setKeyUpDownCounter((preCounter) => preCounter + 1);
    } else if (e.keyCode === 8) {
      List.current.style.display = "none";
    }
    if (e.keyCode === 13) {
      suggestionSelected(Suggestions[KeyUpDownCounter]); //Add or access property if any.
    }
  };

  /* Render List to DOM */
  const renderSuggestions = () => {
    if (Suggestions.length === 0) {
      return null;
    }
    return Suggestions.map((val, index) => (
      <li
        ref={ListRef.current[val.name]}
        className={("place", KeyUpDownCounter === index ? " active" : null)}
        onClick={() => suggestionSelected(val)} //Add or access property if any.
        key={index}
      >
        <div className="capital">
          {val.name} ,<strong>{val.country}</strong>
        </div>
      </li>
    ));
  };
  return (
    <div className="auto-suggest-container">
      <div className="auto-suggest">
        <input
          value={Search}
          type="text"
          placeholder="Enter a City"
          onChange={handleOnTextChange}
          onKeyDown={handleKeyNavigation}
        />
        <svg className="search-icon" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
        <ul ref={List}>{renderSuggestions()}</ul>
      </div>
    </div>
  );
};

export default AutoSuggestField;
