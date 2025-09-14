'use strict'

import {    UPDATE_MODAL_MESSAGES   } from './fixedData.js'
import {    displayDataFormInputs   } from './createElements/createUrlsForm.js'
import {    attemptAddUrl, commitRowUpdate, cancelUpdate  } from './tableManipulation/tableCruds.js'
import {    displayRowsInTableSelected, showPlaceholderTable } from './createElements/createTableSegments.js'

import {    toggleRowBtns, makeDebouncedFn, toggleTableBtnDisability, 
            getCurrentTableBody, removeAllChilds, tableRowBtnsEventHandler} from "./utils/utils.js"
            
import {    toggleTableBody, getFormInputs   } from './utils/searchUtils.js';
import {    getSelectedSortingMethod, highlightSortOption, 
            highlightDropdown, sorting } from './utils/sortingUtils.js'


import {    setTheme, storageKey, getSystemPreference, toggleMode } from './utils/colorMode.js'
import {    exportTable } from './utils/dataSaving.js'
import {    checkName, checkUrl } from './validation/checkInputs.js'
import {    showCustomModal } from  './modal/modal.js'






// ^^===================================APPLY-THEME=====================================>
    setTheme( localStorage.getItem(storageKey) || getSystemPreference() );
// ^^===================================APPLY-THEME=====================================>


// !!===================================SYS-LISTENER=====================================>
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
     });
// !!===================================SYS-LISTENER=====================================>

// ^^=============================================INTALIZING===============================================>
    
    displayDataFormInputs(document.getElementById('inputSectionContainer'));
    const inputs = getFormInputs();

     
    const rowsTableBody = document.getElementById('allDataTableBody');
    let allUrls = JSON.parse(localStorage.getItem("allUrls") || "[]") || [];
    if(allUrls.length !== 0) displayRowsInTableSelected(rowsTableBody, allUrls)
        else showPlaceholderTable(rowsTableBody);

    let isValidName = null, isValidUrl = null;
    const dataMainpulationBtnsParent = document.getElementById("changing-btn");
    const debouncedUpdateButton = makeDebouncedFn(() => {
        toggleTableBtnDisability(isValidName, isValidUrl?.valid || isValidUrl, dataMainpulationBtnsParent.firstElementChild);
    }, 300);
      

// ^^=============================================INTALIZING===============================================>

// !!====================================SELECTING=====================================>
    const cancelBtn = document.getElementById("cancel-btn");
    const toggleBtn = document.getElementById('modeToggleBtn');
    const submitBtn = document.getElementById("submitBtn");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const selectInput = document.getElementById("select-input");

    const tableHead = document.getElementById('table-head');
    const filteredSearchTable = document.getElementById("filteredDataTableBody");
    const savingToolBar = document.getElementById('save-to-file-toolbar');
// !!====================================SELECTING=====================================>

    toggleMode(toggleBtn);
    submitBtn.setAttribute('disabled', true);
  
// ^^==========================================LISTEN_TO_ROWS_BTNS==========================================>

    rowsTableBody.addEventListener("click",(event)=>{
        // ** Delte , Update, Visit and Pinning:
        tableRowBtnsEventHandler(event, rowsTableBody, false, allUrls, inputs, submitBtn, cancelBtn);
    });

    filteredSearchTable.addEventListener("click",(event)=>{
        // ** Delte , Update and Visit:
        const noFilteredTable = filteredSearchTable.classList.contains('d-none');
        if(noFilteredTable) return;
        tableRowBtnsEventHandler(event, filteredSearchTable, true, allUrls, inputs, submitBtn, cancelBtn);

    });

// ^^==========================================LISTEN_TO_ROWS_BTNS==========================================>

