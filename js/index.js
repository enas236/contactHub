

var fullNameInput = document.querySelector("#fullName");
var phoneNumberInput = document.querySelector("#phoneNumber");
var emailAddressInput = document.querySelector("#emailAddress");
var addressInput = document.querySelector("#address")
var groupSelect = document.querySelector("#group");
var notesTexts = document.querySelector("#notes"); 
var favCheck = document.querySelector("#favorite");
var emergencyCheck = document.querySelector("#emergency");
var addContactModal = document.querySelector("#addContactModal");
var emptyState = document.querySelector('#emptyState');
var starAdd = document.querySelector('#starAdd');
var heartAdd = document.querySelector('#heartAdd');
var addButton = document.querySelector("#addBtn");
var saveContactBtn = document.querySelector("#saveContactBtn");
var updateBtn = document.querySelector("#updateBtn");
// global becouse every time for add still save the data
var contactList =[];
var updateIdx;
// Save in local Storage
var contactLocalStorageKey= "allContacts";


addContactModal.addEventListener('hidden.bs.modal', function () {
    cancelEdit();
});


if (JSON.parse(localStorage.getItem(contactLocalStorageKey))) {   
    contactList = JSON.parse(localStorage.getItem(contactLocalStorageKey));
    displayContact(contactList); 
}

function addContactToLocalStorage() {
    
    localStorage.setItem(contactLocalStorageKey, JSON.stringify(contactList));
}


function duplicateSweetAlert() {
    if (isPhoneDuplicated(phoneNumberInput.value.trim())) {

        Swal.fire({
            icon: 'error',
            title: 'Duplicate Phone Number',
            text: 'A contact with this phone number already exists.',
            confirmButtonText: 'OK'
        });

        phoneNumberInput.classList.remove("is-valid");
        phoneNumberInput.classList.add("is-invalid");

        return true;    
    }

    return false;     
}

// Add Contact
function addContact() {
  
    updateIdx = undefined;
    updateBtn.classList.add('d-none');
    saveContactBtn.classList.remove('d-none');

    if (duplicateSweetAlert()) {
            return;
    }

    if(
        validateFormInputs(fullNameInput) &&
        validateFormInputs(phoneNumberInput) &&
        validateFormInputs(emailAddressInput) 
    ){
       var information ={
           fullName : fullNameInput.value,
           phoneNumber : phoneNumberInput.value.trim(),
           email :emailAddressInput.value,
           address :addressInput.value,
           group : groupSelect.value,
           notes : notesTexts.value,
           favorite : favCheck.checked,
           emergency : emergencyCheck.checked,
       }
 
       contactList.push(information);
       addContactToLocalStorage();
       displayContact(contactList);
       bootstrap.Modal.getInstance(addContactModal).hide();
       clearForm();
    }

    Swal.fire({
    icon: 'success',
    title: 'Added!',
    text: 'Contact has been added successfully.',
    timer: 1500,
    showConfirmButton: false
    });
}

function emptyStateShow(){
    if (contactList.length === 0) {
        emptyState.classList.replace("d-none","d-flex");
    } else {
        emptyState.classList.replace("d-flex","d-none");
    }
}

