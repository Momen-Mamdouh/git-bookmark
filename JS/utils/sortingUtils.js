import { changeStyleForCachedEle } from './utils.js'
import { CachingData } from './cachingData.js'
import {showCustomModal} from '../modal/modal.js'

const sortCacheLogic = new CachingData(); 
let sotingMethodObj = {}, prevSortingList, prevSortingDropDown, cachedData = null;
const toggledStyle = 'active-sorted-ele';



export const getSelectedSortingMethod = (eventObj)=>{
    sotingMethodObj.sortingMethod = eventObj.target.textContent.trim().toLowerCase();
    sotingMethodObj.lineToSort =  eventObj.target.id;
    return  sotingMethodObj
};

export const highlightSortOption = (clickedList)=>{
    changeStyleForCachedEle(prevSortingList, clickedList, toggledStyle)     
    prevSortingList = clickedList;         
};
export const highlightDropdown = (clickedDropdown)=>{
    changeStyleForCachedEle(prevSortingDropDown, clickedDropdown, 'btn-warning');
    prevSortingDropDown = clickedDropdown;
};


export const sorting = (allUrls, table) => {
    const { sortingMethod, lineToSort } = sotingMethodObj;
    const line = lineToSort.split('-')[1];

    let tableCacheKey = table.dataset._lastSortedCacheKey;
    let lastCachedKey =
        sortCacheLogic.getLastCacheKey() ||
        sortCacheLogic.createCacheKey(lineToSort, sortingMethod);

    const cachedEntry = sortCacheLogic.getDataByKey(lastCachedKey);

    //^^ Split pinned from unpinned
    const pinned = allUrls.filter(item => item.pinned);
    const unpinned = allUrls.filter(item => !item.pinned);

    //^^ Only sort the unpinned ones
    const sortedUnpinned = quickSorting(unpinned, line, sortingMethod);

    //^^ Merge pinned (untouched) + sorted unpinned
    const newData =sortedUnpinned;

    if (lastCachedKey === tableCacheKey && cachedEntry) {
        const isSame = sortCacheLogic.checkCacheChange(
            cachedEntry.dataArr,
            newData
        );

        if (isSame) {
            const modalMessage = `Data in line ${line} already sorted ${sortingMethod}gly`;
            showCustomModal(
                modalMessage,
                'sort',
                { isDuplicatedLink: false, isDuplicatedName: false },
                {}
            );
            return;
        }
    }

    if (cachedEntry) {
        sortCacheLogic.updateDataInCachedMapByKey(
            lastCachedKey,
            newData,
            lineToSort
        );
        table.dataset._lastSortedCacheKey = lastCachedKey;
    } else {
        sortCacheLogic.addDataInCachedMap(newData, lineToSort);
        table.dataset._lastSortedCacheKey = lastCachedKey;
    }

    return newData;
};


const bubbleSorting = (allUrls, line, sortingMethod)=>{
    // !! Bubble_Sorting:

    let sortedData = [...allUrls];
    const firstLoopLength = sortedData.length -1; // ^^ We substract 1 as  After (L-1) outer iterations, the array is guaranteed sorted.

    for (let i = 0; i < firstLoopLength; i++) {
        // ^^ We can substract 1 to avoid re-checking the already sorted part, which is in the end now by swapping to next
        const currentItearationLength = firstLoopLength - i; 
        for (let j = 0; j < currentItearationLength; j++) {
            const nextElementIndex = j + 1;
            let swapConditon;
            if(sortingMethod ===  'ascending') swapConditon = sortedData[j][line] > sortedData[nextElementIndex][line];
            else if(sortingMethod ===  'descending')  swapConditon = sortedData[j][line] < sortedData[nextElementIndex][line];
            if (swapConditon) {
                const temp = sortedData[j];
                 sortedData[j] = sortedData[nextElementIndex];
                 sortedData[nextElementIndex] = temp;
            }
        }
        
    }

    return sortedData;


}

const selectionSorting = (allUrls, line, sortingMethod)=>{
    let sortedData = [...allUrls];
    const loopLength = sortedData.length; 

    for (let i = 0; i < loopLength; i++) {
        let selectedIndex = i;

        for (let j = 0; j < currentItearationLength; j++) {
            let swapConditon =  sortingMethod === 'ascending'   ?  sortedData[j][line] < sortedData[selectedIndex][line] 
                                                                :  sortedData[j][line] > sortedData[selectedIndex][line];
            if (swapConditon) {
                selectedIndex = j;
            }
        }

        if(selectedIndex !==  i){
            const temp = sortedData[i];
            sortedData[i] = sortedData[selectedIndex];
            sortedData[selectedIndex] = temp;
        }
       
        
    }

    return sortedData;
}


const quickSorting = (arr, line, sortingMethod) => {
  if (arr.length <= 1) return arr; // base case
 

  const middleIndex = Math.floor(arr.length / 2); 
  const middle = arr[middleIndex];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (i === middleIndex) continue; // skip middle

    let condition =
      sortingMethod === "ascending"
        ? arr[i][line] < middle[line]
        : arr[i][line] > middle[line];

    if (condition) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // Recursively sort left + right, then combine
  return [...quickSorting(left, line, sortingMethod), middle, ...quickSorting(right, line, sortingMethod)];
};
