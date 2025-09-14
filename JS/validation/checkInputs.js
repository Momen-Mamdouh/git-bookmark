import { SITE_NAME_REGEX, SITE_URL_REGEX , ERROR_MESSAGES, SUCCESS_INPUT_CLASS, FAILED_INPUT_CLASS} from "../fixedData.js"

const isValidURL = (url)=>{
  // !! Here in url we return obj not only boolean as here we construct icon of url too not nly valid or inValid url.
  try {
    const urlObj = new URL(url);

    if(urlObj.protocol === "http:") {
      return {valid:true, websiteImg: false};
    }
    return {valid:true, websiteImg: `${urlObj.origin}/favicon.ico`};

  } catch (e) {
    return {valid:false, websiteImg: false};;
  }
};

const inputErrorEle = ()=>{
    const errorMessageEle = document.createElement("p");
    errorMessageEle.className = 'alert alert-warning';
    errorMessageEle.setAttribute("role", "alert");
    errorMessageEle.style.display = 'none';
    return errorMessageEle
};
const getErrorEle = (inputParentDiv)=>{
    let errorElement = inputParentDiv.querySelector('.alert');
    if (!errorElement) {
      errorElement = inputErrorEle();
      inputParentDiv.appendChild(errorElement);
    };
    return errorElement
};


const toggleErrorMessage = (errorElement, isValid, errorMessage)=>{
        if(isValid) errorElement.style.display = 'none';
        else{
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block'; 
        }
};
const toggleMark = (inputParent, isValid)=>{
    inputParent.classList.toggle(SUCCESS_INPUT_CLASS, isValid);
    inputParent.classList.toggle(FAILED_INPUT_CLASS, !isValid);
};

const validateInput = (inputElement, regex, errorMessage)=>{
    const inputValue = inputElement.value.trim();
    const inputParent = inputElement.parentElement;
    
    if(inputValue == ""){
        const existingError = inputParent.querySelector('.alert');
        if (existingError) existingError.style.display = 'none';
        inputParent.classList.remove(SUCCESS_INPUT_CLASS, FAILED_INPUT_CLASS);
        return false;
    }

    let isValid;
    if(regex === SITE_URL_REGEX){
 
        isValid = isValidURL(inputValue);
        toggleMark(inputParent, isValid.valid);
        const errorElement = getErrorEle(inputParent);
        toggleErrorMessage(errorElement, isValid.valid, errorMessage);
    }else{
        isValid = regex.test(inputValue);
        toggleMark(inputParent, isValid);
        const errorElement = getErrorEle(inputParent);
        toggleErrorMessage(errorElement, isValid, errorMessage);
    }

    return isValid;
  
};


export const checkName = (nameInput)=>{   
        const errorMessage = ERROR_MESSAGES.nameInput;
        return validateInput(nameInput, SITE_NAME_REGEX, errorMessage); 
};

export const checkUrl = (urlInput)=>{
        const errorMessage = ERROR_MESSAGES.urlInput;
        return validateInput(urlInput, SITE_URL_REGEX, errorMessage);
};  