// Display Content in Html
function displayContact(list) {
     resetRealIndex(); 
    emptyStateShow();
    var blackBox='';
    for( var i = 0 ; i < list.length ; i++){
        blackBox += `
          <div class="col-12 col-md-6">
                        <div class="card product border-0 shadow-sm rounded-4 ">
                            
                            <div class="card-body cursor-pointer p-3">
                                
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="position-relative">
                                        <div class="avatar h5 rounded-4 text-white fw-bold bg-primary d-flex justify-content-center align-items-center">
                                        ${avatar(i)} </div>
                                        ${starAndEmerCircleHeader(i)}
                                        </div>
                                        <div>
                                            <h5 class="m-0 fw-bold h6">${list[i].fullName}</h5>
                                           <div class="d-flex gap-2 align-items-center mt-2">
                                            <div class="px-2 bg-primary bg-opacity-25 rounded-3">
                                                <i class="fa-solid fa-phone rounded-3 py-2 font-xs text-primary"></i>
                                            </div>
                                             <p class="m-0 text-muted small">${list[i].phoneNumber}</p>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                                
                               <div class="pt-2">
                                 <p class="m-0 text-muted font-m pt-1">
                                    <i class="fa-solid fa-envelope purple-text bg-icon-opacity font-xs rounded-1 width me-2"></i>
                                    ${list[i].email}
                                </p>
                               
                                ${addressShow(i)}                                
                                <div class="d-flex gap-3 pt-3 ">
                                   ${groupAndEmergencyShow(i)}
                                </div>

                                <div >${list[i].notes}</div>
                               </div>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <div class="p-3">
                                  <a href="tel:${list[i].phoneNumber}" class="text-decoration-none">
                                    <i class="fa-solid fa-phone rounded-3 call-icon rounded-1 cursor text-success text-opacity-75 bg-success bg-opacity-10 font-m width-1 me-2"></i>
                                  </a>
                                  <a href="mailto:${list[i].email}"  class="text-decoration-none">
                                  <i class="fa-solid fa-envelope rounded-3 purple-text email-icon cursor bg-icon-opacity font-m rounded-1 font-m width-1"></i>
                                  </a>

                                </div>

                                <div class="p-3 d-flex gap-3">
                                    ${starAndEmerFooter(i)}
                                    <i       
                                    onclick="editConatct(${list[i].realIndex})"
                                    class="fa-solid fa-pen rounded-1 pen-icon cursor font-m width-1 text-muted"></i>
                                    <button onclick="deleteContact(${list[i].realIndex})" class="border-0">
                                    <i class="fa-solid fa-trash rounded-1 cursor delete-icon font-m width-1 text-muted"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
        `;
    }

    document.getElementById('contactList').innerHTML = blackBox;
    addStarButton();
    addEmergencyButton();
    updateCounters();

   starAdd.innerHTML = addStarSection();
   heartAdd.innerHTML = addHeartSection();
}

function clearForm() {
    fullNameInput.value = "";
    phoneNumberInput.value = "";
    emailAddressInput.value = "";
    addressInput.value = "";
    groupSelect.value = "";
    notesTexts.value = "";
    favCheck.checked = false;
    emergencyCheck.checked = false;
}

function avatar(i) {
    var names = contactList[i].fullName.split(' '); 
    if (names.length > 1) {
       return((names[0][0]+ names[1][0]).toUpperCase()); 
    }else if(names.length === 1){
        return (names[0][0].toUpperCase());
    }
}

function starAndEmerCircleHeader(i) {

        var FavIconHeader = contactList[i].favorite 
        ? `<div class="icon-position position-absolute">
            <i class="fa-solid fa-star div-star-icon text-white bg-warning rounded-circle width-2"></i>
        </div>`
        : "";
    
        var emergencyIconHeader = contactList[i].emergency 
        ? `<div class="icon-position-1 position-absolute">
            <i class="fa-solid fa-heart-pulse  div-star-icon text-white bg-danger rounded-circle width-2"></i>
        </div>`
        : "";
    
        return FavIconHeader + emergencyIconHeader;
}

function starAndEmerFooter(i){
    
    var favFooter = contactList[i].favorite
        ? `<i class="fa-solid fa-star rounded-3 star-icon cursor font-m width-1 text-warning bg-warning-subtle"></i>`
        : `<i class="fa-regular fa-star rounded-3 star-icon cursor font-m width-1 text-muted"></i>`;

    var emergencyFooter = contactList[i].emergency
        ? `<i class="fa-solid fa-heart-pulse heart-icon cursor rounded-3 font-m width-1 text-danger bg-danger-subtle"></i>`
        : `<i class="fa-regular fa-heart heart-icon cursor rounded-3 font-m width-1 text-muted"></i>`;

    return favFooter + emergencyFooter;
}


function addressShow(i){
    var addressShow = contactList[i].address;

    addressShow == `` 
    ?  addressShow= `<p class="pt-1"></p>` 
    
    :  addressShow=` <p class="m-0 text-muted font-m pt-1">
            <i class="fa-solid fa-location-dot text-success text-opacity-75 bg-success font-xs rounded-1 width bg-opacity-10 me-2"></i>
            ${contactList[i].address}
        </p>`;
    return addressShow;
}

