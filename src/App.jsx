/*
  Task:
    Incorporate bootstrap 

  Setup: 
    npm install bootstrap
    Once the installation is complete, we can include it in our app’s 
    entry file in main.jsx :
    --  Bootstrap CSS
    import "bootstrap/dist/css/bootstrap.min.css";
    -- Bootstrap Bundle JS
    import "bootstrap/dist/js/bootstrap.bundle.min";

    Now since we created the project with Vite, we can rely 
    on Vite's plugins to integrate ESLint properly. Run the 
    following command
       npm install vite-plugin-eslint --save-dev

    install uuid node package 
       npm install uuid
       
    */

import * as React from 'react';
import Search from './search.jsx';
import './App.css'
import { v4 as uuidv4 } from 'uuid';
import AddItem from './addItem.jsx'
import RenderListUsingArrowFunction from "./renderListUsingArrowFunction.jsx";


const initialList = [
  {
    title: 'React',
    objectID: 0,
  },
  {
    title: 'Redux',
    objectID: 1,
  },
];

//reducerHook is best to use if multiple states are dependent on each other.
//For stories, boolean is Loading, and error are all related to data fetching. 
//All three properties/state could be a part of one complex object (example data, isLoading, error)
//managed by a reducer

//Again the first thing to do when using React.useReducer hook
//is to define a reducer FUNCTION outside of the component.
//A reducer function always receives a state and an action. 
//Based on these two arguments, returns a new state.

const listReducer = (state, action) =>{
   switch (action.type) {
     //based on the action type implement the business logic
     case 'ADD_ITEM':
        console.log (`Adding Record. ${action.title} ${action.objectID}`)
        return state.concat({ title: action.title, id: action.objectID }); //return a new state
     case 'DELETE_ITEM':
        console.log (`Delete  Action Type is = ${action.type}`)
        console.log (`Deleting Record = ${action.type}`)
        return state.filter((item) => item.objectID !== item.objectID); //return a new state

     default:
        console.log(`Unhandled TYPE: ${action.type}`);
        throw new Error(); 
   }

};


//Declaration of App component
function App() {

  const welcome = {
     greeting: 'Demo',
     title: "Add Item To List",
  };
  
  let searchKey= 'search';
  let defaultState = 'React'

  
  //Next make the list "initialList" stateful using reducer hook 
  //         "listReducer" is the reducer function
  //         "initialList" is the list which is used to initialize "listData" first time in
  //                
  const [listData, dispatchListData] = React.useReducer(listReducer, initialList );

  //Create a state for the field that will be used to input the new item
  const [title, setTitle] = React.useState('');

  //Track changes to the add input text box
  const handleChange = (event) => {
    console.log(`Value of title input field: ${event.target.value} `)
    setTitle(event.target.value);
   };

  const handleAdd = () => {
    console.log(`Item being Added: ${title}`);

    //After the below  code is executed "listData" state will contain the added record
    dispatchListData({type: 'ADD_ITEM', title, objectID: uuidv4()}); 
    setTitle('');  //reset the input box to null
  };

  //Function to delete a a record from the initialList list
  // const handleDeleteRecord = (item) => {
  //   console.log(`Item being deleted =  ${item.objectID} ${item.author}`);
  //   const newList = updatedList.filter(
  //     (story) => item.objectID !== story.objectID
  //   );
  //   updateInitialList(newList);
  // };

  const handleDeleteRecord = (item) => {
    console.log(`Item being deleted =  ${item.objectID} ${item.author}`);
    dispatchListData({type: 'DELETE_ITEM', title, objectID: uuidv4()}); 
  }

 
  return (
    <div>
       <h1> 
          {welcome.greeting} {welcome.title}
      </h1>
    
       <hr/>

     <AddItem
        name={title}
        onChange={handleChange}
        onAdd={handleAdd}
      />

       {/*We have made the input field "title" a controlled element, because 
         it receives its internal value from React's state now. */}
       <RenderListUsingArrowFunction list={listData} 
                                     onRemoveItem={handleDeleteRecord} />
        
    </div>
  )
}

export default App
