'use strict'

import {    normalizeUrlHrefs, normalizeStringsToLowerCased, getElementFromArrById, getElementIndexFromArrById, 
            removeTextChidlNodes } from '../utils/utils.js'
import {     makeModalValuesForCruds, showCustomModal } from  '../modal/modal.js'

import {    createRow, removePlacholderTable } from '../createElements/createTableSegments.js';
import {    searchCacheLogic } from '../utils/searchUtils.js'
import {    ADDED_NUMBER_TO_ORDER_INDEX, SUCCESS_INPUT_CLASS , FAILED_INPUT_CLASS } from '../fixedData.js'

// ^^==========================================ADDING-HELPERS==========================================>
export const constructNewUrl = (inputs, websiteImg)=>{

    const urlUniqueId = crypto.randomUUID();       
    const normalizedLink = normalizeUrlHrefs(inputs.urlInput.value);
    const normalizedName = normalizeStringsToLowerCased(inputs.nameInput.value);
    const normalizedCategory = normalizeStringsToLowerCased(inputs.categoryInput.value);
    
    const newUrl = {
        id : urlUniqueId,
        elementOrder: 0,
        websiteName: normalizedName,
        websiteURL: normalizedLink,
        websiteCategory:normalizedCategory,
        websiteImgHref: websiteImg || false,
        pinned:false,
    };   

     return newUrl
        
};

const checkDuplications = (newUrl, allUrls)=>{
        const currentUserLink = newUrl.websiteURL;
        const currentUserWebsiteName = newUrl.websiteName;

       for (let idx = 0, arrLength = allUrls.length; idx < arrLength; idx++) {
            const currentTableLink = allUrls[idx].websiteURL;
            const currentTableLinkName = allUrls[idx].websiteName;
 
            const isDuplicatedLink = currentTableLink === currentUserLink;
            const isDuplicatedName =  currentTableLinkName === currentUserWebsiteName;

            if(isDuplicatedLink || isDuplicatedName){ 
                return {
                    isDuplicatedLink,
                    isDuplicatedName,
                    currentTableLinkName,
                    currentUserWebsiteName,
                    currentTableLink,
                    currentUserLink,
                    elementIndex: idx
                };
            }
        }
     
         return null;
 
};
const pushNewUrlIntoArr = (newUrl, allUrls)=>{
    allUrls.push(newUrl);

    newUrl.elementOrder =  getElementIndexFromArrById(newUrl.id, allUrls) + ADDED_NUMBER_TO_ORDER_INDEX;
    localStorage.setItem("allUrls", JSON.stringify(allUrls));
};
export const addNewUrlIntoHtml = (currentUrl, elementToAddInto)=>{
    const row =  createRow(currentUrl);
    elementToAddInto.appendChild(row);
};

export const handleAddResult = (newUrl, allUrls, tableBody)=>{

     const duplicationObj = checkDuplications(newUrl, allUrls);
    
            if(duplicationObj){
                const elementOrderLine =  duplicationObj.elementIndex + ADDED_NUMBER_TO_ORDER_INDEX;
                const modalMessage = `This Website is already Found in line ${elementOrderLine}`;
                const duplicated =  { isDuplicatedLink:duplicationObj.isDuplicatedLink, isDuplicatedName:duplicationObj.isDuplicatedName };
                const { modalValues } = makeModalValuesForCruds(duplicationObj);
    
                showCustomModal(modalMessage, 'add', duplicated, modalValues);
                return;    
            }
            else{
    
                pushNewUrlIntoArr(newUrl, allUrls);
                addNewUrlIntoHtml(newUrl, tableBody);
                showCustomModal(`Url addedSuccessfully in line ${newUrl.elementOrder}`, 'successAdd');
                searchCacheLogic.clearCachedDataMap();
                removePlacholderTable(tableBody);
                
            }
}
// ^^==========================================ADDING-HELPERS==========================================>



// !!==========================================UPDATING-HELPERS==========================================>

const getRowFields = (htmlEles, querySelector)=>{
    let htmlElesArr = [];
    htmlEles.forEach((htmlEle)=>{
        htmlElesArr.push(htmlEle.querySelector(querySelector));
    });
    return htmlElesArr;
};