function groupAndEmergencyShow(i) {
    var groupShow = contactList[i].group
    ? `
    <p class="px-2 py-1 rounded-3 bg-opacity-10 text-primary bg-primary font-sm">
        ${contactList[i].group}
    </p>
    `
    : `<p class="px-2 py-3"></p>`;

    var emergencyShow = contactList[i].emergency
        ? `
        <p class="px-2 py-1 rounded-3 bg-opacity-10 text-danger bg-danger font-sm d-flex align-items-center gap-1">
            <i class="fa-solid fa-heart-pulse"></i>
            Emergency
        </p>
        `
        : "";
    return groupShow + emergencyShow ;
}


function addStarButton(){
    var star = document.querySelectorAll(".star-icon");
    for (let i = 0; i < star.length; i++) {
        star[i].addEventListener("click", function () {
            contactList[i].favorite = !contactList[i].favorite;
            addContactToLocalStorage();
            displayContact(contactList);
        });
    }
}

function addEmergencyButton(){
    var heart = document.querySelectorAll(".heart-icon");
    for (let i = 0; i < heart.length ; i++) {
        heart[i].addEventListener("click", function () {
            contactList[i].emergency = !contactList[i].emergency;
            addContactToLocalStorage();
            displayContact(contactList);
        });
    }
}

function updateCounters() {   
    var total = 0;
    var fav = 0;
    var emergency = 0;
    for (var i = 0; i < contactList.length; i++) {
        total++; 
        if (contactList[i].favorite === true) {
            fav++; 
        }
        if (contactList[i].emergency === true) {
            emergency++;
        }
    }
    
    document.getElementById("totalCount").innerText= total;
    document.getElementById("favoriteCount").innerText = fav;
    document.getElementById("emergencyCount").innerText = emergency;
}

function resetRealIndex() {
    for (var i = 0; i < contactList.length; i++) {
        contactList[i].realIndex = i;
    }
}


// pop(From last index), shift(from first index) , splice(explain from which index and the number of element for delete) ==> delete
function deleteContact(deletedIdx){
    Swal.fire({
        icon: 'warning',
        title: 'Delete Contact?',
        text: `Are you sure you want to delete ${contactList[deletedIdx].fullName}?`,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            contactList.splice(deletedIdx, 1);
            addContactToLocalStorage();
            displayContact(contactList);

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Contact has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
   
}

function addStarSection(){
    var contain  = ``;
    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].favorite === true){
            contain +=` <div class="col-lg-6">
            <div class="contactFav mx-3 my-2 rounded-4">
                <div class="d-flex align-items-center justify-content-between p-2 ">
                    <div class="d-flex align-items-center gap-2">
                        <div  class="avatar h5 rounded-4 text-white fw-bold bg-primary d-flex justify-content-center align-items-center">
                             ${avatar(i)} 
                        </div>
                        <div>
                            <h5 class="m-0 fw-bold font-m">${contactList[i].fullName}</h5>                                                    
                            <p class="m-0 text-muted font-xs">${contactList[i].phoneNumber}</p>                                                      
                        </div>
                    </div>                     
                    <div class=" bg-success bg-opacity-10 rounded-3 px-1">
                       <a href="tel:${contactList[i].phoneNumber}" class="text-decoration-none">
                        <i class="fa-solid fa-phone call-icon cursor text-success font-xs py-1"></i>
                       </a>
                    </div>
                </div>
            </div>
          </div>`
        }
    }   
    if (contain === ``) {
        contain += `
            <div class="space-content d-flex align-items-center justify-content-center">
                <p class="py-5 fs-6 text-gray">No favorites yet</p>
            </div>
        `;
    }
    
    return contain;
}

function addHeartSection(){
    var contain  = ``;
    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].emergency === true){
            contain +=` <div class="col-lg-6">
            <div class="contactFav mx-3 my-2 rounded-4">
                <div class="d-flex align-items-center justify-content-between p-2 ">
                    <div class="d-flex align-items-center gap-2">
                        <div  class="avatar h5 rounded-4 text-white fw-bold bg-primary d-flex justify-content-center align-items-center">
                             ${avatar(i)} 
                        </div>
                        <div>
                            <h5 class="m-0 fw-bold font-m">${contactList[i].fullName}</h5>                                                    
                            <p class="m-0 text-muted font-xs">${contactList[i].phoneNumber}</p>                                                      
                        </div>
                    </div>                     
                    <div class=" bg-danger bg-opacity-10 rounded-3 px-1">
                       
                        <a href="tel:${contactList[i].phoneNumber}" class="text-decoration-none">
                        <i class="fa-solid fa-phone call-icon cursor text-danger font-xs py-1"></i>
                       </a>
                    </div>
                </div>
            </div>
          </div>`
        }
    }   
    if (contain === ``) {
        contain += `
            <div class="space-content d-flex align-items-center justify-content-center">   
                <p class="py-5 fs-6 text-gray">No emergency contacts</p>
            </div>
        `;
    }

    return contain;
}

