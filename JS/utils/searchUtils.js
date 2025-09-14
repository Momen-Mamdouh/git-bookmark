'use strict'
import { showCustomModal } from  '../modal/modal.js'
import { BASIC_CATEGORIES } from '../fixedData.js'
import { removeAllChilds, normalizeStringsToLowerCased } from  "./utils.js"
import { displayRowsInTableSelected }  from '../createElements/createTableSegments.js'
import { CachingData }  from './cachingData.js'


const selectInput = document.getElementById("select-input");
export const searchCacheLogic = new CachingData(); 


const categoriesFilter = (urlsArr, userSearchCategory, userSearchValue)=>{
        
        let filteredArr = [], urlLines = [];
        urlsArr.forEach((url)=>{
            const isTheSame = String(url[userSearchCategory]).startsWith(String(userSearchValue));

            if(isTheSame){
                filteredArr.push(url);
                urlLines.push(url.elementOrder);
            };
        });
        return {filteredArr, urlLines}

};
const toggleCachedBodies = (allDataTable, filteredDataTable, isDisplayedFilteredSearchTable)=>{
     const isDisplayedAllDataTable = allDataTable.classList.contains('d-none');
    if (isDisplayedAllDataTable) allDataTable.classList.toggle('d-none');
    if (isDisplayedFilteredSearchTable) filteredDataTable.classList.toggle('d-none');
    return;
};
export const getFormInputs = ()=>{
    const inputsHtmlCollection = document.querySelectorAll('.data-of-table-inputs-section input');
    const inputs = {} ;

    for(let i=0; i < inputsHtmlCollection.length; i++){
        const currentInput = inputsHtmlCollection[i]
        inputs[currentInput.id] = currentInput;
        
    };
    return inputs;
};
export const getCategorySelected = ()=>{
    const selectedCategory = selectInput.value;
   
    if (BASIC_CATEGORIES.includes(selectedCategory)) {
        return { categoryType: 'basic', selectedCategory };
    }else if(selectedCategory === 'all'){
        return { categoryType: 'all', selectedCategory };
    }

    return { categoryType: 'custom', selectedCategory };
};


export const filterData =  (searchInput, urlsArr, allDataTable, filteredDataTable)=>{

    const tableCacheKey = filteredDataTable.dataset._lastCacheKey;
    const isDisplayedFilteredSearchTable = filteredDataTable.classList.contains('d-none');
    let lastCachedKey = searchCacheLogic.getLastCacheKey();
    let cachedData = null;

    if(lastCachedKey === tableCacheKey && isDisplayedFilteredSearchTable){
        cachedData = searchCacheLogic.getDataByKey(lastCachedKey);
        toggleCachedBodies(allDataTable, filteredDataTable, isDisplayedFilteredSearchTable);
    }

    else{
        const userSearch = normalizeStringsToLowerCased(searchInput.value);
        
        if (!userSearch) return;
        const {categoryType, selectedCategory} = getCategorySelected();
  

        const cacheKey = searchCacheLogic.createCacheKey(categoryType, userSearch);
        searchCacheLogic.updateCacheKey(cacheKey);
        filteredDataTable.dataset._lastCacheKey = cacheKey;

        if(categoryType === 'all'){
            toggleCachedBodies(allDataTable, filteredDataTable, isDisplayedFilteredSearchTable);
            return;
        }
        else if(categoryType === 'basic'){
            const {filteredArr, urlLines} = categoriesFilter(urlsArr, selectedCategory, userSearch);
         
            cachedData = searchCacheLogic.addDataInCachedMap(filteredArr, urlLines);
        }
   
        removeAllChilds(filteredDataTable);
        displayRowsInTableSelected(filteredDataTable, cachedData.dataArr);
    }

    if (cachedData.dataArr.length === 0) {
          // ^^ At Having no filtered Data
        const modalMessage = `This Website isn't added in your bookmarks`;
        showCustomModal(modalMessage, 'search', { isDuplicatedLink: false, isDuplicatedName: false }, {});

        if (selectInput.value === 'websiteName') {
            inputs.nameInput.value = searchInput.value;
            inputs.nameInput.focus();

        } 
        else if (selectInput.value === 'websiteURL') {
            inputs.urlInput.value = searchInput.value;
            inputs.urlInput.focus();
        }
         else if (selectInput.value === 'websiteURL') {
            inputs.urlInput.value = searchInput.value;
            inputs.urlInput.focus();
        }

        return;
    };

    // ^^ Display Filtered Data from Any Category
    const lines = String(cachedData.urlLines);
    const modalMessage = `This Website is found in line(s) ${lines}`;
    showCustomModal(modalMessage, 'search', { isDuplicatedLink: false, isDuplicatedName: false }, {});

};
    
export const toggleTableBody = (searchInput, allUrls, allDataTable, filteredDataTable) => {
    const searchInputValue = searchInput.value.trim();
    if (searchInputValue !== "" ) {
        filterData(searchInput, allUrls, allDataTable, filteredDataTable);
        allDataTable.classList.add('d-none');
        filteredDataTable.classList.remove('d-none');
        
    } else {
        allDataTable.classList.remove('d-none');
        filteredDataTable.classList.add('d-none');
    }
};


