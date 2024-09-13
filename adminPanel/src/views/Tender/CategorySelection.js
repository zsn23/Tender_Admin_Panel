

import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import { ChevronDown, Check } from 'react-feather'; // Using ChevronDown for dropdown icon
import 'bootstrap/dist/css/bootstrap.min.css';
import './Category.css'; // Import your custom styles here


export default function CustomizedHook(props) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // For the search term
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((val) => val !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelectedValues);
    props.getSelectedItems(newSelectedValues);
  };

  const handleToggle = () => setShowDropdown((prev) => !prev);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter categories based on the search term and check for valid option.name
  const filteredCategories = props.CategoryDetails?.filter((option) => {
    return option?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div ref={dropdownRef} className="custom-container">
      <InputGroup className="custom-input-group">
        <FormControl
          placeholder="Select Category" // Updated placeholder text
          readOnly
          value={selectedValues.map((val) => val.name || 'Unnamed').join(', ')}
          onClick={handleToggle}
          className="custom-form-control"
        />
        <span className="custom-toggle" onClick={handleToggle}>
          <ChevronDown size={20} />
        </span>
        <Dropdown show={showDropdown} className="custom-dropdown">
          <Dropdown.Menu className="custom-dropdown-menu">
            {/* Search bar inside dropdown */}
            <div>
              <FormControl
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="custom-search-bar"
              />
            </div>
            {filteredCategories && filteredCategories.length > 0 ? (
              filteredCategories.map((option) => (
                <Dropdown.Item
                  key={option.id || option.name || Math.random()} // Ensuring unique key
                  active={selectedValues.includes(option)}
                  onClick={() => handleSelect(option)}
                  className="custom-dropdown-item "
                  style={{width:"760px"}}
                >
                  {option.name || 'Unnamed'}
                  {selectedValues.includes(option) && (
                    <Check color="green" size={16} className="ms-2" />
                  )}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No Categories Available</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </InputGroup>
    </div>
  );
}
