
import { printLine } from './modules/print';
import funcs from './modules/func';
import Constants from './modules/const';
// import ActionElements from './modules/element';

import Constant from '../constant';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

const UpworkPages = Constants.UpworkPages;
const BtnClassIden = Constants.BtnClassIden;

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

// const callbackTitle = (btn) => {
//   setTimeout(function() {
//     btn.click();
//   }, 500);
// }


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
          case UpworkPages.CreateProfile:            
            console.log("ok create profile:  ", UpworkPages.CreateProfile);
            funcs.trySelectElementAndCallback(this.document, BtnClassIden.getStart, 0, callbackBtnClick);
            break;
          case UpworkPages.Welcome:
            console.log("ok welcome:  ", UpworkPages.Welcome);
            funcs.trySelectElementAndCallback(this.document, BtnClassIden.getStart, 0, callbackBtnClick);
            break;
          case UpworkPages.Experience:
            console.log("ok exp:  ", UpworkPages.Experience);
            funcs.trySelectElementAndCallback(this.document, BtnClassIden.skipBtn, 0, callbackBtnClick);
            break;
          case UpworkPages.Goal:
            console.log("ok goal:  ", UpworkPages.Goal);
            funcs.trySelectElementAndCallback(this.document, BtnClassIden.skipBtn, 0, callbackBtnClick);
            break;
          case UpworkPages.WorkPreference:
            console.log("ok prefer:  ", UpworkPages.WorkPreference);
            funcs.trySelectElementAndCallback(this.document, BtnClassIden.skipBtn, 0, callbackBtnClick);
            break;
          case UpworkPages.ResumeImport:
            console.log("ok resume:  ", UpworkPages.ResumeImport);
            funcs.trySelectElementAndCallback(this.document, BtnClassIden.upCVContinue, 0, callbackBtnClick);
            // funcs.trySelectElementAndCallbackInput(this.document, BtnClassIden.titleIn, 0, e.currentProfile.mainSkills, callbackDataInput);
            // funcs.trySelectElementAndCallback(this.document, BtnClassIden.nextBtn, 3, callbackWelcome);
            break;
          case UpworkPages.Title:
            // console.log("ok: title", UpworkPages.Title);
            // funcs.trySelectElementAndCallbackInput(this.document, BtnClassIden.titleIn, 0, callbackDataInput, e.currentProfile.mainSkills);
            // setTimeout(function () {
            //   funcs.trySelectElementAndCallback(this.document, BtnClassIden.nextBtn, 3, callbackBtnClick);
            // }, 500);
            // break;
          case UpworkPages.Employeement:
            break;
          case UpworkPages.Education:
            break;
          case UpworkPages.Certificate:
            //action on 'Certification' page
            break;
          case UpworkPages.Languages:
            //action on 'Languages' page
            break;
          default: console.log('no Action to do automatically!!!')
        }
      }
    } else {
      return;
    }
  });


}, 2000);
// });

