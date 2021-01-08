
import {alertModal,initMainPage, renderModal, initDataBase, getDataFromDataBase,initFormQuery, serverURL,bookFields, userFields}  from './utils.js' ;
const token = sessionStorage.getItem('token');
const bearer = `Bearer ${token}`;

const form = document.getElementById('search-form');
const inputList = form.querySelectorAll('input');

const resultBox = document.getElementById('result-box');
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
            alertModal(err.message)
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
                    alertModal('Book deleted successfully!');
                    bookElement.remove();
                    await initDataBase();
                    getDataFromDataBase(resultBox,query,renderButtons);
            }else{
                const message = 'Unable to delete book';
                alertModal(message);
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
            alertModal('Book updated successfully!');
            modal.className='none';
            await initDataBase();
            getDataFromDataBase(resultBox,JSON.parse(saveButton.title),renderButtons);                
        }else{
            const message = 'Unable to update book record';
            alertModal(message);
            throw {status: result.status,message}
        }
    }
        event.stopPropagation();
});

initMainPage(resultBox,renderButtons);





        





