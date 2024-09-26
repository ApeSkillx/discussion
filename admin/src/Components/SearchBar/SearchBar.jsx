import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';

function SearchBar(props){
  return(
    <div className='search-bar'>
      {/* It can be made as a form by uncommenting the following lines */}
      {/* <form action="/search-question" method="post" className='search-form'> */}
        <input name="searchItem" id="searchItem" className="search-input" placeholder={props.placeholder} value={props.value} onChange={props.onChange}></input>
        {/* <button type="submit"> */}
          {/* <SearchIcon className='search-icon'/> */}
        {/* </button> */}
      {/* </form> */}
    </div>
  )
}

export default SearchBar;