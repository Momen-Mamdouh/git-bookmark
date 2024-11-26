var allProducts = [];
if (localStorage.getItem("AllProducts") !=null){
    allProducts = JSON.parse(localStorage.getItem("AllProducts"));  
    displayRow();
}


// ~===========================SELECTING=============================>

var websiteName = document.getElementById('site-name');
var websiteUrl = document.getElementById('site-url');

var siteNameRegx = /[a-z A-Z]{3,}[0-9]{0,}/;
var siteUrlRegx = /^(https:\/\/|http:\/\/)?(www.)?[a-z]{0,}[0-9]{0,}.com/;

var wbsiteIdName =  document.getElementById('checkIdName');
var websiteIdUrl =  document.getElementById('checkIdUrl');

var changedButtonDiv = document.getElementById('changing-btn');


var checkState;
var rightCheckMark = "checkMarkSuccess" ;
var wrongCheckMark = "checkMarkFailed" ;
var rightInputState = "input-is-right";
var wrongInputState = "input-is-wrong";

var modal = document.querySelector('.my-modal')
// ~===========================SELECTING=============================>





// !===========================VIEW-DATA=============================>
    
function addNewProcut(){
    if(checkName() && checkUrl()){
        
        var newProduct = {
            nameWebsite: websiteName.value,
            urlWebsite: websiteUrl.value,
        }
        
        allProducts.push(newProduct);
        
        localStorage.setItem("AllProducts", JSON.stringify(allProducts));
        clearRow();
        displayRow();
       
       
        
    }

    else{
        modal.showModal();
       
    }
}


function clearRow(){
     websiteName.value = "";
     websiteUrl.value = "";
}

function displayRow(){
    var displayedProducts = '';

     for (var i=0; i< allProducts.length; i++){

       displayedProducts = displayedProducts +  ` 
            <tr class="border-top text-center">
                <td class=" py-3 ">${i+1}</td>
                <td class=" py-3 ">${allProducts[i].nameWebsite}</td>

                <td class=" py-3 ">

                    <a href="${allProducts[i].urlWebsite}" target="_blank"  > <button class="btn p-2  btn-outline-success"><i class="fa-solid fa-eye pe-2"></i> Visit</button></a>

                </td>

                <td class=" py-3 ">
                    <button onclick="viewData(${i})" class="btn p-2  btn-outline-warning"><i class="fa-solid fa-edit pe-2"></i> Update</button>

                </td>

                <td class=" py-3 ">
                    <button onclick="deleteData(${i})" class="btn p-2  btn-outline-danger"><i class="fa-solid fa-trash pe-2"></i>Delete</button>

                </td>
            </tr>
        `
     }
     document.getElementById('data-rows').innerHTML = displayedProducts;

 
}
// !===========================VIEW-DATA=============================>



// !===========================DELETING=============================>
function deleteData(indx){
        allProducts.splice(indx,1)
        localStorage.setItem("AllProducts", JSON.stringify(allProducts));
        displayRow();
}
// !===========================DELETING=============================>




// !===========================UPDATING=============================>


function viewData(indx){
    websiteName.value = allProducts[indx].nameWebsite;
    websiteUrl.value = allProducts[indx].urlWebsite;
    changedButtonDiv.innerHTML = `<button onclick="updateData(${indx})" class="btn btn-warning m-auto ">Update</button>`
}


function updateData(indx){
     var newProduct = {
        nameWebsite: websiteName.value,
        urlWebsite: websiteUrl.value,
    }
    
     allProducts.splice(indx,1,newProduct)    
     localStorage.setItem("AllProducts", JSON.stringify(allProducts));
     changedButtonDiv.innerHTML = `<button onclick="addNewProcut()" class="changedButton btn btn-danger">Submit</button>`

     displayRow();
     clearRow();
    
}
// !===========================UPDATING=============================>


// !===========================SEARCHING=============================>
function searchForElement(searchInputValue){
    var displayedProducts = ''
    for(var i = 0; i < allProducts.length; i++){
        if(allProducts[i].nameWebsite.toLowerCase().includes(searchInputValue) ||
            allProducts[i].urlWebsite.toLowerCase().includes(searchInputValue)){
                displayedProducts = displayedProducts +  ` 
            <tr class="border-top text-center">
                <td class=" py-3 ">${i+1}</td>
                <td class=" py-3 ">${allProducts[i].nameWebsite}</td>

                <td class=" py-3 ">

                    <a href="${allProducts[i].urlWebsite}" target="_blank"  > <button class="btn p-2  btn-outline-success"><i class="fa-solid fa-eye pe-2"></i> Visit</button></a>

                </td>

                <td class=" py-3 ">
                    <button onclick="viewData(${i})" class="btn p-2  btn-outline-warning"><i class="fa-solid fa-edit pe-2"></i> Update</button>

                </td>

                <td class=" py-3 ">
                    <button onclick="deleteData(${i})" class="btn p-2  btn-outline-danger"><i class="fa-solid fa-trash pe-2"></i>Delete</button>

                </td>
            </tr>
        `
     }
     document.getElementById('data-rows').innerHTML = displayedProducts;
                
        }
    
    
}
// !===========================SEARCHING=============================>



// !===========================REGEX=============================>

function checkInputState(id,rigthMark,wrongMark,inputRightState,inputWrongState){
    if (checkState == true){
        id.classList.add(rigthMark);
        id.classList.replace(wrongMark,rigthMark);
        id.classList.replace("check-input",inputRightState);
        id.classList.replace(inputWrongState,inputRightState);
    }
    else{
         id.classList.add(wrongMark);
         id.classList.replace(rigthMark,wrongMark);
         id.classList.replace("check-input",inputWrongState);
         id.classList.replace(inputRightState,inputWrongState);
    }
       
}
function removeInputState(id,rigthMark,wrongMark,inputRightState,inputWrongState){
            id.classList.remove(rigthMark);
            id.classList.remove(wrongMark);
            id.classList.replace(inputWrongState,"check-input");
            id.classList.replace(inputRightState,"check-input");


}

function checkName(){   

        if(siteNameRegx.test(websiteName.value)){
            checkState = true;
            checkInputState(wbsiteIdName,rightCheckMark,wrongCheckMark,rightInputState,wrongInputState);
            return true
        }
        else if(websiteName.value == ""){
            removeInputState(wbsiteIdName,rightCheckMark,wrongCheckMark,rightInputState,wrongInputState);
            return false
        }
        else{
            checkState = false;
            checkInputState(wbsiteIdName,rightCheckMark,wrongCheckMark,rightInputState,wrongInputState);
            return false;
        }
        
}

function checkUrl(){
        if(siteUrlRegx.test(websiteUrl.value)){
            checkState = true;
            checkInputState(websiteIdUrl,rightCheckMark,wrongCheckMark,rightInputState,wrongInputState);
            return true;
        }

        else if(websiteUrl.value == ""){     
            removeInputState(websiteIdUrl,rightCheckMark,wrongCheckMark,rightInputState,wrongInputState);
            return false;
        }

        else{
            checkState = false;
            checkInputState(websiteIdUrl,rightCheckMark,wrongCheckMark,rightInputState,wrongInputState);
            return false;
            
        }

}

// !===========================REGEX=============================>


// !===========================MODAL=============================>
/* Select buttons from modal and bind click behavior */
modal.querySelector("button.cancel").addEventListener("click", () => {
    /* Call close method on modal to dismiss */
    modal.close();
});
// !===========================MODAL=============================>




// localStorage


