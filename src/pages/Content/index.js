
import { printLine } from './modules/print';
import funcs from './modules/func';
import Constants from './modules/const';
// import ActionElements from './modules/element';

import Constant from '../constant';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

const { PageUrlPatterns, BtnClassNames, OtherControls, Ids } = Constants;

// // Function to handle URL change events
// function handleURLChange(details) {
//   console.log("URL changed:", details.url);

//   // Do something with the new URL
//   // Your code logic here...
// }

// // Add a listener for the onCompleted event
// chrome.webNavigation.onCompleted.addListener(handleURLChange);


const callbackBtnClick = (btn) => {
  funcs.isBtn(btn) && btn.click();
  // setTimeout(() => {
  //   location.reload();
  // }, 1000);
}

const callbackDataInput = (data, input) => {
  if (funcs.isInput(input)) {
    input.value = data;
    setTimeout(() => {
      input.dispatchEvent(new Event('blur'));
    }, 100);
  }
}

const callbackModelInput = (data, input) => {
  if (funcs.isInput(input)) {
    input.value = data;
    setTimeout(() => {
      const inputEvent = new Event('input', { bubbles: true });
      // Dispatch the "input" event on the input field element
      input.dispatchEvent(inputEvent);
    }, 100)
  }
}

const callbackDateInput = (data, input) => {
  console.log('inputdata', data, 'element', input);
  if (funcs.isInput(input)) {
    input.innerHTML = data;
    setTimeout(() => {
      const inputEvent = new Event('input', { bubbles: true });
      // Dispatch the "input" event on the input field element
      input.dispatchEvent(inputEvent); 
    }, 100);
  }
}

