import {renderResults,renderAddCommentButton} from './utils.js';
const result = document.getElementById('result');

const dataBase = JSON.parse(sessionStorage.getItem('dataBase'));
const isbn = sessionStorage.getItem('bookISBN');
const renderBook = ()=>{
    const bookObj = dataBase.filter((object)=>{
     return object.isbn===isbn;   
    });
    renderResults(result,bookObj,{isbn},renderAddCommentButton);
    console.log(bookObj)
}

renderBook();

