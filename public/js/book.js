import {renderResults,renderAddCommentButton,addSubQuery} from './utils.js';
const result = document.getElementById('result');
const dataBase = JSON.parse(sessionStorage.getItem('dataBase'));
const isbn = sessionStorage.getItem('bookISBN');
const renderButtons=()=>{
    renderAddCommentButton();
    const returnButton = document.createElement('button');
    returnButton.innerText='Return to Store';
    returnButton.addEventListener('click',()=>{
        location.href='/';
    });
    document.querySelector('#result').firstChild.appendChild(returnButton);
};
const renderBook = ()=>{
    const bookObj = dataBase.filter((object)=>{
     return object.isbn===isbn;   
    });
    renderResults(result,bookObj,{isbn},renderButtons);
}

renderBook();



