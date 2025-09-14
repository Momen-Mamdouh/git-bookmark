
import { createGenericEle, mainButtonEle, mainIconEle } from './createElementsUtils.js'
import { DATA_INPUTS_CONFIG, FORM_BTNS_CONFIGS } from "../fixedData.js"


   
// ^^==================================CREATION==================================>

    const createInputELe = (divPrefix, inputPrefix, inputPlaceHolder, labelText, icon)=>{
        const inputDivSelectors = {id:`checkId${divPrefix}`, class:`check-input`};
        const inputSelectors = {id:`${inputPrefix}Input`, class:`${inputPrefix}Input-class form-control mb-4`, type:`text`, placeholder: inputPlaceHolder};
        const inputLableSelectors = {for: inputSelectors.id, class:`mb-2 fw-bold`, text:labelText};

        const inputDivElement = createGenericEle('div', inputDivSelectors);
        const inputElement = createGenericEle('input', inputSelectors);
        const labelIcon = mainIconEle(icon);
        const inputLableElement = createGenericEle('label', inputLableSelectors);
        
        appendingElementsInInputDiv(inputDivElement, inputElement, inputLableElement, labelIcon);
        return inputDivElement;

    }

    const createFormBtns = ()=>{
        const inputDivSelectors = {id:`changing-btn`, class:`m-auto   text-center flex  items-center justify-content-center`};
        const btnsDiv = createGenericEle('div', inputDivSelectors);

        FORM_BTNS_CONFIGS.forEach((config)=>{
            const button = mainButtonEle();
            Object.entries(config).forEach(([key, value])=>{
                if(key !== 'text'){
                    button.setAttribute(key, value);
                }else{
                    button.textContent = value;
                }
            
            })

            btnsDiv.appendChild(button);
        });
       
  
        return btnsDiv
    }

    const getInputElements= ()=>{
        const inputsArr = [];
        DATA_INPUTS_CONFIG.forEach((input)=>{
            const inputEle = createInputELe(input.divPrefix, input.inputPrefix, input.inputPlaceHolder, input.labelText, input.labelIcon)
            inputsArr.push(inputEle)
        })
        return inputsArr
    }


// ^^==================================CREATION==================================>
        
// ^^==================================APPENDING==================================>

    const appendingElementsInInputDiv = (div, input, label, labelIcon)=>{
        label.prepend(labelIcon);
        div.appendChild(label);
        div.appendChild(input);
       
    }

// ^^==================================APPENDING==================================>


// ^^==================================VIEW==================================>
    
    export const displayDataFormInputs =   (inputsSection)=>{
        const dataFragment =  document.createDocumentFragment();
        const inputElements = getInputElements();
        const btnsDiv = createFormBtns();

        inputElements.forEach((input)=>{
            dataFragment.appendChild(input);
        });

        dataFragment.appendChild(btnsDiv);
        inputsSection.appendChild(dataFragment);
        
        
    };


// ^^==================================VIEW==================================>
   