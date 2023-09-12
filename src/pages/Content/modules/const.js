const Constants = {
  PageUrlPatterns: {
    NoUpwork: "NoUpwork",
    SignUp: "nx/signup/",
    SignUpDest: "nx/signup/?dest=home",
    CreateProfile: "create-profile/",
    Welcome: "welcome",
    Experience: "experience",
    Goal: "goal",
    WorkPreference: "work-preference",
    ResumeImport: "resume-import",
    Title: "title",
    Employeement: "employment",
    Education: "education",
    Languages: "languages",
    Certificate: "certification",
    Skills: "skills",
    Overview: "overview",
    Categories: "categories",
    Rate: "rate",
    Location: "location",
    Submit: "submit",
    Finish: "finish",
  },
  BtnClassNames: {
    getStart: 'air3-btn air3-btn-primary mr-7',
    skipBtn: 'air3-btn air3-btn-link air3-wizard-skip-link-btn',
    upCVContinue: 'air3-btn air3-btn-primary mb-0',
    inMethod: 'mb-3 air3-btn air3-btn-secondary',
    titleIn: 'air3-input form-control',
    nextBtn: 'air3-btn air3-btn-primary',
    addExp: 'air3-btn air3-btn-lg air3-btn-secondary-inverted air3-btn-circle',
    expTitle: 'air3-input',//1
    expCompany: 'air3-input',//2
    expCity: 'air3-input',//3
    expStartM: 'air3-dropdown-toggle-label ellipsis',//1
    expStartY: 'air3-dropdown-toggle-label ellipsis',//2
    expEndM: 'air3-dropdown-toggle-label ellipsis',//3
    expEndY: 'air3-dropdown-toggle-label ellipsis',//4
    expDes: 'air3-textarea',
    expSave: 'air3-btn air3-btn-primary mr-0 mb-0',
    expNext: 'air3-btn air3-btn-primary'//3
  },
  OtherControls: {
    signUpFreelancerRadio: 'input[type="radio"][aria-labelledby="button-box-4"]',
    languageComboList: 'ul[aria-labelledby="dropdown-label-english"][role="listbox"][data-test="menu"]',
    languageCombo:'div[data-test="dropdown-toggle"][aria-expanded="false"]',
    skillsList: 'div[aria-labelledby="token-container-label"][class="token-container"]',
    categoryAddBtns: 'button:not([aria-disabled="true"])[data-qa="category-add-btn"][role="button"]',
    inputHourly: 'input[type="text"][aria-describedby="currency-hourly-83 hourly-rate-description"]',
    nextBtn: 'button[data-test="next-button"][type="button"][class="air3-btn air3-btn-primary"]',
    applyAsFreelancerBtn: 'button[data-qa="btn-apply"][type="button"][class="up-btn up-btn-primary width-md up-btn-block"]',
    submitBtn: 'button[data-qa="submit-profile-top-btn"][class="submit-profile-top-btn air3-btn air3-btn-primary width-md m-0"]',
    browseJobBtn: 'a[class="up-n-link air3-btn air3-btn-primary"]',
  },
  Ids: {
    signupSelectState: "signupSelectState",
    languageComboState: "languageComboState",
    hourlyInputState: "hourlyInputState",
  }
}


export default Constants;