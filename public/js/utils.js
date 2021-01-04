export const serverURL = 'https://maor30levy-book-store-back-end.herokuapp.com';
// export const serverURL = 'http://localhost:3001';

export const bookFields = ['title','author','category','price','isbn','image','summary'];
export const userFields = ['userName','password','email'];
export let dataBase;
export let costumersDataBase;
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
                // divElement.addEventListener('click',addSubQuery(event,key,obj,element,buttonsRenderFunc));
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

export const renderAddCommentButton = ()=>{
    const buttons = document.querySelectorAll('#buttons');
    for(let button of buttons){
        const addCommentButton = document.createElement('button');
        addCommentButton.innerText='Add comment';
        addCommentButton.addEventListener('click',()=>{
                alert('Comment added!');
        });
        button.appendChild(addCommentButton);
    }
}

export const addSubQuery = (event,key,obj,element,buttonsRenderFunc)=>{
    const query = {};
    const value = key==='price'?parseInt(obj[key]):obj[key];
    query[key]=value;
    getDataFromDataBase(element,query,buttonsRenderFunc);
}



