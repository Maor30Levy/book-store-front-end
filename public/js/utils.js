// export const serverURL = 'https://maor30levy-book-store-back-end.herokuapp.com';
export const serverURL = 'http://18.189.192.135:3001';
// export const serverURL = 'http://localhost:3001';

export const bookFields = ['title','author','category','price','isbn','image','summary'];
export const userFields = ['userName','password','email'];
export let dataBase;
export let costumersDataBase;

const modal = document.getElementById('modal');
const modalBox = document.getElementById('modal-box');
const saveButton = document.getElementById('save-button');


export const initDataBase = async ()=>{
    try{
    const result = await fetch(`${serverURL}/books/`);
        if(!result.ok){
            throw {
                    status: result.status,
                    message: result.statusText
                }
        }   
        const resObj = await result.json();
        sessionStorage.setItem('dataBase',JSON.stringify(resObj));
        return dataBase =resObj;   
  
    }catch(err){
        console.log(err.message);
        sessionStorage.setItem('dataBase',JSON.stringify([]));
        return dataBase = [];
    }
};

export const initCostumerDataBase = async ()=>{
    try{
    const result = await fetch(`${serverURL}/costumer/getUserNames`);
        if(!result.ok){
            throw {
                    status: result.status,
                    message: result.statusText
                }
        }   
        const resObj = await result.json();
        sessionStorage.setItem('costumersDataBase',JSON.stringify(resObj));
        return costumersDataBase =resObj;   
  
    }catch(err){
        console.log(err.message);
        sessionStorage.setItem('costumersDataBase',JSON.stringify([]));
        return costumersDataBase = [];
    }
};

export const initMainPage = async (element,renderButtons)=>{
    if(!dataBase){
        await initDataBase();
        await initCostumerDataBase();
    }
    document.body.className='';
    getDataFromDataBase(element,{},renderButtons);
};
const filterQuery = (object,query)=>{
    for(let key in query){
        switch(key){
            case 'title':case 'author':
            case 'category':case 'isbn':
                const objValue = object[key].toLowerCase();
                const queryValue = query[key].toLowerCase();
                if(!(objValue.includes(queryValue))){
                    return false;
                }break;
            case 'fromPrice':
                if(object.price<query[key]){
                    return false;
                }break;
            case 'toPrice':
                if(object.price>query[key]){
                    return false;
                }break;
            default:
                if(object[key]!==query[key]){
                    return false;
                }
        }
    }
    return true;
};

export const renderResults=function (element, objArray,query,buttonsRenderFunc){
    while(element.firstChild){
        element.removeChild(element.lastChild);
    }
    const renderFields = ['title','author','category',
                        'price','rating','isbn'];
    if(objArray.length===0){
        return undefined
    }
    for(let obj of objArray){
        const book = document.createElement('div');
        book.id = obj.isbn;
        book.className = "book";
        for(let key of renderFields){
            const divElement = document.createElement('div');
            divElement.id=key;
            if(key==='title'){
                divElement.addEventListener('click',(event)=>{
                    sessionStorage.setItem('bookISBN',obj.isbn);
                    location.href=`/book/${obj.title}`;
                });
            }else{
                if(location.pathname[1]!=='b'){
                    divElement.addEventListener('click',(event)=>{
                    const query = {};
                    const value = key==='price'?parseInt(obj[key]):obj[key];
                    query[key]=value;
                    getDataFromDataBase(element,query,buttonsRenderFunc);
                    
                });}
                
            }

            if(key==='rating'){
                divElement.innerText = `Rating: ${obj[key]}/5`;
            }else if(key==='price'){
                divElement.innerText = `${obj[key]}$`;
            }else if(key==='isbn'){
                divElement.innerText = `ISBN: ${obj[key]}`;
            }else{
                divElement.innerText = obj[key];
            }
            
            book.appendChild(divElement);
        }

        const image = document.createElement('img');
        image.id='image';
        image.src=obj.image;
        book.appendChild(image);

        const buttons = document.createElement('div');
        buttons.id='buttons';
        book.appendChild(buttons);

        element.appendChild(book);
    }
    buttonsRenderFunc(query);
};

export const getDataFromDataBase =function (element, query,buttonsRenderFunc){
    const result = dataBase.filter((object)=>{
        return filterQuery(object,query);
    });   

    renderResults(element,result,query,buttonsRenderFunc);
    return result;
};

