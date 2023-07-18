
import { printLine } from './modules/print';
import funcs from './modules/func';
import Constants from './modules/const';
// import ActionElements from './modules/element';

import Constant from '../constant';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");


// // Function to handle URL change events
// function handleURLChange(details) {
//   console.log("URL changed:", details.url);

//   // Do something with the new URL
//   // Your code logic here...
// }

// // Add a listener for the onCompleted event
// chrome.webNavigation.onCompleted.addListener(handleURLChange);



const callbackWelcome = (btn) => {
  funcs.isBtn(btn) && btn.click();
  // setTimeout(() => {
  //   location.reload();
  // }, 1000);
}

const callbackExperience = (btn) => {
  funcs.isBtn(btn) && btn.click();
  // setTimeout(() => {
  //   location.reload();
  // }, 1000);
}

const callbackMethod = (btn) => {
  // if (funcs.isBtn(btn) && btn.click()) { funcs.isBtn(btn) && btn.click() };
  btn.click();
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
    input.value=data;
    setTimeout(()=>{
      input.dispatchEvent(new Event('blur'));
    }, 100)
  }
}

const callbackDateInput = (data, input) => {
  console.log('inputdata', data, 'element', input);
  if (funcs.isInput(input)) {
    input.innerHTML = data;
    setTimeout(() => {
      input.dispatchEvent(new Event('blur'));
      console.log('titleInput', data);
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
      if (findPage !== -1) {
        const whPage = funcs.whichUpworkPage(this.document);
        switch (whPage) {
          case Constants.UpworkPages.Welcome:
            console.log("ok welcome:  ", Constants.UpworkPages.Welcome);
            funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.getStart, 0, callbackWelcome);
            break;
          case Constants.UpworkPages.Experience:
            console.log("ok exp:  ", Constants.UpworkPages.Experience);
            funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.skipBtn, 0, callbackExperience);
            break;
          case Constants.UpworkPages.Goal:
            console.log("ok goal:  ", Constants.UpworkPages.Goal);
            funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.skipBtn, 0, callbackExperience);
            break;
          case Constants.UpworkPages.WorkPreference:
            console.log("ok prefer:  ", Constants.UpworkPages.WorkPreference);
            funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.skipBtn, 0, callbackExperience);
            break;
          case Constants.UpworkPages.ResumeImport:
            console.log("ok resume:  ", Constants.UpworkPages.ResumeImport);
            funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.inMethod, 3, callbackMethod);
            // funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.titleIn, 0, e.currentProfile.mainSkills, callbackDataInput);
            // funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.nextBtn, 3, callbackWelcome);
            break;
          case Constants.UpworkPages.Title:
            console.log("ok: title", Constants.UpworkPages.Title);
            funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.titleIn, 0, callbackDataInput, e.currentProfile.mainSkills);
            setTimeout(function () {
              funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.nextBtn, 3, callbackWelcome);
            }, 500);
            break;
          case Constants.UpworkPages.Employeement:
            funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.addExp, 0, callbackWelcome);
            setTimeout(() => {
              const experience = e.currentProfile.experience;
              experience.map((each) => {
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expTitle, 1, callbackModelInput, each.title);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expCompany, 2, callbackModelInput, each.company);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expCity, 3, callbackModelInput, each.location);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expStartM, 1, callbackDateInput, each.fromM);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expStartY, 2, callbackDateInput, each.fromY);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expEndM, 3, callbackDateInput, each.toM);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expEndY, 4, callbackDateInput, each.toY);
                funcs.trySelectElementAndCallbackInput(this.document, Constants.BtnClassIden.expDes, 0, callbackModelInput, each.description);
                setTimeout(() => {
                    funcs.trySelectElementAndCallback(this.document, Constants.BtnClassIden.expSave, 0, callbackWelcome);
                }, 100);
              }
              )
            }, 100);
            break;
          case Constants.UpworkPages.Education:
            break;
          case Constants.UpworkPages.Certificate:
            //action on 'Certification' page
            break;
          case Constants.UpworkPages.Langauges:
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

