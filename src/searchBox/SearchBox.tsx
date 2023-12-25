import React from 'react'
import { FaSearch } from "react-icons/fa";
import './searchBox.css'
const SearchBox = () => {
  return (
    <div className='searchbox-container'>
        <input type="text" className="search-input"  placeholder='Search Movies'/>
        <FaSearch id="search-icon"/>
    </div>
  )
}

export default SearchBox