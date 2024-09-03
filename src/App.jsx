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
     //WHIC IS TO ADD ITEM TO THE LIST
     case 'ADD_ITEM':
        console.log (`Adding Record.`)
        //the following was sent by this code below: updateInitialList({type: 'ADD_ITEM', title, objectID: uuidv4()}); 
        return state.concat({ name: action.title, id: action.objectID }); //RETURNS A NEW STATE

     case 'DELETE_RECORD':
        console.log (`Deleting Record. ${action.type}`)
        return state.filter((story) => item.objectID !== story.objectID);

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

  //Next make the list "initialList" stateful using reducer hook 
  //         "listReducer" is the reducer function
  //         "initialList" is the list which is used to initialize "updatedList" first time in
  //                
  const [updatedList, updateInitialList] = React.useReducer(listReducer, initialList );

  //Before we can add an item, we need to track the "input field's" state, 
  //because without the value from the input field, we don't have any text 
  //to give the item which we want to add to our list. So let's add some 
  //state management to this first:
  const [title, setTitle] = React.useState('');

  //Track changes to the input text box
  const handleChange = (event) => {
    console.log(`Value of title input field: ${event.target.value} `)
    setTitle(event.target.value);
 };

  //Function to handle add a record
  //Next, whenever someone clicks the Add button in renderListUsingArrowFunction.jsx , 
  //we can add the title entered into the input field as a new item to the list:


  const handleAddRecord = () => {
    console.log(`Item being Added: ${title}`);

    //updateInitialList is the reducer hook state updater. it dispatches 
    //the below message to the target reducerHook  function called "listReducer". See below
    //for the params to useReducer hook: 
    //   const [updatedList, updateInitialList] = React.useReducer(listReducer, initialList );
    
    //After this code is executed "updatedList" state will contain the added record
    updateInitialList({type: 'ADD_ITEM', title, objectID: uuidv4()}); 

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
    updateInitialList({type: 'DELETE_ITEM', title, objectID: uuidv4()}); 
  }

  const searchedList = updatedList.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); //update state hook variable in this case "searchTerm"
  }

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
       {/* <div>
         <input type="text" value={title} onChange={handleChange} />
           <button type="button" className="btn btn-primary" onClick={handleAddRecord}>
             Add
           </button>
        </div> */}

     <AddItem
        name={title}
        onChange={handleChange}
        handleAddRecord={handleAddRecord}
      />

       {/*We have made the input field "title" a controlled element, because 
         it receives its internal value from React's state now. */}
       <RenderListUsingArrowFunction list={searchedList} 
                             onRemoveItem={handleDeleteRecord}
                             title={title} />

    
        
    </div>
  )
}

export default App