export const setSubmitMode = (elementId=null, submitBtn)=>{
    const isInUpdateMode = submitBtn.dataset.mode === "update";

    if(isInUpdateMode){
        // ^^ Change to Add Button
        submitBtn.textContent = 'Add';
        submitBtn.classList.replace("btn-warning", "btn-danger");
        submitBtn.dataset.mode = 'add';
        submitBtn.removeAttribute("data-id");
    }

    else{
         if (elementId === null) {
            console.warn('setSubmitMode called without elementId for update mode; staying in add mode.');
            submitBtn.removeAttribute("data-id");
            submitBtn.dataset.mode = 'add';
            return;
        }
        
        // ^^ Change to Update Button
        submitBtn.textContent = 'Update';
        submitBtn.classList.replace("btn-danger", "btn-warning");
        submitBtn.dataset.mode = 'update';
        submitBtn.setAttribute("data-id", elementId);
    
    }
};

export const initUpdateForm = (elementId, allUrls, inputs, submitBtn)=>{
    const selectedItemInArray = getElementFromArrById(elementId, allUrls);
    if(!selectedItemInArray) return;

    // ^^ View RowData Into Inputs To Update: 
    inputs.nameInput.value = selectedItemInArray.websiteName;
    inputs.urlInput.value = selectedItemInArray.websiteURL;
    inputs.categoryInput.value = selectedItemInArray.websiteCategory;

    setSubmitMode(elementId, submitBtn);
    inputs.nameInput.focus();
};


export const updateRowCells = (selectedItemInArray, inputs, selectedHtmlEles, submitBtn)=>{

    const currentWebsiteName = normalizeStringsToLowerCased(inputs.nameInput.value);
    const currentWebsiteUrl = inputs.urlInput.value;
    const currentWebsiteCategory = normalizeStringsToLowerCased(inputs.categoryInput.value);

    const isNameChanged = currentWebsiteName !== selectedItemInArray.websiteName;
    const isUrlChanged = currentWebsiteUrl !== selectedItemInArray.websiteURL;
    const isCategoryChanged = currentWebsiteCategory !== selectedItemInArray.websiteCategory;


    if(isNameChanged || isUrlChanged || isCategoryChanged){

        submitBtn.toggleAttribute("disabled");
        
        const htmlWebsiteNames = getRowFields(selectedHtmlEles , '.Website');
        const htmlWebsiteURLs = getRowFields(selectedHtmlEles , '.anchorField a');
        const htmlWebsiteCategory = getRowFields(selectedHtmlEles , '.Category');

        if (isNameChanged && htmlWebsiteNames) htmlWebsiteNames.forEach((htmlEle)=>{htmlEle.textContent = currentWebsiteName});
        
        if (isUrlChanged && htmlWebsiteURLs) htmlWebsiteURLs.forEach((htmlEle)=>{htmlEle.href = currentWebsiteUrl});
        
        if (isCategoryChanged && htmlWebsiteCategory) htmlWebsiteCategory.forEach((htmlEle)=>{htmlEle.textContent = currentWebsiteCategory});
        
    }
      return { isNameChanged, isUrlChanged, isCategoryChanged };
};



// !!==========================================UPDATING-HELPERS==========================================>



export const redefineUrlsIndexAfterDelete = (allUrls) => {
    let currentIndex = ADDED_NUMBER_TO_ORDER_INDEX; 

    allUrls.forEach((item) => {
        const htmlRowElements = document.querySelectorAll(`tr[id="${item.id}"]`);
        if (!htmlRowElements) return;

        if (item.pinned) {
   
            currentIndex = item.elementOrder + 1; 
            return;
        }


        item.elementOrder = currentIndex;

        htmlRowElements.forEach(htmlEle => {
            const htmlElementFirstChild = htmlEle?.firstElementChild;
            if (htmlElementFirstChild) {
                removeTextChidlNodes(htmlElementFirstChild);
                const newTextNode = document.createTextNode(currentIndex);
                htmlElementFirstChild.appendChild(newTextNode);
            }

            htmlEle.classList.forEach(eleClass => {
                if (eleClass.startsWith("row-")) {
                    htmlEle.classList.remove(eleClass);
                }
            });
            htmlEle.classList.add(`row-${currentIndex}`);
        });

        currentIndex++;
    });

    localStorage.setItem("allUrls", JSON.stringify(allUrls));
};


// ^^==========================================CLEARING-INPUTS-HELPERS==========================================>

export const clearRow = (inputs) => {
     inputs.nameInput.value = "";
     inputs.urlInput.value = "";
     inputs.categoryInput.value = "";
};

export const clearMarks = (elementsHaveMarks)=>{
     elementsHaveMarks.forEach((ele)=>{
         ele.parentNode.classList.remove(SUCCESS_INPUT_CLASS, FAILED_INPUT_CLASS);
     })
 };
// ^^==========================================CLEARING-INPUTS-HELPERS==========================================>
