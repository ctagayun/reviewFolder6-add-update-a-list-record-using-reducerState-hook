import * as React from 'react';
import './App.css'

const AddItem = ({title, onChange, handleAddRecord}) => (

   <div>
     <input type="text" value={title} onChange={onChange} />
     <button type="button" className="btn btn-primary" onClick={handleAddRecord}>
        Add
    </button>

   </div>
 );


export default AddItem;

{/* <hr/>
       <div>
         <input type="text" value={title} onChange={handleChange} />
           <button type="button" className="btn btn-primary" onClick={handleAddRecord}>
             Add
           </button>
        </div> */}