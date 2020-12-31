
import {initDataBase, getDataFromDataBase,initFormQuery, serverURL,bookFields, userFields}  from './utils.js' ;
const token = sessionStorage.getItem('token');
const bearer = `Bearer ${token}`;

const form = document.getElementById('search-form');
const inputList = form.querySelectorAll('input');

const resultBox = document.getElementById('result-box');
const logout =  document.getElementById('logout');
const logoutAll =  document.getElementById('logout-all');
const addBookButton = document.getElementById('add-book');
const updateUserButton = document.getElementById('update-user');
const saveButton = document.getElementById('save-button');
const modal = document.getElementById('modal');
const modalBox = document.getElementById('modal-box');

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

const initUpdateBookButton = (buttonsDiv,bookElement,query)=>{
    const updateButton = document.createElement('button');
    updateButton.innerText = "Update";
    updateButton.addEventListener('click', async (event) => {
        modal.className = 'modal';
        const createModalBookForm = renderModal();
        saveButton.name='update';
        saveButton.title = JSON.stringify(query);
        createModalBookForm(saveButton.name);           
        try{
            const res = await fetch(`${serverURL}/books/${bookElement.id}`);
            if(!res.ok){
                throw {status: res.status, message: res.statusText}
            }
            const resObj =  await res.json();
            for(let field of bookFields){
                modalBox.querySelector(`#${field}`).value = resObj[field];
            }                                                                                  
        }catch(err){
            alert(err.message)
            modal.className='none';
            console.log(err);
            }
        event.stopPropagation();                    
    });
    buttonsDiv.appendChild(updateButton);
};

const initDeleteBookButton = (buttonsDiv,bookElement,query)=>{
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', async (event)=>{
        try{
            const result = await fetch(`${serverURL}/books/delete-book/${bookElement.id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                }
            });
            if(result.status===200){                  
                    alert('Book deleted successfully!');
                    bookElement.remove();
                    await initDataBase();
                    getDataFromDataBase(resultBox,query,renderButtons);
            }else{
                const message = 'Unable to delete book';
                alert(message);
                throw {status: result.status,message}
            }
        }catch(err){
            console.log(err.message)
        }
        event.stopPropagation();
    });
    buttonsDiv.appendChild(deleteButton);
};

const renderButtons = (query)=>{
    const buttons = document.querySelectorAll('#buttons');
    for(let button of buttons){
        initUpdateBookButton(button, button.parentElement,query);
        initDeleteBookButton(button,button.parentElement,query);
    }
};

logout.addEventListener('click',async ()=>{
    try{
        const result = await fetch(`${serverURL}/user/logout`,{
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
        });
        if(result.ok){
            sessionStorage.setItem('token','');
            location.href='/';
        }
    }catch(err){
        console.log(err.message)
    }
});

logoutAll.addEventListener('click',async ()=>{
    try{
        const result = await fetch(`${serverURL}/user/logout-all`,{
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
        });
        if(result.ok){
            sessionStorage.setItem('token','');
            location.href='/';
        }
    }catch(err){
        console.log(err.message)
    }
});

const renderModal = ()=>{
    const cancelButton = document.getElementById('cancel-button');
    const editButton = document.getElementsByName('edit-button');
    const createModalBookForm = (eventButton)=>{
        for (let i=0;i<bookFields.length;i++){
            
            const label = document.createElement('label');       
            const element = document.createElement('input');
            if(bookFields[i]==='price'){
                element.type='number'
            }else{
                element.type='text' 
            }
            if(bookFields[i]==='isbn' && eventButton==='update'){
                element.readOnly=true;
            }
            element.id= bookFields[i];   
            label.innerText=bookFields[i].toUpperCase();
            label.appendChild(element);
            const div = document.createElement('div');
            div.appendChild(label);
            modalBox.appendChild(div); 
        }
    };
    while(modalBox.firstChild){
        modalBox.removeChild(modalBox.lastChild);
    }
    modal.addEventListener('click', () => {
        modal.className = 'none';
        while(modalBox.firstChild){
            modalBox.removeChild(modalBox.lastChild);
        }
    });
     
    for(let button of editButton){
        button.addEventListener('click', () => {
            modal.className = 'modal';
        });
    }

    cancelButton.addEventListener('click', () => {
        modal.className = 'none';
    });

    modalBox.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    return createModalBookForm
};

updateUserButton.addEventListener('click', async (event)=>{
    const {createModalBookForm} = renderModal();
    saveButton.name='user-update';    
    try{
        const result = await fetch(`${serverURL}/user/`,{
            headers: {
                'Authorization': bearer,
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
                element.value = sessionStorage.getItem('adminPassword');
            }else{
                element.value = resObj[0][field];
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

addBookButton.addEventListener('click', ()=>{
    const createModalBookForm = renderModal();
    saveButton.name='add';
    createModalBookForm(saveButton.name);        
});

saveButton.addEventListener('click', async (event)=>{                   
    if(event.target.name==='user-update'){
        const record={};
        for(let field of userFields){
            record[field] = modalBox.querySelector(`#${field}`).value;
            }
        const result = await fetch(`${serverURL}/user/edit/`,{
            method: 'PATCH',
            headers: {
                'Authorization': bearer,
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
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            });
            if(result.status===201){
                    await initDataBase();                
                    alert('Book added successfully!')
            }else{
                const message = 'Unable to add new book';
                alert(message);
                throw {status: result.status,message}
            }
        }catch(err){
            console.log(err.message)
        }
    }               
    event.stopPropagation();
}); 

saveButton.addEventListener('click', async (event)=>{                   
    if(event.target.name==='update'){
        const record={};
        for(let field of bookFields){
            record[field] = modalBox.querySelector(`#${field}`).value;
            }
        const result = await fetch(`${serverURL}/books/edit/${record.isbn}`,{
            method: 'PATCH',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });
        if(result.status===200){                                
            alert('Book updated successfully!');
            modal.className='none';
            await initDataBase();
            getDataFromDataBase(resultBox,JSON.parse(saveButton.title),renderButtons);                
        }else{
            const message = 'Unable to update book record';
            alert(message);
            throw {status: result.status,message}
        }
    }
        event.stopPropagation();
});



        





