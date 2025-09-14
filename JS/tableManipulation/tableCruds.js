"use strict"
import {    getElementIndexFromArrById, getElementFromArrById, toggleRowBtns, normalizeStringsToLowerCased } from '../utils/utils.js';

import {    UPDATE_MODAL_MESSAGES } from '../fixedData.js'
import {    showCustomModal } from  '../modal/modal.js'
import {    searchCacheLogic } from '../utils/searchUtils.js'

import {    constructNewUrl, handleAddResult, setSubmitMode, updateRowCells, 
            redefineUrlsIndexAfterDelete, clearMarks, clearRow } from './tableCrudsHelpers.js'


export const attemptAddUrl = (isValid, inputs, websiteImg, allUrls, tableBody)=>{

    if(isValid){
        const newUrl = constructNewUrl(inputs, websiteImg)

        clearMarks([inputs.nameInput, inputs.urlInput]);
        clearRow(inputs);

        handleAddResult(newUrl, allUrls, tableBody)
       
    }else{
        const modalMessage = `Site Name or Url is not valid, Please follow the rules below :`;
        showCustomModal(modalMessage, 'add');
    }
};


export const cancelUpdate = (cancelBtn, inputs, submitBtn)=>{
    toggleRowBtns(cancelBtn);
    clearRow(inputs);

    setSubmitMode(null, submitBtn);
};


export const commitRowUpdate = (currentTarget, allUrls, inputs)=>{
  
    const elementId = currentTarget.getAttribute("data-id");
    const selectedItemInArray = getElementFromArrById(elementId, allUrls);
   
    const selectedHtmlEles = document.querySelectorAll(`tr[data-uuid="${elementId}"]`);
    if (!selectedItemInArray || !selectedHtmlEles.length) return;

    const { isNameChanged, isUrlChanged, isCategoryChanged } = updateRowCells(selectedItemInArray, inputs, selectedHtmlEles, currentTarget);
      if (!(isNameChanged || isUrlChanged || isCategoryChanged)) return;

        clearMarks([inputs.nameInput, inputs.urlInput, inputs.categoryInput]);
        const changes = [
                            {
                                changed: isNameChanged,
                                key: "websiteName",
                                inputValue: normalizeStringsToLowerCased(inputs.nameInput.value),
                                modalKey: "currentUserWebsiteName",
                                message: UPDATE_MODAL_MESSAGES.websiteNameChanged,
                            },
                            {
                            changed: isUrlChanged,
                            key: "websiteURL",
                            inputValue: inputs.urlInput.value,
                            modalKey: "currentUserWebsiteLink",
                            message: UPDATE_MODAL_MESSAGES.websiteLinkChanged,
                            },
                            {
                            changed: isCategoryChanged,
                            key: "websiteCategory",
                            inputValue: inputs.categoryInput.value,
                            modalKey: "currentUserWebsiteCategory",
                            message: UPDATE_MODAL_MESSAGES.websiteCategoryChanged,
                            },
                        ];
        const modalValues = {};
        let modalMessage = "";

         changes.forEach(({ changed, key, inputValue, modalKey, message }) => {
            if (!changed) return;
            selectedItemInArray[key] = inputValue;
            modalValues[modalKey] = inputValue;
            modalMessage += `In line ${selectedItemInArray.elementOrder} ${message}\n`;
        });
        

        showCustomModal(modalMessage, 'update', {}, modalValues);
        searchCacheLogic.clearCachedDataMap();
        localStorage.setItem("allUrls", JSON.stringify(allUrls));
        clearRow(inputs);
        setSubmitMode(null, currentTarget);
  
};



export const deleteRow = (elementId, allUrls)=>{
    const elementIndexInArray = getElementIndexFromArrById(elementId, allUrls);
     if (elementIndexInArray === -1) {
        console.warn(`Element with id "${elementId}" not found.`);
        return false;
    };

    const rowsToDelete = document.querySelectorAll(`tr[id="${elementId}"]`);
    rowsToDelete.forEach(row => {
            row.remove();
    });

    allUrls.splice(elementIndexInArray, 1);

    if(allUrls.length) redefineUrlsIndexAfterDelete(allUrls) ;
    localStorage.setItem("allUrls", JSON.stringify(allUrls));
    searchCacheLogic.clearCachedDataMap();
};







