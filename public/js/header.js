import {serverURL}  from './utils.js' ;


const modal = document.getElementById('modal');
const modalBoxList= modal.children;
const loginForm = document.getElementById('login-form');

document.getElementById('sign-in').addEventListener('click',()=>{
    document.getElementById('modal').className = 'modal';
    document.getElementById('signup-modal').className = 'none';
    document.getElementById('login-modal').className = 'modal__box login';
});

document.getElementById('sign-up').addEventListener('click',()=>{
    document.getElementById('modal').className = 'modal';
    document.getElementById('login-modal').className = 'none';
    document.getElementById('signup-modal').className = 'modal__box signup';
});
modal.addEventListener('click', () => {
    modal.className = 'none';
});

for(let modalBox of modalBoxList){
    modalBox.addEventListener('click', (event)=>{
        event.stopPropagation();
    })
}

loginForm.addEventListener('submit',async (event)=>{
    event.preventDefault();
    const username = document.getElementById('login-username');
    const password = document.getElementById('login-password');
    try{
        if(document.getElementById('admin').checked){
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
        }else{
console.log('false3774');
        }
        
    }catch(err){
        console.log(err.message)
    }  
});
