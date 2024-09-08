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



///React Advance State Reducer Hook
// see: https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext/

//How to useReducer in React: https://www.robinwieruch.de/react-usereducer-hook/

//useReducer is best to use if multiple states are dependent on each other.
//For stories, boolean is Loading, and error are all related to data fetching. 
//All three properties/state could be a part of one complex object (example data, isLoading, error)
//managed by a reducer

//Again the first thing to do when using React.useReducer hook
//is to define a reducer FUNCTION outside of the component.
//A reducer function always receives a state and an action. 
//Based on these two arguments, returns a new state.

//A reducer function always receives a state and an action (A). 
//Based on these two arguments, a reducer always returns a new state:
//  1. 'action' is always associated with a type (B) and payload (B)
//  2. If the type matches a condition in the reducer (B), return a new state (C) 
//    based on incoming state and action.


//In the following example: 
//The listReducer function covers "one type" and then returns the 
//payload of the incoming action without using the current state to 
//compute the new state. The new state is therefore simply the payload.

//Define a reducer function. It always receives state and action
//   1.'action' is always associated with a type. In this example
//     there are 2 types: 'ADD_ITEM' and 'DELETE_ITEM' 
//     each type returns appropriate action.payload.
//
//   2. If the type matches a condition  in this case 'ADD_ITEM' 
//      and 'DELETE_ITEM' the reducer return a new state based on 
//       incoming state and action.
//   3. Based on these two arguments the reducer always returns 
//     a new state

//FYI: the "action" was passed in with the property: payload: with value "item"
const listReducer = (state, action) =>{
   switch (action.type) { //(A)
     //based on the action type implement the business logic
     case 'ADD_ITEM':
        //the action in this use case was passed the properties: 
        //     "title" and property called objectID with a value of uuidv4()
        return state.concat({ title: action.title, objectID: action.objectID }); //return a new state
    
        case 'DELETE_ITEM':
        //FYI: the "action" that  was passed in has a property: payload: with value "item"
        console.log (`Delete  Action Type in the reducer is = ${action.type}`)
        console.log (`Item to be deleted by the reducer is ${action.payload.objectID}`)

        //Return a new state but filter the state first. In this case objectID. 
        //Filter generates a new array from the 'state' an call it "story"
        return state.filter(   //return a new state (C)
           (story) => action.payload.objectID !== story.objectID  
          );

     default:
        console.log(`Unhandled TYPE: ${action.type}`);
        throw new Error(); 
   }

};

 //Create a custom hook called "useStorageState". We will use two hooks 
  //to create it:
  //    1. useState
  //    2. useEffect 

  //The purpose of this custom hook is to save and fetch from the localtorage
  //the values that were inputted in the search box.
  //The actual return value of our custom hook will be displayed in the 
  //search box.

  const useStorageState = (searchKeyParam, deafaultStateParam) => {
    const [theState, stateSetter] = React.useState(
       localStorage.getItem(searchKeyParam) || deafaultStateParam //provides an initial value to the hook.
    );

    //https://react.dev/reference/react/useEffect#useeffect
    //Since the key comes from outside, the custom hook assumes that it could change,
    //so it needs to be included in the dependency array of the useEffect hook as well.
    React.useEffect(() => {
        localStorage.setItem(searchKeyParam, theState);
       },
       [theState, stateSetter] );

    //Custom hooks return values are returned as an array
    return [theState, stateSetter]; 

 } //EOF create custom hook


//Declaration of App component
function App() {

  const welcome = {
     greeting: 'Demo',
     title: "Add Item To List",
  };
  
  let searchKey= 'search';
  let defaultState = 'React'

  
  //now call our custom hook useLocalStorage to initialize our state 
  //called "searchTerm". The actual return value of our custom hook is:
  //return [theState, stateSetter]. But we can rename it. In this case
  //searchTerm, setSearchTerm respectively
  const [searchTerm, setSearchTerm] = useStorageState(searchKey, defaultState)
  
  //This hook returns as an array :
  //     1. a state in this case "listData"
  //     2. a dispatch function in this case "dispatchListData" 
  //which we conveniently access again via array destructuring. 
  // The parameters in this case are:
  //     "listReducer" is the reducer function
  //     "initialList" is the list which is used to initialize "updatedList" first time in
  //                
  const [updatedList, dispatchListData] = React.useReducer(listReducer, initialList );

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
    //The action in this use case was passed the following values and propeties:
    //        "title" 
    //        "objectID" with a value of uuidv4()
    dispatchListData({type: 'ADD_ITEM', title, objectID: uuidv4()}); 
    setTitle('');  //reset the input box to null
  };

 
  const handleDeleteRecord = (item) => {
    console.log(`Item being deleted =  ${item.objectID} ${item.title}`);
    //Note: The "action" is being passed a property called "payload" with a value of "item"
    dispatchListData({type: 'DELETE_ITEM', payload: item,}); 
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); //update state hook variable in this case "searchTerm"
  }
 
  const searchedList = updatedList.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
       <h1> 
          {welcome.greeting} {welcome.title}
      </h1>
    
      {/* searchTerm is the return value from useStorageState custom hook. */}
      <Search id="search" value={searchTerm}  isFocused  onInputChange={handleSearch} >
         <strong>Search:</strong>
      </Search>

       <hr/>
     <AddItem
        name={title}
        onChange={handleChange}
        onAdd={handleAdd}
      />

       {/*We have made the input field "title" a controlled element, because 
         it receives its internal value from React's state now. */}
       <RenderListUsingArrowFunction list={searchedList} 
                                     onRemoveItem={handleDeleteRecord} />
        
    </div>
  )
}

export default App