function editConatct(editIdx){
    updateIdx = editIdx;

    fullNameInput.value =  contactList[editIdx].fullName;
    phoneNumberInput.value =  contactList[editIdx].phoneNumber;
    emailAddressInput.value = contactList[editIdx].email;
    addressInput.value = contactList[editIdx].address;
    groupSelect.value = contactList[editIdx].group;
    notesTexts.value = contactList[editIdx].notes;
    favCheck.checked = contactList[editIdx].favorite;
    emergencyCheck.checked = contactList[editIdx].emergency;

    var myModal = new bootstrap.Modal(addContactModal);
    myModal.show();
    saveContactBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none'); 
}

function updateContact(){

    if (duplicateSweetAlert()) {
        return;
    }

    if (
    validateFormInputs(fullNameInput) &&
    validateFormInputs(phoneNumberInput) &&
    validateFormInputs(emailAddressInput)  
    ) {
        contactList[updateIdx].fullName = fullNameInput.value;
        contactList[updateIdx].phoneNumber = phoneNumberInput.value.trim();
        contactList[updateIdx].email = emailAddressInput.value;
        contactList[updateIdx].address = addressInput.value;
        contactList[updateIdx].group = groupSelect.value;
        contactList[updateIdx].notes = notesTexts.value;
        contactList[updateIdx].favorite = favCheck.checked;
        contactList[updateIdx].emergency = emergencyCheck.checked;
        
        addContactToLocalStorage();
        displayContact(contactList);
        clearForm();
        updateBtn.classList.add('d-none'); 
        saveContactBtn.classList.remove('d-none');  
        bootstrap.Modal.getInstance(addContactModal).hide();
    }

    Swal.fire({
    icon: 'success',
    title: 'Updated!',
    text: 'Contact has been updated successfully.',
    timer: 1500,
    showConfirmButton: false
});

}

function validateFormInputs(element) {

    var regex = {      
    //Start with small or capital letter lk 2-50 letter  \s === accept every space 
        fullName: /^[A-Za-z\s]{2,50}$/,
    //(02|\+2){0,1} 02,+2 optional for 0 time or 1 time        
    // {0,1} ==== ? , [0-9] ====\d
        phoneNumber: /^(02|\+2)?01[0-25]\d{8}$/,
    //[a-zA-Z][0-9](@){1}(hotmail|gmail)\.com
        emailAddress: /^[A-Za-z][A-Za-z0-9]{9,11}(@){1}(hotmail|gmail)\.(com)$/,
    }; 

    var isvalid = regex[element.id].test(element.value);
    if (isvalid) {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        element.nextElementSibling.classList.add('d-none');  

    } else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        element.nextElementSibling.classList.remove('d-none'); 
    }

    return isvalid;
}

function isPhoneDuplicated(phone) {
    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].phoneNumber === phone) {
            if (updateIdx === i) {
                return false;
            }
            return true;
        }
    }
    return false;
}

function cancelEdit() {
    updateIdx = undefined;
    clearForm();

    updateBtn.classList.add('d-none');
    saveContactBtn.classList.remove('d-none');
}

//Search
function searchContacts(element) {
    var matchedResult = [];
    var searchValue = element.value.toLowerCase();

    for (var i = 0; i < contactList.length; i++) {

        if (
            contactList[i].fullName.toLowerCase().includes(searchValue) ||
            contactList[i].phoneNumber.includes(searchValue) ||
            contactList[i].email.toLowerCase().includes(searchValue)
        ) {
          
            contactList[i].realIndex = i;
            matchedResult.push(contactList[i]);
        }
    }

    if (matchedResult.length === 0) {
        document.getElementById("contactList").innerHTML = "";
        emptyState.classList.replace("d-none", "d-flex");
        return;
    }

    emptyState.classList.replace("d-flex", "d-none");
    displayContact(matchedResult);
}

