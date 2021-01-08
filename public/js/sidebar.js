import {alertModal,serverURL, renderModal, initDataBase, userFields,bookFields}  from './utils.js' ;


const logout =  document.getElementById('logout');
const updateUserButton = document.getElementById('avatar-div');
const saveButton = document.getElementById('save-button');
const modal = document.getElementById('modal');
const modalBox = document.getElementById('modal-box');
const addBookButton = document.getElementById('add-book');

addBookButton.addEventListener('click', ()=>{
    const createModalBookForm = renderModal();
    saveButton.name='add';
    createModalBookForm(saveButton.name);        
});

updateUserButton.addEventListener('click', async (event)=>{
    renderModal();
    saveButton.name='user-update';
    const isAdmin = sessionStorage.getItem('adminPassword')?true:false;    
    try{
        let router,password;
        if(isAdmin){
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
        const user = isAdmin?resObj[0]:resObj;
        for(let field of userFields){
            const label = document.createElement('label');       
            const element = document.createElement('input');
            element.id = field;
            if(field==='password'){
                element.value = isAdmin?
                sessionStorage.getItem('adminPassword'):
                sessionStorage.getItem('costumerPassword');
            }else{
                element.value = user[field];
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
            alertModal('User updated successfully!');
            modal.className='none';                
        }else{
            const message = 'Unable to update user';
            alertModal(message);
            throw {status: result.status,message}
        }
    }
    event.stopPropagation();
});

saveButton.addEventListener('click',async (event) => {        
    if(event.target.name==='add'){
        modal.className = 'none';
        const record = {};
        for(let key of bookFields){
            record[key] = document.getElementById(key).value
        }
        try{               
            const result = await fetch(`${serverURL}/books/new`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            });
            if(result.status===201){
                    await initDataBase();                
                    alertModal('Book added successfully!')
            }else{
                const message = 'Unable to add new book';
                alertModal(message);
                throw {status: result.status,message}
            }
        }catch(err){
            console.log(err.message)
        }
    }               
    event.stopPropagation();
}); 


