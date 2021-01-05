import {initMainPage,getDataFromDataBase ,initFormQuery,renderAddCommentButton,serverURL,initDataBase}  from './utils.js' ;

let cart;
if(sessionStorage.getItem('cart')){
    cart = JSON.parse(sessionStorage.getItem('cart'));
}else{
    cart = [];  
}



const form = document.getElementById('search-form');
const inputList = form.querySelectorAll('input');
const resultBox = document.getElementById('result-box');
const shoppingCart = document.getElementById('shopping-cart');

const editCostumerCart = async ()=>{
    if(sessionStorage.getItem('token')){
        try{
            await fetch(`${serverURL}/costumer/edit`,{
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cart: sessionStorage.getItem('cart')})
            });
        }catch(err){
            console.log(err.message)
        }
    }
       
};

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
            sessionStorage.setItem('cart',JSON.stringify(cart));
            await editCostumerCart();
            getDataFromDataBase(resultBox, query,renderButtons);
        });  

    }else{
        label = 'Add to cart';
        cartButtonElement.addEventListener('click', async (event)=>{
            cart.push(isbn);
            sessionStorage.setItem('cart',JSON.stringify(cart));
            await editCostumerCart();
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



shoppingCart.addEventListener('click', ()=>{
    if(cart.length>0){
        sessionStorage.setItem('cart',JSON.stringify(cart));
        location.href='/cart';   
    }else{
        alert('Your cart is emptey!');
    }
});



initMainPage(resultBox,renderButtons);
if(sessionStorage.getItem('adminPassword')){
    location.href='/admin';
}