// ??==================================LISTEN_TO_PARENT_OF_SUBMIT_BTN========================================>
    dataMainpulationBtnsParent.addEventListener("click", (e)=>{
        const target = e.target;
        if (!target || !target.dataset.mode) return;
        
        const submitBtn = e.currentTarget.querySelector("#submitBtn");
        const isSubmitDisabled = submitBtn?.disabled;

        if (target.id === "cancel-btn" && target.dataset.mode === "cancel") {
            return cancelUpdate(target, inputs, submitBtn);
        }

        if (target.id === "submitBtn") {
            const mode = target.dataset.mode;

            if (isSubmitDisabled) {
            const modalMessage = mode === "update"
                ? UPDATE_MODAL_MESSAGES.noChange
                : "Site Name or Url is not valid, Please follow the rules below :";
            return showCustomModal(modalMessage, mode);
        }
        
        const isValid = isValidName && isValidUrl.valid;
        if (mode === "add") {
         
            attemptAddUrl(isValid, inputs, isValidUrl.websiteImg, allUrls, rowsTableBody);
            debouncedUpdateButton();
            if (isValid) {
                isValidName = null;
                isValidUrl = null;
            }
        }

        if (mode === "update") {
            if (isValid) {
                commitRowUpdate(submitBtn, allUrls, inputs);
                toggleRowBtns(cancelBtn);
                isValidName = null;
                isValidUrl = null;
            } else {
                const modalMessage = !isValidName
                ? "Please Update website name OR Click on Cancel Update Button"
                : "Please Update website link OR Click on Cancel Update Button";
                showCustomModal(modalMessage, "update");
            }
            debouncedUpdateButton();
        }
    }
           
    });
// ??==================================LISTEN_TO_PARENT_OF_SUBMIT_BTN========================================>




// ^^==========================================SEARCH_EVENT_HANDLERS==========================================>
    searchBtn.addEventListener("click",()=>{
        toggleTableBody(searchInput, allUrls, rowsTableBody, filteredSearchTable); 
    });

    searchInput.addEventListener("keypress",(e)=>{
        if(e.key === 'Enter'){
            toggleTableBody(searchInput, allUrls, rowsTableBody, filteredSearchTable); 
        }
    });

    selectInput.addEventListener("click", (e)=>{
        const currentCategorySelected = e.target.value;
        if(currentCategorySelected === 'all'){ 
            searchInput.value= '';
            searchInput.setAttribute('disabled', true)
            toggleTableBody(searchInput, allUrls, rowsTableBody, filteredSearchTable);
        }
        else{
            searchInput.removeAttribute('disabled');
        }
    })
// ^^==========================================SEARCH_EVENT_HANDLERS==========================================>

// ^^==========================================SORTING_EVENT_HANDLER==========================================>

    tableHead.addEventListener('click',(eventObj)=>{
        const clickedList = eventObj.target.closest('.dropdown-menu li');

        if (clickedList){
            highlightSortOption(clickedList);
            const dropdownBtn = clickedList.closest('.btn-group')?.querySelector('button');
            if(dropdownBtn) highlightDropdown(dropdownBtn);
            
            getSelectedSortingMethod(eventObj);
            const table = tableHead.parentNode;
            const currentTableBody = getCurrentTableBody(table);
            if(currentTableBody){
                const sortedData = sorting(allUrls, currentTableBody);
                if(sortedData){
                    removeAllChilds(currentTableBody);
                    console.log(sortedData, currentTableBody);

                    displayRowsInTableSelected(currentTableBody, sortedData)
                }

            }else{
                showCustomModal('You have no Table Found please contact with website developer', 'sort', 
                                { isDuplicatedLink: false, isDuplicatedName: false }, {})
            }
            
        }

    });

// ^^==========================================SORTING_EVENT_HANDLER==========================================>

    
// ^^==========================================SAVE-DATA-INTO-FILE==========================================>

    savingToolBar.addEventListener("click", (event)=>{
        const currentTargetId = event.target.id;
        if(currentTargetId === 'exportCsv'){
            exportTable(rowsTableBody, allUrls, "csv")
        }else if (currentTargetId === 'exportJson'){
            exportTable(rowsTableBody, allUrls, "json")
        }else if (currentTargetId === 'exportTxt'){
            exportTable(rowsTableBody, allUrls, "txt")
        }

    });

// ^^==========================================SAVE-DATA-INTO-FILE==========================================>


// !!==========================================VALIDATION==============================================>

    inputs.nameInput.addEventListener("input",(e)=>{
        isValidName = checkName(e.currentTarget);
        if(!isValidUrl) isValidUrl =  checkUrl(inputs.urlInput);
        debouncedUpdateButton();
    });

    inputs.urlInput.addEventListener("input",(e)=>{
        if(!isValidName) isValidName =  checkName(inputs.nameInput);
        isValidUrl = checkUrl(e.currentTarget);
        debouncedUpdateButton(); 
    });

 
// !!==========================================VALIDATION==============================================>
    



