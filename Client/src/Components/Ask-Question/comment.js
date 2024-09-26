import React, {useState,useEffect} from 'react'
import axios from 'axios'
import Select from 'react-select';

const Comment = () => {

  const options = [
    { name: "nitin", id: '1' },
    { name: "chhavi", id: '2' },
    { name: "Pawan", id: '3' },
    { name: "Lakshay", id: '4' },
    { name: "Anjali", id: '5' }
  ];

  //get selected values ni dari DB.
  const values = ['1', '2','5'];

  return (
    <div>     
      <div className='input-field'>
        <p>Select Intrested Subjects</p>
        <Select
                  placeholder="Select Institute"
                  isMulti
                  defaultValue={options.filter((data) => values.includes(data.id))}
                  onChange={(value) => console.log(value)}
                  getOptionLabel={option => {
                    return option.name;
                  }}
                  getOptionValue={option => {
                    return option.id;
                  }}
                  options={options}
                  className='ss-select-input'
                />
        </div>
    </div>


  )
}

export default Comment