// window.addEventListener('load', function () {
setInterval(async function () {
  chrome.storage.local.get(Constant.currentProfile, (e) => {
    //   console.log(e.currentProfile.mainSkills)

    let flag = 0;

    if (!flag) {
      // flag = 1;
      const findPage = funcs.isUpworkPage(this.document);
      if (findPage) {
        const whichPage = funcs.whichUpworkPage(this.document);
        switch (whichPage) {
          case PageUrlPatterns.SignUp:
          case PageUrlPatterns.SignUpDest:
            console.log("ok signUp: ", PageUrlPatterns.SignUp);
            funcs.loadFromLocal(Ids.signupSelectState, (index) => {
              if(funcs.isEmpty(index) || index === 0){
                funcs.saveToLocal(Ids.signupSelectState, 1, () => {
                  funcs.trySelectElementBySelector(this.document, OtherControls.signUpFreelancerRadio, 0, callbackBtnClick);
                });
              } else if(index === 1){
                funcs.saveToLocal(Ids.signupSelectState, 0, () => {
                  funcs.trySelectElementBySelector(this.document, OtherControls.applyAsFreelancerBtn, 0, callbackBtnClick);
                });
              }
            });
            break;
          case PageUrlPatterns.CreateProfile:
            console.log("ok create profile:  ", PageUrlPatterns.CreateProfile);
            funcs.trySelectElementByClassName(this.document, BtnClassNames.getStart, 0, callbackBtnClick);
            break;
          case PageUrlPatterns.Welcome:
            console.log("ok welcome:  ", PageUrlPatterns.Welcome);
            funcs.trySelectElementByClassName(this.document, BtnClassNames.getStart, 0, callbackBtnClick);
            break;
          case PageUrlPatterns.Experience:
            console.log("ok exp:  ", PageUrlPatterns.Experience);
            funcs.trySelectElementByClassName(this.document, BtnClassNames.skipBtn, 0, callbackBtnClick);
            break;
          case PageUrlPatterns.Goal:
            console.log("ok goal:  ", PageUrlPatterns.Goal);
            funcs.trySelectElementByClassName(this.document, BtnClassNames.skipBtn, 0, callbackBtnClick);
            break;
          case PageUrlPatterns.WorkPreference:
            console.log("ok prefer:  ", PageUrlPatterns.WorkPreference);
            funcs.trySelectElementByClassName(this.document, BtnClassNames.skipBtn, 0, callbackBtnClick);
            break;
          case PageUrlPatterns.ResumeImport:
            console.log("ok resume:  ", PageUrlPatterns.ResumeImport);
            // funcs.trySelectElementAndCallbackInput(this.document, BtnClassIden.titleIn, 0, e.currentProfile.mainSkills, callbackDataInput);
            // funcs.trySelectElementAndCallback(this.document, BtnClassIden.nextBtn, 3, callbackWelcome);
            break;
          case PageUrlPatterns.Title:
            // console.log("ok: title", UpworkPages.Title);
            // funcs.trySelectElementAndCallbackInput(this.document, BtnClassIden.titleIn, 0, callbackDataInput, e.currentProfile.mainSkills);
            // setTimeout(function () {
            //   funcs.trySelectElementAndCallback(this.document, BtnClassIden.nextBtn, 3, callbackBtnClick);
            // }, 500);
            // break;
          case PageUrlPatterns.Employeement:
            break;
          case PageUrlPatterns.Education:
            break;
          case PageUrlPatterns.Certificate:
            //action on 'Certification' page
            break;
          case PageUrlPatterns.Languages:
            console.log("ok language:  ", PageUrlPatterns.Languages);
            funcs.loadFromLocal(Ids.languageComboState, (index) => {
              if(funcs.isEmpty(index) || index === 0){
                funcs.trySelectElementBySelector(this.document, OtherControls.languageCombo, 0, (combo) => {
                  funcs.saveToLocal(Ids.languageComboState, 1, () => {
                    combo.click();
                  });
                });
                console.log("Languages 1");
              } else if(index === 1){
                funcs.trySelectElementBySelector(this.document, OtherControls.languageComboList, 0, (listParent) => {
                  funcs.saveToLocal(Ids.languageComboState, 2, () => {
                    console.log("listParent", listParent);
                    listParent.children[2].click();
                  });
                });
                
                console.log("Languages 2");
              } else if(index === 2){
                funcs.saveToLocal(Ids.languageComboState, 0, () => {
                  funcs.trySelectElementBySelector(this.document, OtherControls.nextBtn, 0, callbackBtnClick);
                });
                console.log("Languages 3");
              }
            });
            break;
          case PageUrlPatterns.Skills:  
            console.log("ok skills:  ", PageUrlPatterns.Skills);
            funcs.trySelectElementBySelector(this.document, OtherControls.skillsList, 0, (listParent) => {
              if(listParent.children.length > 0) {
                listParent.children[0].click();
              } else {
                funcs.trySelectElementBySelector(this.document, OtherControls.nextBtn, 0, callbackBtnClick);
              }
            });
            break;
          case PageUrlPatterns.Overview:
            console.log("ok overview:  ", PageUrlPatterns.Overview);
            break;
          case PageUrlPatterns.Categories:
            console.log("ok categories:  ", PageUrlPatterns.Categories);
            funcs.trySelectElementBySelector(this.document, OtherControls.categoryAddBtns, null, (btns) => {
              let i = 0;
              for(i = 0; i<btns.length; i++){
                let btn = btns[i];
                if(btn.ariaLabel.indexOf("Development") !== -1){
                  btn.click();
                  break;
                }
              }
              if(i === btns.length){
                funcs.trySelectElementBySelector(this.document, OtherControls.nextBtn, 0, callbackBtnClick);
              }
            });
            break;
          case PageUrlPatterns.Rate:
            console.log("ok rate:  ", PageUrlPatterns.Rate);
            
            funcs.loadFromLocal(Ids.hourlyInputState, (index) => {
              if(funcs.isEmpty(index) || index === 0){
                funcs.saveToLocal(Ids.hourlyInputState, 1, () => {
                  funcs.trySelectElementBySelector(this.document, OtherControls.inputHourly, 0, callbackDataInput, "40");
                });
              } else if(index === 1){
                funcs.saveToLocal(Ids.hourlyInputState, 0, () => {
                  funcs.trySelectElementBySelector(this.document, OtherControls.nextBtn, 0, callbackBtnClick);
                });
              }
            });
            break;
          case PageUrlPatterns.Location:
            console.log("ok location:  ", PageUrlPatterns.Location);
            break;
          case PageUrlPatterns.Submit:
            console.log("ok submit:  ", PageUrlPatterns.Submit);
            funcs.trySelectElementBySelector(this.document, OtherControls.submitBtn, 0, callbackBtnClick);
            break;
          case PageUrlPatterns.Finish:
            console.log("ok finish:  ", PageUrlPatterns.Finish);
            funcs.trySelectElementBySelector(this.document, OtherControls.browseJobBtn, 0, callbackBtnClick);
            break;
          default: console.log('no Action to do automatically!!!')
        }
      }
    } else {
      return;
    }
  });
}, 2500);
// });

