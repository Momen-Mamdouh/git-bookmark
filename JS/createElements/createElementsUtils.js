'use strict'


export const createGenericEle = (elementTag, elementSelectors)=>{
    const element =  document.createElement(elementTag);

    Object.entries(elementSelectors).forEach(([key, value])=>{
        if(key === 'text'){
            element.textContent =  value;
        }else{
            element.setAttribute(key, value) 
        }
    });
    return element;
};


export const mainButtonEle =  ()=>{
    const mainBtn = document.createElement("button");
    mainBtn.className = 'btn p-2';
    return mainBtn
};

export const mainIconEle =  (addedClasses='')=>{
 
    const icon = document.createElement("i");
    icon.className = 'fa-solid pe-2';
    if(addedClasses){
        if (Array.isArray(addedClasses)) {
            icon.classList.add(...addedClasses); 
      
        } else if (typeof addedClasses === 'string' && addedClasses.trim() !== '') {
            icon.classList.add(addedClasses); // single class
        }
    }
    return icon
};

export const createImgEle = (src, alt)=>{
    const mainImg = document.createElement("img");
    mainImg.setAttribute('src', src);
    mainImg.onerror = () => {
        
        const favIconStr = mainImg.src.split('/').at(-1);
        mainImg.src = mainImg.src.replace( favIconStr, 'logo.svg');
     
    };
    mainImg.setAttribute('alt', `${alt} Website`);
    mainImg.className = 'p-2';
    mainImg.style = 'width: 60px;'
    return mainImg
}


export const createField = (fieldName)=>{
    const tableField =  document.createElement('td');
    tableField.classList.add(fieldName,`py-3`);
    return tableField;
};

export const createTableButton = (btnClassName, btnClass, iconClass, rowId)=>{
    const btn = mainButtonEle();
    const icon = mainIconEle();

    btn.classList.add(...[btnClass,btnClassName]);
    btn.id = rowId;
    icon.classList.add(iconClass);
    icon.id = rowId;

    btn.appendChild(icon);
    return btn;
};

