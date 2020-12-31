import {serverURL} from './utils.js';
const dataBase = JSON.parse(sessionStorage.getItem('dataBase'));
const resultBox = document.getElementById('result')
const cancelButton = document.getElementById('cancel')

let cart = JSON.parse(sessionStorage.getItem('cart'));
const renderCart =  ()=>{
    while(resultBox.firstChild){
        resultBox.removeChild(resultBox.lastChild);
    }
    for(let book of cart){
        const divElement = document.createElement('div');
        divElement.className = 'cart__book';

            const object = dataBase.filter((object)=>{
                return object.isbn===book;
            })[0];
            const image = document.createElement('img');
            image.src = object.image;
            const title = document.createElement('div');
            title.innerText = object.title;
            title.id='title';
            const price = document.createElement('div');
            price.innerText = `Price: ${object.price}$`;
            price.value = object.price;
            price.id = 'price';
            price.title = 'price';
            const removeButton = document.createElement('div');
            removeButton.innerText = 'Remove from cart';
            removeButton.id='remove';
            removeButton.addEventListener('click',(event)=>{
                cart = cart.filter((isbn)=>{
                    return isbn!==book;
                });
                sessionStorage.setItem('cart',JSON.stringify(cart));
                renderCart();
            });
            divElement.appendChild(removeButton);
            divElement.appendChild(title);
            divElement.appendChild(price);
            divElement.appendChild(image);
            resultBox.appendChild(divElement);
    }
    const totalAmount =  document.createElement('div');
    const prices = resultBox.querySelectorAll('[title ="price"]');
    let total = 0;
    for (let i=0;i<prices.length;i++){
        total += parseInt(prices[i].value);
    }
    totalAmount.id='total';
    totalAmount.innerText = `Total Price: ${total}$`;
    resultBox.appendChild(totalAmount);
};
renderCart();
cancelButton.addEventListener('click',()=>{
    location.href='/';
});