import {editCostumerCart} from './utils.js';
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
                return object.isbn===book.isbn;
            })[0];
            const image = document.createElement('img');
            image.src = object.image;
            
            const title = document.createElement('div');
            title.innerText = object.title;
            title.id='title';
            
            const quantity = document.createElement('input');
            quantity.type = 'number';
            quantity.id='quantity';
            quantity.value=book.quantity;
            quantity.min = '1';
            quantity.addEventListener('input',()=>{
                book.quantity=quantity.value;
                sessionStorage.setItem('cart',JSON.stringify(cart));
                renderCart();
                editCostumerCart();
            });
            
            const price = document.createElement('div');
            price.innerText = `Price: ${object.price}$`;
            price.value = object.price;
            price.id = 'price';

            const amount = document.createElement('div');
            amount.value = object.price*book.quantity;
            amount.innerText = `Total amount: ${amount.value}$`;
            amount.id = 'amount';

            price.title = 'price';
            const removeButton = document.createElement('div');
            removeButton.innerText = 'Remove from cart';
            removeButton.id='remove';
            removeButton.addEventListener('click',async (event)=>{
                cart = cart.filter((cell)=>{
                    return cell.isbn!==book.isbn;
                });
                sessionStorage.setItem('cart',JSON.stringify(cart));
                await editCostumerCart();
                renderCart();
            });

            
            divElement.appendChild(amount);
            divElement.appendChild(quantity);
            divElement.appendChild(removeButton);
            divElement.appendChild(title);
            divElement.appendChild(price);
            divElement.appendChild(image);
            resultBox.appendChild(divElement);
    }
    const totalAmount =  document.createElement('div');
    const prices = resultBox.querySelectorAll('#amount');
    let total = 0;
    for (let i=0;i<prices.length;i++){
        total += parseInt(prices[i].value);
    }
    totalAmount.id='total';
    totalAmount.innerText = `Total Purchase Amount: ${total}$`;
    resultBox.appendChild(totalAmount);
};
renderCart();
cancelButton.addEventListener('click',()=>{
    location.href='/';
});