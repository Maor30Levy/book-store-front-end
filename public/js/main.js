import {getDataFromDataBase ,initFormQuery,renderAddCommentButton,serverURL}  from './utils.js' ;

let cart;
if(sessionStorage.getItem('cart')){
    cart = JSON.parse(sessionStorage.getItem('cart'));
}else{
    cart = [];  
}



const form = document.getElementById('search-form');
const inputList = form.querySelectorAll('input');
const resultBox = document.getElementById('result-box');
const loginForm = document.getElementById('login-form');
const shoppingCart = document.getElementById('shopping-cart');

const cartButton = (isbn,query)=>{
    const cartButtonElement = document.createElement('button');
    const cartIconHTML = '<i class="fa fa-shopping-cart"></i>'; 
    let label ='';
    if(cart.includes(isbn)){
        label = 'Remove from cart';
        cartButtonElement.style='background: red';
        cartButtonElement.addEventListener('click', async (event)=>{
            cart = cart.filter((cell)=>{
                return cell!==isbn;
            });
            getDataFromDataBase(resultBox, query,renderButtons);
        });  

    }else{
        label = 'Add to cart';
        cartButtonElement.addEventListener('click', async (event)=>{
            cart.push(isbn);
            getDataFromDataBase(resultBox, query,renderButtons);
        });  
    }
    cartButtonElement.innerHTML=`${label}${cartIconHTML}`;

    return cartButtonElement;
};

const renderCartButton = (query)=>{
    const buttons = document.querySelectorAll('#buttons');
    for(let button of buttons){
        button.appendChild(cartButton(button.parentElement.id,query));
    }
};

const renderButtons = (query)=>{
    renderCartButton(query);
    renderAddCommentButton();
};

const searchBook = ()=>{
    const query = initFormQuery(form);
    getDataFromDataBase(resultBox,query,renderButtons);
    resultBox.className = "result-box";
}

for(let input of inputList){
    input.addEventListener('keyup',()=>{
        searchBook();
    });
    input.addEventListener('blur',()=>{
        searchBook();
    });
}

form.addEventListener('submit',async (event)=>{
    event.preventDefault();
    searchBook();
    for(let input of inputList){
        input.value='';
    }
});

loginForm.addEventListener('submit',async (event)=>{
    event.preventDefault();
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    try{
        const result = await fetch(`${serverURL}/user/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: username.value,
                password: password.value
            })
            });
        if(result.ok){
                const token = await result.json();
                sessionStorage.setItem('token', token.token);
                sessionStorage.setItem('adminPassword', password.value);
                location.href ='/admin';
        }
    }catch(err){
        console.log(err.message)
    }  
});

shoppingCart.addEventListener('click', ()=>{
    if(cart.length>0){
        sessionStorage.setItem('cart',JSON.stringify(cart));
        location.href='/cart';   
    }else{
        alert('Your cart is emptey!');
    }
});