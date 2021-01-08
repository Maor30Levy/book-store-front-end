import {renderAddCommentButton} from './utils.js';
const result = document.getElementById('result');
const dataBase = JSON.parse(sessionStorage.getItem('dataBase'));
const isbn = sessionStorage.getItem('bookISBN');



const renderBook = ()=>{
    const bookObj = dataBase.filter((object)=>{
     return object.isbn===isbn;   
    })[0];
    document.title=bookObj.title;
    const imageDiv = document.getElementById('image');
    const image = document.createElement('img');
    image.src=bookObj.image; 
    imageDiv.appendChild(image);
    
    const titleDiv = document.getElementById('bookTitle');
    titleDiv.innerText=bookObj.title;

    const ratingDiv = document.getElementById('rating');
    ratingDiv.innerText=`Rating: ${bookObj.rating},  (2,776,289 ratings by Goodreads) `;

    const langDiv = document.getElementById('type-and-lang');
    langDiv.innerText=`Paperback | English`;
    
    const authorDiv = document.getElementById('author');
    authorDiv.innerText=`Written by: ${bookObj.author}`;

    const summaryDiv = document.getElementById('summary');
    const pElement = document.createElement('p');
    pElement.innerHTML = bookObj.summary;
    summaryDiv.appendChild(pElement);
    
    const formatDiv = document.getElementById('format');
    formatDiv.innerHTML=`<b>Format: </b>Paper, 365 pages`;
    
    const pubDateDiv = document.getElementById('publication-date');
    pubDateDiv.innerHTML=`<b>Publication Date: </b> 16 Oct 2014`;
    
    const publisherDiv = document.getElementById('publisher');
    publisherDiv.innerHTML=`<b>Publisher: </b>Bloomsbury Publishing PLC`;
    
    const pubLocationDiv = document.getElementById('publication-location');
    pubLocationDiv.innerHTML=`<b>Publication City/Country: </b>London, UK`;
    
    const languageDiv = document.getElementById('language');
    languageDiv.innerHTML=`<b>Language: </b>English`;
    
    const isbnDiv = document.getElementById('isbn');
    isbnDiv.innerHTML=`<b>ISBN: </b>${isbn}`;

    const commentsDiv = document.getElementById('comments');
    renderAddCommentButton(isbn);
    const comments = bookObj.comments;
    if(comments.length===0){
        commentsDiv.innerText='No comments has been added so far, be the first one to do so!';
    }else{
        for(let comment of comments){
            const commentElement = document.createElement('p');
            commentElement.innerText = comment;
            commentsDiv.appendChild(commentElement);
        }
    }

}


renderBook();



