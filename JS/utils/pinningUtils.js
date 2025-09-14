import { getElementIndexFromArrById } from './utils.js'

const  togglePin = (allUrls, pinEleIndex)=>{
        return allUrls[pinEleIndex].pinned = !(allUrls[pinEleIndex].pinned);     
}

const  updatePinIcon = (pinEleIcon, isPinned)=>{

    if (!pinEleIcon) return;
    if (isPinned) {
        pinEleIcon.classList.add('pinned-icon', 'fa-thumbtack');
        pinEleIcon.classList.remove('fa-thumbtack-slash');
    } else {
        pinEleIcon.classList.remove('pinned-icon', 'fa-thumbtack');
        pinEleIcon.classList.add('fa-thumbtack-slash');
    }
}

const insertAboveByPinning = (pinHtmlTdElement, pinEleIndex, allUrls, currentTable)=>{
    const pinnedTrEle = pinHtmlTdElement.parentNode;

    if(!pinnedTrEle) return;

    // ^^ Change element in arr into 1st;
    const [splicedUrl] = allUrls.splice(pinEleIndex, 1);
    allUrls.splice(1, 0, splicedUrl);
 

    // ^^ Change element in HTML Table into 1st;
    currentTable.removeChild(pinnedTrEle);
    currentTable.prepend(pinnedTrEle);

    localStorage.setItem('allUrls', JSON.stringify(allUrls));
};

const getLastPinnedElement = (table)=>{
   
    const allPinnedElements = table.querySelectorAll('tr td.index svg.pinned-icon');
    let allTr = [];
    allPinnedElements.forEach((pinnedIcon)=>{
        const trEle = pinnedIcon.closest('tr');
        if(trEle) allTr.push(trEle)
    });

    const lastPinnedTrElement = allTr.at(-1);
    return lastPinnedTrElement
 
}

const getFirstUnpinnedElementIndex = (table)=>{

    const firstUnPinnedElement = table.querySelector('tr td.index svg.fa-thumbtack-slash ');
    return firstUnPinnedElement ? firstUnPinnedElement.closest('tr') : null;
 
}


const insertBackByOriginalOrderAfterUnPinning = (pinHtmlTdElement, allUrls, currentTable) => {
    const lastPinnedTrELementInHtml = getLastPinnedElement(currentTable);
    // const FirstUnpinnedTrELementInHtml = getFirstUnpinnedElementIndex(currentTable);
  const pinnedTrEle = pinHtmlTdElement.parentNode;
  if (!pinnedTrEle) return;

  const pinnedEleOriginalOrder = Number(pinHtmlTdElement.dataset.id);
  const pinnedTrEleIndexInUrlArr = getElementIndexFromArrById(pinnedTrEle.id, allUrls);

  // ^^ Remove element from array
  const [unpinnedUrl] = allUrls.splice(pinnedTrEleIndexInUrlArr, 1);

  // ^^ Find the correct sibling in DOM
  const nextSibling = currentTable.querySelector(
    `td[data-id="${pinnedEleOriginalOrder + 1}"]`
  )?.parentNode;

  if (lastPinnedTrELementInHtml && nextSibling) {
    // Case 1: We have pinned rows AND a next sibling
    if (Number(nextSibling.querySelector("td").dataset.id) > pinnedEleOriginalOrder) {
      // Insert after the last pinned
      lastPinnedTrELementInHtml.insertAdjacentElement("afterend", pinnedTrEle);
      const lastPinnedIndex = getElementIndexFromArrById(lastPinnedTrELementInHtml.id, allUrls);
      allUrls.splice(lastPinnedIndex + 1, 0, unpinnedUrl);
    } else {
      // Insert before the correct next sibling
      nextSibling.insertAdjacentElement("beforebegin", pinnedTrEle);
      const nextSiblingIndex = getElementIndexFromArrById(nextSibling.id, allUrls);
      allUrls.splice(nextSiblingIndex, 0, unpinnedUrl);
    }
  } else if (lastPinnedTrELementInHtml) {
    // Case 2: Only pinned rows exist, no sibling
    lastPinnedTrELementInHtml.insertAdjacentElement("afterend", pinnedTrEle);
    const lastPinnedIndex = getElementIndexFromArrById(lastPinnedTrELementInHtml.id, allUrls);
    allUrls.splice(lastPinnedIndex + 1, 0, unpinnedUrl);
  } else if (nextSibling) {
    // Case 3: No pinned rows, but we found a sibling
    nextSibling.insertAdjacentElement("beforebegin", pinnedTrEle);
    const nextSiblingIndex = getElementIndexFromArrById(nextSibling.id, allUrls);
    allUrls.splice(nextSiblingIndex, 0, unpinnedUrl);
  } else {
    // Case 4: Fallback → append to the end
    currentTable.appendChild(pinnedTrEle);
    allUrls.push(unpinnedUrl);
  }

  localStorage.setItem("allUrls", JSON.stringify(allUrls));
};


export const pinning = (pinHtmlTdElement, pinEleIcon, allUrls, currentTable)=>{

        const pinEleIndex = getElementIndexFromArrById(pinHtmlTdElement.parentNode.id ,allUrls);
        const isPinned = togglePin(allUrls, pinEleIndex);
        updatePinIcon(pinEleIcon, isPinned);
    
        if(isPinned) insertAboveByPinning(pinHtmlTdElement, pinEleIndex, allUrls,  currentTable)
            else insertBackByOriginalOrderAfterUnPinning(pinHtmlTdElement, allUrls, currentTable);
       
}


