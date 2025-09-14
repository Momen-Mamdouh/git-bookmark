
import { createField, createTableButton, mainIconEle, createImgEle } from './createElementsUtils.js'
import { UPDATE_BUTTON_CONFIG, DELETE_BUTTON_CONFIG, VISIT_BUTTON_CONFIG } from "../fixedData.js"
import { addNewUrlIntoHtml } from '../tableManipulation/tableCrudsHelpers.js'

const savingToolBar = document.querySelector('.saving-toolbar');

// ^^==================================APPENDING==================================>

    const appendTextedFieldsInTable = (dataToAdd, websiteItem, urlRow)=>{    
     
        dataToAdd.forEach((data)=>{
            const createdField = createField(data.fieldName);
            
            createdField.textContent= data.fieldText;
      
            if(data.fieldName === 'index'){
                let pinIconClass;
                
                if(websiteItem.pinned) pinIconClass = ['fa-thumbtack', 'pinned-icon']
                    else pinIconClass = ['fa-thumbtack-slash', 'pin-icon'];
                    
                const pinnIcon = mainIconEle([...pinIconClass]);
                createdField.appendChild(pinnIcon);
                createdField.dataset.id = websiteItem.elementOrder;

            }  
            urlRow.appendChild(createdField);
        })
       
    };

    const appendUrlAnhcor =  (websiteItem, urlRow)=>{
        const urlField = createField('anchorField');
        const linkEle = document.createElement('a');
        let urlImg;
   
       
        linkEle.setAttribute("href", websiteItem.websiteURL);
        linkEle.setAttribute("target", "_blank");
      

        if(websiteItem.websiteImgHref === false) {

            const visitCfg = { ...VISIT_BUTTON_CONFIG, btnClass: 'btn-outline-danger' };
            appendButton(linkEle, visitCfg, websiteItem.id);
            
        }
        else{ 
                urlImg = createImgEle(websiteItem.websiteImgHref, websiteItem.websiteName);
                linkEle.appendChild(urlImg);
        }

        urlField.appendChild(linkEle);
        urlRow.appendChild(urlField);

    };

 
    const appendButton = (urlItem, buttonData, urlRowId)=>{
        const { btnId, btnClass, iconClass, btnText } =  buttonData;

        const btnField = createField(btnText);
        const button = createTableButton(btnId, btnClass, iconClass, urlRowId);

        btnField.appendChild(button)
        urlItem.appendChild(btnField);
    };

    const appendBtnsInRow = (btnsToAdd, urlRow, urlRowId)=>{

        btnsToAdd.forEach((buttonConfig)=>{
            appendButton(urlRow, buttonConfig, urlRowId);
        });
    };



// ^^==================================APPENDING==================================>


// ^^==================================CREATION==================================>

    export const createRow = (websiteItem)=>{
        const tableRow = document.createElement('tr');
        tableRow.id = websiteItem.id;
        tableRow.setAttribute("data-uuid", websiteItem.id);
        tableRow.className = `row-${websiteItem.elementOrder}`;

        const btnsToAdd = [ UPDATE_BUTTON_CONFIG, DELETE_BUTTON_CONFIG ];
        const fieldsData = [    {fieldName: 'index', fieldText:(websiteItem.elementOrder)}, 
                                {fieldName: 'Website', fieldText:websiteItem.websiteName},
                                {fieldName: 'Category', fieldText:websiteItem.websiteCategory} ];
        if(websiteItem.websiteImgHref === false){
            tableRow.classList.add('not-safe-protocol')
        }
        
        appendTextedFieldsInTable(fieldsData, websiteItem ,tableRow);
        appendUrlAnhcor(websiteItem, tableRow);
        appendBtnsInRow(btnsToAdd, tableRow, websiteItem.id);

        return tableRow
        
    };

// ^^==================================CREATION==================================>


// ^^==================================VIEW==================================>
    
    export const displayRowsInTableSelected =   (tableBody , allUrls)=>{
        const dataFragment =  document.createDocumentFragment();

        if(allUrls.length !==0){
            removePlacholderTable(tableBody);

            allUrls.forEach((currentUrl)=>{
                addNewUrlIntoHtml(currentUrl, dataFragment);

            });
        }else{

           showPlaceholderTable(tableBody);
        }

        tableBody.appendChild(dataFragment);
    };

    
    export const showPlaceholderTable = (tableBody)=>{
            tableBody.querySelector('#noDataRow').classList.remove('d-none');
            savingToolBar.classList.add('d-none');
    }
    export const removePlacholderTable = (tableBody)=>{
        const emptyRow = tableBody.querySelector('#noDataRow');
        if(emptyRow) emptyRow.classList.add('d-none');
        savingToolBar.classList.remove('d-none');
    }


// ^^==================================VIEW==================================>


   