export const initFormQuery = (form)=>{
    let queryFields = form.children;
    const query={};
    for(let i=0;i<queryFields.length;i++){
        const field = queryFields[i];
        let value = field.value.toLowerCase();
        if (field.id==='fromPrice'||field.id==='toPrice'|| field.id==='rating'){
            value = parseInt(value);
        }
        if(field.tagName!=='button'&& field.value!==''){
            query[field.id] = value;
        }
    }
    return query;
};

export const renderAddCommentButton = (isbn)=>{
    const buttons = document.querySelectorAll('#buttons');
    for(let button of buttons){
        const addCommentButton = document.createElement('button');
        const bookID = isbn || button.parentElement.id;
        addCommentButton.innerText='Add comment';
        addCommentButton.addEventListener('click', ()=>{
            addComment(bookID);
        });
        button.appendChild(addCommentButton);
    }
}

export const addSubQuery = (event,key,obj,element,buttonsRenderFunc)=>{
    const query = {};
    const value = key==='price'?parseInt(obj[key]):obj[key];
    query[key]=value;
    getDataFromDataBase(element,query,buttonsRenderFunc);
};

export const renderModal = ()=>{
    modal.className = 'modal';
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
    return createModalBookForm;
};

export const alertModal = (message)=>{
    const alertModal = document.getElementById('alert-modal');
    const alertBox = document.getElementById('alert-box');
    const okButton = document.getElementById('ok-button');
    
    alertModal.className='modal';
    
    alertBox.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    okButton.addEventListener('click', (event) => {
        alertModal.className='none';
    });

    alertModal.addEventListener('click', (event) => {
        alertModal.className='none';
    });

    alertBox.innerText=message;
};

export const editCostumerCart = async ()=>{
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

export const addComment = (isbn)=>{
    renderModal();
    const ratingDiv = document.createElement('div');
    const commentDiv = document.createElement('div');
    ratingDiv.id='rating-div';
    ratingDiv.addEventListener('mouseout',()=>{
        for(let i=0;i<5;i++){
            const hoverStar = ratingDiv.querySelector(`#star${i}`);
                hoverStar.innerHTML='&#9734';
        }
        for(let i=0;i<ratingDiv.value;i++){
            const hoverStar = ratingDiv.querySelector(`#star${i}`);
                hoverStar.innerHTML='&#9733';
        }
    })
    for(let i=0;i<5;i++){
        const star = document.createElement('span');
        star.id=`star${i}`;
        star.innerHTML='&#9734';
        star.addEventListener('mouseover',()=>{
            for(let j=0;j<=i;j++){
                const hoverStar = document.getElementById(`star${j}`);
                hoverStar.innerHTML='&#9733';
            }
            
        });
        star.addEventListener('mouseout',()=>{
            for(let j=0;j<=i;j++){
                const hoverStar = document.getElementById(`star${j}`);
                hoverStar.innerHTML='&#9734';
            }  
        });
        star.addEventListener('click',()=>{
            ratingDiv.value = (i+1);
        });
        ratingDiv.appendChild(star);
    }
    commentDiv.id='comment-div';
    const comment = document.createElement('textarea');
    comment.wrap="soft";
    comment.id="comment";
    comment.placeholder="Add your comment here...";
    comment.rows='14';
    commentDiv.appendChild(comment);
    saveButton.title=isbn;
    saveButton.name='comment';
    modalBox.appendChild(ratingDiv);
    modalBox.appendChild(commentDiv);
};

saveButton.addEventListener('click',async ()=>{
    if(saveButton.name==='comment'){
        const ratingDiv = document.getElementById('rating-div');
        const comment = document.getElementById('comment');
        if(ratingDiv.value>0|| comment.value!=='' ){
            try{
                const body = {isbn:saveButton.title}
                if(ratingDiv.value>0){
                    body.rating = parseInt(ratingDiv.value);
                }
                if(comment.value!==''){
                    body.comment = comment.value;
                }
                const result = await fetch(`${serverURL}/books/add-comment`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                if(result.status!==200){
                    const res = await result.json();
                    throw res;
                }
                await initDataBase();
                alertModal('Comment added!');
            }catch(err){
                alertModal(err.message);
            }
            
        }


        
        modal.className='none';
    }
});