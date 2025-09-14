
// !!__Here i use only one modal in this project so i quered and calss showCustomModal fn insdie the class ,
// !!__and export it with this intalized obj below from class.

// ^^__At having more than one modal u can quering it in the file u need and intialize ModalManager with it ,
// ^^__but remeber to give this instance to showCustomModal fn below

import { ERROR_MESSAGES } from "../fixedData.js"
const _modal = document.querySelector('dialog');

class ModalManager {

  constructor(modalEl) {

    this.modal = modalEl;
    this.paragraph = this.modal.querySelector("p");
    this.rules = this.modal.querySelector(".rules");
    this.firstLine = this.rules?.querySelector('.nameLine') || null;
    this.secondLine = this.rules?.querySelector('.urlLine') || null;
    this.thirdLine = this.rules?.querySelector('.categoryLine') || null;
    this.closeBtn = this.modal.querySelector("button.cancel");
    this.isOpen = false;

 
    this.modal.setAttribute('role', 'dialog');

    
    // ^^Closing_Event_Handlers for (Close_Click / Click_Anywhere / Escape_Key):
    this.closeBtn?.addEventListener('click', () => this.close());
    if (this.isOpen) {
        this.close();
    }
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  
  _setRulesVisibility(show) {
    if (!this.rules) return;
    this.rules.classList.toggle('d-none', !show);
  }

   _changeModalLineText(line, lineText){
     const icon = line.querySelector("svg");
        line.textContent = "";  
        if (icon) line.appendChild(icon); 
        line.append(` ${lineText}`);
  }

  _setModalText(  mainMsg, firstLineText = ERROR_MESSAGES.nameInput, secondLineText = ERROR_MESSAGES.urlInput, 
                 thirdLineText = '') {
    if (this.paragraph) this.paragraph.textContent = mainMsg;
    if (this.firstLine) this._changeModalLineText(this.firstLine ,firstLineText);
    if (this.secondLine) this._changeModalLineText(this.secondLine ,secondLineText);
    if (this.thirdLine) this._changeModalLineText(this.thirdLine ,thirdLineText);
  }

 


  show(modalMessage, mode = 'add', duplicated = { isDuplicatedLink: false, isDuplicatedName: false }, modalValues = {}) {
  
    if (this.isOpen) {
      this._render(modalMessage, mode, duplicated, modalValues);
      return;
    }

    this._render(modalMessage, mode, duplicated, modalValues);


    this.isOpen = true;
    try { 
      this.modal.showModal(); 
    } catch (err) { 
      this.closeBtn?.focus();
      console.error(`can't show modal ${err}`);    
    }
   

  }

  _render(modalMessage, mode, duplicated, modalValues) {

    // May handle at empty modalValues a tostifyto ask for data or general message on modal to enter valid data

    if (duplicated?.isDuplicatedLink || duplicated?.isDuplicatedName) {
      const { currentTableLink = '', currentUserLink = '', currentTableLinkName = '', currentUserWebsiteName = '' } = modalValues || {};
 
      if (duplicated.isDuplicatedLink && duplicated.isDuplicatedName) {
        const firstLine = `Cell_Link: ${currentTableLink} Cell_Name: ${currentTableLinkName}`;
        const secondLine = `Your_link: ${currentUserLink} & Your_name :${currentUserWebsiteName}`;
        this._setModalText(modalMessage, firstLine, secondLine);
        this._setRulesVisibility(true);
        return;
      }else{

        if (duplicated.isDuplicatedLink) {
          this._setModalText(modalMessage, `These Links are the same`, `Cell link: ${currentTableLink}, your link: ${currentUserLink}`);
          this._setRulesVisibility(true);
          return;
        }
        if (duplicated.isDuplicatedName) {
          this._setModalText(modalMessage, `These Names are the same`, `Cell Name: ${currentTableLinkName}, your name: ${currentUserWebsiteName}`);
          this._setRulesVisibility(true);
          return;
        }
    }
  }

    
    if(mode === 'update'){
      const firstLineText = modalValues.currentUserWebsiteName ? `Website Name: ${modalValues.currentUserWebsiteName}` : 'No Change in Name';
      const secondLineText = modalValues.currentUserWebsiteink ? `Website URL: ${modalValues.currentUserWebsiteink}` : 'No Change in URL';
      const thirdLineText = modalValues.currentUserWebsiteCategory ? `Website Catgory: ${modalValues.currentUserWebsiteCategory}` : 'No Change in Category';
      this._setModalText(modalMessage, firstLineText, secondLineText, thirdLineText);
    }else{
      this._setModalText(modalMessage);
    }
    this._setRulesVisibility(mode === 'add' || mode === 'update');

  }

  close() {
    if (!this.isOpen) return;
    try { 
      this.modal.close(); 
    } catch (err) {
       this.closeBtn?.focus();
      console.error(`can't show modal ${err}`);    
    }

    this.isOpen = false;
  }
}


// expose single instance and keep same exported function name to avoid changing call sites
const modalManager = new ModalManager(_modal);
export const makeModalValuesForCruds = (duplicationObj)=>{

          let modalValues = {};

          if(duplicationObj.isDuplicatedName){
              modalValues.currentUserWebsiteName = duplicationObj.currentUserWebsiteName; 
              modalValues.currentTableLinkName = duplicationObj.currentTableLinkName;
              
          }if(duplicationObj.isDuplicatedLink){
              modalValues.currentUserLink = duplicationObj.currentUserLink; 
              modalValues.currentTableLink = duplicationObj.currentTableLink;
          }
          
          return { modalValues }
};



export const showCustomModal = (modalMessage, mode = 'add', duplicated = {isDuplicatedLink:false, isDuplicatedName:false}, 
                                  modalValues = {}) => {
     
  modalManager.show(modalMessage, mode, duplicated, modalValues);
};






// OLD Precudural Code:

/*
  const changeModalLines = (modalParagrapgh, firstLine, secondLine, modalMessage, firstLineMessage, secondLineMessage)=>{
      modalParagrapgh.textContent = modalMessage;
      firstLine.textContent = firstLineMessage;
      secondLine.textContent = secondLineMessage;
  }


  const checkModalValues = (duplicated, modalParagrapgh, modalListOfRules, modalMessage, modalValues)=>{

      const { isDuplicatedLink, isDuplicatedName } = duplicated;
      const firstLine = modalListOfRules.querySelector('.nameLine');
      const secondLine = modalListOfRules.querySelector('.urlLine');
      const { currentTableLink, currentUserLink, currentTableLinkName, currentUserWebsiteName } = modalValues;

      if(isDuplicatedLink && isDuplicatedName){
          const firstLineMessage = `Cell_Link: ${currentTableLink} Cell_Name: ${currentTableLinkName}`;
          const secondLineMessage = `Your_link: ${currentUserLink} & Your_name :${currentUserWebsiteName}`;
          changeModalLines(modalParagrapgh, firstLine, secondLine, modalMessage, firstLineMessage, secondLineMessage);
          modalListOfRules.classList.remove('d-none');
          return;
      }

      if(isDuplicatedLink){
          const firstLineMessage = `These Links are the same`;
          const secondLineMessage = `Cell link: ${currentTableLink}, your link: ${currentUserLink}`;
          changeModalLines(modalParagrapgh, firstLine, secondLine, modalMessage, firstLineMessage, secondLineMessage);
          modalListOfRules.classList.remove('d-none');
          return;
      }

      if(isDuplicatedName){
          const firstLineMessage = `This Names are the same`;
          const secondLineMessage =  `Cell Name: ${currentTableLinkName}, your name: ${currentUserWebsiteName}`;
          changeModalLines(modalParagrapgh, firstLine, secondLine, modalMessage, firstLineMessage, secondLineMessage);
          modalListOfRules.classList.remove('d-none');
          return;
      }
      
  };
      
  export const showCustomModal = ( modalMessage, mode, duplicated={isDuplicatedLink:false, isDuplicatedName:false}, modalValues={})=>{
      const modalParagrapgh = modal.querySelector("p");
      const modalListOfRules = modal.querySelector(".rules");


      if(duplicated.isDuplicatedLink | duplicated.isDuplicatedName){
          checkModalValues(duplicated, modalParagrapgh, modalListOfRules, modalMessage, modalValues);
      }
      else{
          modalParagrapgh.textContent = modalMessage;
          if(mode === 'add') modalListOfRules.classList.remove('d-none');
          else modalListOfRules.classList.add('d-none');
          
      }
    
      modal.showModal();
  };


  modal.querySelector("button.cancel").addEventListener("click", () => {
      modal.close();
  }); 

  */