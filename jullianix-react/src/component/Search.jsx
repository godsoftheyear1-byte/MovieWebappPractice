import React from "react";

const Search = ({ SearchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.png" alt="search icon" /> 
        <input 
         type="text" 
         value={SearchTerm} 
         onChange={(e) => setSearchTerm(e.target.value)} 
         placeholder="Search for a movie..."
        />
      </div>
    </div>
  )
}

export default Search;