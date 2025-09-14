"use strict"

import { pinning  } from './pinningUtils.js';
import { initUpdateForm  } from '../tableManipulation/tableCrudsHelpers.js';
import {  deleteRow } from '../tableManipulation/tableCruds.js'
import { showPlaceholderTable } from '../createElements/createTableSegments.js'



// ^^===============================================DEBOUNCE_FN==============================================> 
export const makeDebouncedFn = (fn, delay)=>{
    // !! Main debounce function to can apply debounce fun in arr given function need to avoid 
    //!! unnecssary calling of some repeated code as input event in inputs elements.
    let timeId;
    return (...args)=>{
        clearTimeout(timeId);
        timeId = setTimeout( ()=>{ fn.apply(null, args)}, delay );
    }
};
// ^^===============================================DEBOUNCE_FN==============================================>

// ??=======================================GETTING_DATA_FROM_ELEMENTS=======================================>
  

export const getElementIndexFromArrById = (urlRowEleId, urlsArr)=>{
    // !!__We Can also using find arr_method but here i try to be as pure as possible
    for (let i = 0, arrLength = urlsArr.length; i < arrLength; i++) {
        const iteratedEleId = urlsArr[i].id;
        if(iteratedEleId === urlRowEleId) return i; 
    }
    return -1;

};

export const getElementFromArrById = (urlRowEleId, urlsArr)=>{
    const urlItemIndex = getElementIndexFromArrById(urlRowEleId, urlsArr);
    return urlItemIndex === -1 ? null : urlsArr[urlItemIndex];
};

export const normalizeUrlHrefs = (urlHref)=>{
    const trimmedHref = urlHref.trim();
    const hasFullProtocol = trimmedHref.startsWith('https://') || trimmedHref.startsWith('http://');
    return hasFullProtocol ? trimmedHref : `https://${trimmedHref}`;
};

export const normalizeStringsToLowerCased = (str)=>{
    return str.trim().toLowerCase();
};

export const getCurrentTableBody = (table)=>{
    const tableBodies = table.querySelectorAll('tbody');
    
    for (let i = 0; i < tableBodies.length; i++) {
        const currentTableBody = tableBodies[i];
        if(!currentTableBody.classList.contains('d-none')){
            return currentTableBody
        }
        
    }
    return null


};


// ??=======================================GETTING_DATA_FROM_ELEMENTS========================================>


    
// !!=======================================REMOVING_CHILD_NODES==============================================>
    export const removeAllChilds = (parent)=>{
            // !! To remove even text if found i used firstChild method;
            // !! fiest element here is an hidden tr as a placholder to view when there is no data to give.
            while (parent.lastElementChild){
                    if (parent.lastElementChild.id === "noDataRow") {
                    break;
                }
                parent.removeChild(parent.lastElementChild);        
            }
            
    };


    export const removeTextChidlNodes = (parentNode)=>{
        for (let i = parentNode.childNodes.length - 1; i >= 0; i--) {
            const childNode = parentNode.childNodes[i];
            if (childNode.nodeType === Node.TEXT_NODE) { 
                parentNode.removeChild(childNode);
            }
        }
    }
    
// !!=======================================REMOVING_CHILD_NODES==============================================>


// ^^=================================================TOGGLEING===============================================>

    // ^^==========DISABLE/ENABLE_ROWLEVEL_UPDATE/DELETE_BTNS===========>
        export const toggleRowBtns = (cancelBtn)=>{
            // !! Here we select all btns which if we have 100 rows we select 200 btn in this project won't effect in perfermonace 
            //!! but it can be better if we show dialog blur all behind and give u screen with inputs to edit the selected element which need another logic
            const allRowBtns = document.querySelectorAll(".updateBtn, .deleteBtn");
            allRowBtns.forEach((btn)=>{
                btn.toggleAttribute("disabled");
            });
            cancelBtn.classList.toggle("d-none");
        };
    // ^^==========DISABLE/ENABLE_ROWLEVEL_UPDATE/DELETE_BTNS===========>
   

    export const toggleTableBtnDisability = (isValidName, isValidUrl, btn)=>{
        const currnetMode = btn.dataset.mode;
        let isDisabled;
        if(currnetMode === 'update'){
            isDisabled = !(isValidName || isValidUrl);
        }else{
            isDisabled = !(isValidName && isValidUrl);
        }

        btn.toggleAttribute("disabled", isDisabled)
    };

    export const changeStyleForCachedEle = (prevEle, currentEle, classToChange)=>{
        if (prevEle === currentEle) return; 
        prevEle?.classList.remove(classToChange); 
        currentEle.classList.add(classToChange);  
    }



// ^^=================================================TOGGLEING===============================================>

// ^^=================================================EVENT-HANDLERS===============================================>

export const tableRowBtnsEventHandler = (event, table, isFilterTable, allUrls, inputs, submitBtn, cancelBtn)=>{

        const updateElement = event.target.closest(".updateBtn");
        const deleteElement = event.target.closest(".deleteBtn");
        const visitElement = event.target.closest('.visitedBtn');
        const clickedPinIcon = event.target.closest('td.index svg');

        if(deleteElement){
            deleteRow(deleteElement.id, allUrls);
            if(allUrls.length === 0){
                showPlaceholderTable(table);
            }
        }
        else if(updateElement){
            initUpdateForm(updateElement.id, allUrls, inputs, submitBtn); 
            toggleRowBtns(cancelBtn);
        }else if(visitElement){
            const selectedRow = document.getElementById(event.target.id);
            if(selectedRow.classList.contains('not-safe-protocol')){
                const visitIt = confirm('This Website not encrupted through https protocol, are you sure you want to visit it?');
                if(!visitIt){
                    event.preventDefault();
                }
            }
                
        }else if(clickedPinIcon && !isFilterTable){
            const clickedPinTd = clickedPinIcon.parentNode
            if(clickedPinTd)   pinning(clickedPinTd, clickedPinIcon, allUrls, table);
        } 
};

// ^^=================================================EVENT-HANDLERS===============================================>












