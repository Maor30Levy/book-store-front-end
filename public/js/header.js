import {serverURL,initCostumerDataBase}  from './utils.js' ;


const modal = document.getElementById('modal');
const modalBoxList= modal.children;
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signUserName = document.getElementById('signup-username');
const signPassword = document.getElementById('signup-password');
const signConfirmPassword = document.getElementById('signup-confirm-password');
const signEmail = document.getElementById('signup-email');
const errorMessageDiv = document.getElementById('error-message');
const logout =  document.getElementById('sign-out');

let token =sessionStorage.getItem('token') || '';
let bearer =  `Bearer ${token}`;


document.getElementById('sign-in').addEventListener('click',()=>{
    document.getElementById('modal').className = 'modal';
    document.getElementById('signup-modal').className = 'none';
    document.getElementById('login-modal').className = 'modal__box login';
});

const renderHeader = (username=undefined)=>{
    if(token){
        document.getElementById('sign').className='none';
        document.getElementById('logged-in').className='sign';
        document.getElementById('hello').className='';
        document.getElementById('hello').innerText=`Hello, ${username}`;
    }else{
        document.getElementById('sign').className='sign';
        document.getElementById('logged-in').className='none';
        document.getElementById('hello').className='none';
    }
};
renderHeader(sessionStorage.getItem('username'));

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
        const router = document.getElementById('admin').checked?'user':'costumer';
        const result = await fetch(`${serverURL}/${router}/login`,{
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
                const resObj = await result.json();
                token = resObj.token;
                sessionStorage.setItem('token', token);
                bearer = `Bearer ${token}`;
                sessionStorage.setItem('username',username.value);
                if(router==='user'){
                    sessionStorage.setItem('adminPassword', password.value);
                    location.href ='/admin';
                }else{
                    sessionStorage.setItem('cart',JSON.stringify(resObj.costumer.cart));
                    location.href='/';
                }
        }
        
    }catch(err){
        console.log(err.message)
    }  
});

document.getElementById('home').addEventListener('click',()=>{
    location.href='/';
});

const submitSignUp = document.getElementById('signup');
submitSignUp.disabled=true;

const renderErrorSignupForm = (message)=>{
    errorMessageDiv.className='error__message';
    errorMessageDiv.innerText=message;
}

const checkForUsernameAvailability = (username)=>{
    const userNames = JSON.parse(sessionStorage.getItem('costumersDataBase'));
    if((userNames.filter((user)=>{return user===username})).length>0){
        return false;
    }
    return true;
};

const checkForm = ()=>{
    if(!checkUsername()){return false;}
    if(!checkPassword()){return false;}
    if(!checkEmail()){return false;}
    return true;
};

const checkUsername = ()=>{
    if(signUserName.value.length<7){
        renderErrorSignupForm('Username must be at least 7 characters long.');
        return false;
    }
    if(!(checkForUsernameAvailability(signUserName.value))){
        renderErrorSignupForm('Username is unavailable. Please try a different username.');
        return false;
    }
    errorMessageDiv.className='none';
    return true;
};

const checkPassword = ()=>{
    if(signPassword.value.length<7){
        renderErrorSignupForm('The password must be at least 7 characters long.');
        return false;
    }
    if(signPassword.value!==signConfirmPassword.value){
        renderErrorSignupForm('Please confirm the chosen password.');
        return false;
    }
    errorMessageDiv.className='none';
    return true;
};

const checkEmail = ()=>{
    if(!signEmail.validity.valid){
        renderErrorSignupForm('Invalid email address.');
            return false;    
    }
    errorMessageDiv.className='none';
    return true;
};


signUserName.addEventListener('keyup',()=>{
    submitSignUp.disabled=!checkForm();
});

signUserName.addEventListener('blur',()=>{
    submitSignUp.disabled=!checkForm();
});

signPassword.addEventListener('keyup',()=>{
    submitSignUp.disabled=!checkForm();
});

signPassword.addEventListener('blur',()=>{
    submitSignUp.disabled=!checkForm();
});

signConfirmPassword.addEventListener('keyup',()=>{
    submitSignUp.disabled=!checkForm();
});

signConfirmPassword.addEventListener('blur',()=>{
    submitSignUp.disabled=!checkForm();
});

signEmail.addEventListener('keyup',()=>{
    submitSignUp.disabled=!checkForm();
});

signEmail.addEventListener('blur',()=>{
    submitSignUp.disabled=!checkForm();
});

signupForm.addEventListener('submit',async (event)=>{
    event.preventDefault();
    const newUser={
        userName:signUserName.value,
        password:signPassword.value,
        email:signEmail.value
    }
    try{               
        const result = await fetch(`${serverURL}/costumer/new`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        if(result.status===201){
                await initCostumerDataBase();
                const resObj = await result.json();
                token = resObj.token;
                sessionStorage.setItem('token',token);
                bearer = `Bearer ${token}`;
                sessionStorage.setItem('username',newUser.userName); 
                sessionStorage.setItem('cart',JSON.stringify(resObj.costumer.cart));
                location.href='/';          
        }else if(result.status===400){
            const message = 'Invalid email address';
            renderErrorSignupForm(message);
            throw {status: result.status,message}
        }else{
            const message = 'Unable to add new user';
            renderErrorSignupForm(message);
            throw {status: result.status,message}  
        }
    }catch(err){
        console.log(err.message)
    }

    
});

logout.addEventListener('click',async ()=>{  
    try{
        const router = sessionStorage.getItem('adminPassword')?'user':'costumer';
            const result = await fetch(`${serverURL}/${router}/logout`,{
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                }
            });
        if(result.ok){
            sessionStorage.setItem('token','');
            if(router==='user'){
                sessionStorage.setItem('adminPassword', '');
            }
            sessionStorage.setItem('cart',JSON.stringify([]));
            location.href='/';
        }   
    }catch(err){
        console.log(err.message)
    }
});