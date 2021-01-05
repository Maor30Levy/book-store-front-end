import {serverURL, renderModal, userFields}  from './utils.js' ;


const logout =  document.getElementById('logout');
const updateUserButton = document.getElementById('avatar-div');
const saveButton = document.getElementById('save-button');
const modal = document.getElementById('modal');
const modalBox = document.getElementById('modal-box');


updateUserButton.addEventListener('click', async (event)=>{
    renderModal();
    saveButton.name='user-update';    
    try{
        let router,password;
        if(sessionStorage.getItem('adminPassword')){
            router='user';
            password=sessionStorage.getItem('adminPassword');
        }else{
            router='costumer';
            password=sessionStorage.getItem('costumerPassword');
        }
        const token =sessionStorage.getItem('token');
        const result = await fetch(`${serverURL}/${router}/`,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if(result.status === 404){
            const err = await result.json();
            throw err;
        }
        const resObj = await result.json();
        for(let field of userFields){
            const label = document.createElement('label');       
            const element = document.createElement('input');
            element.id = field;
            if(field==='password'){
                element.value = sessionStorage.getItem('adminPassword')?
                sessionStorage.getItem('adminPassword'):
                sessionStorage.getItem('costumerPassword');
            }else{
                element.value = resObj[field];
            }     
            label.innerText = field.toUpperCase();
            label.appendChild(element);
            const div = document.createElement('div');
            div.appendChild(label);
            modalBox.appendChild(div);   
        }
        
    }catch(err){
        console.log(err);
    }
    event.stopPropagation();

});

logout.addEventListener('click',async ()=>{  
    try{
        const token =sessionStorage.getItem('token');
        const router = sessionStorage.getItem('adminPassword')?'user':'costumer';
            const result = await fetch(`${serverURL}/${router}/logout`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        if(result.ok){
            sessionStorage.setItem('token','');
            document.getElementById('avatar-div').className = 'none';
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

saveButton.addEventListener('click', async (event)=>{                   
    if(event.target.name==='user-update'){
        const record={};
        for(let field of userFields){
            record[field] = modalBox.querySelector(`#${field}`).value;
            }
        const token =sessionStorage.getItem('token');
        const router = sessionStorage.getItem('adminPassword')?'user':'costumer';
        const result = await fetch(`${serverURL}/${router}/edit/`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });
        if(result.status===200){                                
            alert('User updated successfully!');
            modal.className='none';                
        }else{
            const message = 'Unable to update user';
            alert(message);
            throw {status: result.status,message}
        }
    }
    event.stopPropagation();
});