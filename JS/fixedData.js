export const UPDATE_BUTTON_CONFIG  =    {   btnId: "updateBtn", btnClass: "btn-outline-warning", iconClass: "fa-edit", btnText: 'Update' };
export const DELETE_BUTTON_CONFIG  =    {   btnId: "deleteBtn", btnClass:  "btn-outline-danger", iconClass: "fa-trash", btnText: 'Delete' };
export const VISIT_BUTTON_CONFIG  =     {   btnId: "visitedBtn", btnClass: "btn-outline-success", iconClass:  "fa-eye"};
export const FORM_BTNS_CONFIGS =        [   { 'data-mode':"add", id:"submitBtn", class:"btn btn-danger mx-3", text:'Add'},
                                            { 'data-mode':"cancel", id:"cancel-btn", class:"btn btn-danger mx-3 d-none", text:'Cancel Update'}
                                        ];

export const DATA_INPUTS_CONFIG =       [   { divPrefix:'Name', inputPrefix:'name', inputPlaceHolder:'BookMark Name', labelText:'Site Name', labelIcon:'fa-book-bookmark' }, 
                                            { divPrefix:'Url', inputPrefix:'url', inputPlaceHolder:'BookMark Url', labelText:'Site URL', labelIcon:'fa-link' }, 
                                            { divPrefix:'Category', inputPrefix:'category', inputPlaceHolder:'BookMark Category', labelText:'Site Category', labelIcon:'fa-layer-group' }
                                        ];

export const SITE_NAME_REGEX =  /[a-z A-Z]{3,}[0-9]{0,}/;
export const SITE_URL_REGEX =   /^(https?:\/\/)?(?:www\.)?[\w-]+\.[\w-]+\.?(?:com|net|org)(?:\/.*)?$/i;


export const ERROR_MESSAGES =           {   nameInput: `Url name must contain at least 3 characters ex: (Bee)`, 
                                            urlInput: `Site URL must be a valid one ex: (http(s)://(www.)example(.com | .net | .org) OR (www.)example(.com | .net | .org)`,
                                        };
export const UPDATE_MODAL_MESSAGES =    {   noChange: `Please Update Data OR Click on Cancel Update Button` ,
                                            websiteNameChanged: 'Name Upadted',
                                            websiteLinkChanged: 'Website link Upadted',
                                            websiteCategoryChanged: 'Website Category Upadted',
                                        };

export const ADDED_NUMBER_TO_ORDER_INDEX = 1;

export const SUCCESS_INPUT_CLASS  = "input-is-right";
export const FAILED_INPUT_CLASS  =  "input-is-wrong";

export const BASIC_CATEGORIES =     ['elementOrder', 'websiteName', 'websiteURL', 'websiteCategory'];

