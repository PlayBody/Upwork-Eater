import funcs from './modules/func';
import Constants from './modules/const';
import Constant from '../constant';

import { Faker, en, en_US } from '@faker-js/faker';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const {
  PageUrlPatterns,
  BtnClassNames,
  Controls,
  Ids,
} = Constants;

const callbackBtnClick = (btn) => {
  funcs.isBtn(btn) && btn.click();
};

const callbackRadioClick = (radio) => {
  if (funcs.isBtn(radio) && !radio.checked) {
    radio.click();
  }
};

const callbackDataInput = (data, input) => {
  if (funcs.isInput(input)) {
    input.click();
    input.value = data;
    setTimeout(() => {
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }, 100);
  }
};

const callbackDataInputIfEmpty = (data, input) => {
  if (input.value === null || input.value.length === 0) {
    callbackDataInput(data, input);
  }
};

const callbackHtmlInput = (data, input) => {
  console.log('inputdata', data, 'element', input);
  if (funcs.isInput(input)) {
    input.innerHTML = data;
    setTimeout(() => {
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }, 100);
  }
};

const working = {
  clipboard: "",
  countryCombo: false,
}

// window.addEventListener('load', function () {
setInterval(async function () {
  chrome.storage.local.get(Constant.currentProfile, (e) => {
    //   console.log(e.currentProfile.mainSkills)
    let flag = 0;
    if (!flag) {
      // flag = 1;
      const findPage = funcs.isUpworkPage(document);
      if (findPage) {
        if (document.hasFocus()) {
          navigator.clipboard
            .readText()
            .then(function (clipboardText) {
              try {
                if(working.clipboard === clipboardText){
                  return;
                }
                working.clipboard = clipboardText;
                const obj = JSON.parse(clipboardText);
                if (
                  funcs.isEmpty(obj.title) ||
                  funcs.isEmpty(obj.overview) ||
                  funcs.isEmpty(obj.skills)
                ) {
                  if (!funcs.isEmpty(obj.noSkill) && obj.noSkill === true) {
                    console.log(obj);
                    funcs.saveToLocalObj(obj);
                  }
                } else {
                  obj.noSkill = false;
                  console.log(obj);
                  funcs.saveToLocalObj(obj);
                }
              } catch {
                (e) => {
                  console.log(e);
                };
              }
            })
            .catch(function (error) {
              console.error('Error reading clipboard:', error);
            });
        }
        const whichPage = funcs.whichUpworkPage(document);
        switch (whichPage) {
          case PageUrlPatterns.SignUp:
          case PageUrlPatterns.SignUpDest:
            console.log('ok signUp: ', PageUrlPatterns.SignUp, working.countryCombo);            
            funcs.loadFromLocal(Ids.signupSelectState, (index) => {
              if (funcs.isEmpty(index) || index === 0) {
                funcs.saveToLocal(Ids.signupSelectState, 1, () => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.signUpFreelancerRadio,
                    0,
                    callbackRadioClick
                  );
                });
              } else if (index === 1) {
                funcs.saveToLocal(Ids.signupSelectState, 0, () => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.applyAsFreelancerBtn,
                    0,
                    callbackBtnClick
                  );
                });
              }
            });
            funcs.loadFromLocal(Ids.country, (country) => {
              if(!funcs.isEmpty(country) && country.length){
                funcs.trySelectElementBySelector(document, Controls.countrySpan, 0, (span)=>{
                  if(!funcs.isEmpty(span) && !span.innerHTML.includes(country) && working.countryCombo === false){
                    working.countryCombo = true;
                    funcs.trySelectElementBySelector(document, Controls.countryCombo, 0, (combo)=>{
                      if(combo){
                        combo.click();
                        setTimeout(()=>{
                          funcs.trySelectElementBySelector(document, Controls.countrySearchInput, 0, (input)=>{
                            callbackDataInput(country, input);
                            setTimeout(()=>{
                              funcs.trySelectElementBySelector(document, Controls.countryFirstItem, 0, (btn)=>{
                                callbackBtnClick(btn);
                                setTimeout(()=>{
                                  working.countryCombo = false;
                                }, 1000);
                              });
                            }, 1500);
                          })
                        }, 2500);
                      } else {
                        working.countryCombo = false;
                      }
                    });
                  }
                });
              }
            });
            funcs.trySelectElementBySelector(
              document,
              Controls.cookieAcceptBtn,
              0,
              callbackBtnClick
            );
            const customFaker = new Faker({ locale: [en, en_US] });
            funcs.loadFromLocal(Ids.firstName, (firstName) => {
              const fname = firstName;
              if(funcs.isEmpty(firstName)){
                fname = customFaker.person.firstName();
              }
              funcs.trySelectElementBySelector(
                document,
                Controls.firstNameInput,
                0,
                callbackDataInputIfEmpty,
                fname
              );
            });
            setTimeout(() => {
              funcs.loadFromLocal(Ids.lastName, (lastName) => {
                const lname = lastName;
                if(funcs.isEmpty(lastName)){
                  lname = customFaker.person.lastName();
                }
                funcs.trySelectElementBySelector(
                  document,
                  Controls.lastNameInput,
                  0,
                  callbackDataInputIfEmpty,
                  lname
                );
              });
              setTimeout(() => {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.passwordInput,
                  0,
                  callbackDataInputIfEmpty,
                  customFaker.internet.password()
                );
                setTimeout(() => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.agreeTerm,
                    0,
                    callbackRadioClick
                  );
                }, 200);
              }, 200);
            }, 200);
            setTimeout(() => {
              funcs.trySelectElementBySelector(
                document,
                Controls.emailInput,
                0,
                (input) => {
                  if (!funcs.isEmpty(input) && input.value.length > 0) {
                    funcs.trySelectElementBySelector(
                      document,
                      Controls.signupBtn,
                      0,
                      callbackBtnClick
                    );
                  }
                }
              );
            }, 100);
            break;
          case PageUrlPatterns.CreateProfile:
            console.log('ok create profile:  ', PageUrlPatterns.CreateProfile);
            funcs.trySelectElementByClassName(
              document,
              BtnClassNames.getStart,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Welcome:
            console.log('ok welcome:  ', PageUrlPatterns.Welcome);
            funcs.trySelectElementByClassName(
              document,
              BtnClassNames.getStart,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Experience:
            console.log('ok exp:  ', PageUrlPatterns.Experience);
            funcs.trySelectElementByClassName(
              document,
              BtnClassNames.skipBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Goal:
            console.log('ok goal:  ', PageUrlPatterns.Goal);
            funcs.trySelectElementByClassName(
              document,
              BtnClassNames.skipBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.WorkPreference:
            console.log('ok prefer:  ', PageUrlPatterns.WorkPreference);
            funcs.trySelectElementByClassName(
              document,
              BtnClassNames.skipBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.ResumeImport:
            console.log('ok resume:  ', PageUrlPatterns.ResumeImport);
            funcs.loadFromLocal(Ids.resumeImportState, (index) => {
              if (funcs.isEmpty(index) || index === 0) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.uploadResumeBtn,
                  0,
                  (btn) => {
                    funcs.saveToLocal(Ids.resumeImportState, 1, () => {
                      callbackBtnClick(btn);
                    });
                  }
                );
                console.log('Resume 1');
              } else if (index === 1) {
                setTimeout(() => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.resumeChooseBtn,
                    0,
                    (btn) => {
                      if (funcs.isBtn(btn)) {
                        try {
                          btn.click();
                          funcs.saveToLocal(Ids.resumeImportState, 2, () => {});
                        } catch {
                          // ignore error
                        }
                      }
                    }
                  );
                }, 500);
                console.log('Resume 2');
              } else if (index === 2) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.resumeContinueBtn,
                  0,
                  (btn) => {
                    if (funcs.isBtn(btn)) {
                      setTimeout(() => {
                        funcs.saveToLocal(Ids.resumeImportState, 0, () => {
                          callbackBtnClick(btn);
                        });
                      }, 1000);
                    }
                  }
                );
                console.log('Resume 3');
              }
            });
            break;
          case PageUrlPatterns.Title:
            console.log('ok: title', PageUrlPatterns.Title);
            funcs.loadFromLocal(Ids.title, (text) => {
              if (typeof text === 'string' && text.indexOf('|') !== -1) {
                console.log('clipboard', text);
                funcs.trySelectElementBySelector(
                  document,
                  Controls.titleInput,
                  0,
                  callbackDataInput,
                  text
                );
                setTimeout(function () {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    callbackBtnClick
                  );
                }, 500);
              }
            });
            break;
          case PageUrlPatterns.Employeement:
            funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Education:
            funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Certificate:
            //action on 'Certification' page
            funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Languages:
            console.log('ok language:  ', PageUrlPatterns.Languages);
            funcs.loadFromLocal(Ids.languageComboState, (index) => {
              if (funcs.isEmpty(index) || index === 0) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.languageCombo,
                  0,
                  (combo) => {
                    funcs.saveToLocal(Ids.languageComboState, 1, () => {
                      combo.click();
                    });
                  }
                );
                console.log('Languages 1');
              } else if (index === 1) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.languageComboList,
                  0,
                  (listParent) => {
                    funcs.saveToLocal(Ids.languageComboState, 2, () => {
                      console.log('listParent', listParent);
                      listParent.children[2].click();
                    });
                  }
                );

                console.log('Languages 2');
              } else if (index === 2) {
                funcs.saveToLocal(Ids.languageComboState, 0, () => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    callbackBtnClick
                  );
                });
                console.log('Languages 3');
              }
            });
            break;
          case PageUrlPatterns.Skills:
            console.log('ok skills:  ', PageUrlPatterns.Skills);
            // parse from json
            funcs.loadFromLocal(Ids.skillsUse, (skills) => {
              //const skills = skillsString.split(" ");
              // console.log('SKILLS', skills);
              if (funcs.isEmpty(skills) || skills.length == 0) {
                funcs.loadFromLocal(Ids.skills, (skillsAll) => {
                  funcs.saveToLocal(Ids.skillsUse, skillsAll.split(','), () => {
                    setTimeout(() => {
                      funcs.trySelectElementBySelector(
                        document,
                        Controls.skillsInput,
                        0,
                        (input) => {
                          if (input) {
                            input.click();
                          }
                        }
                      );
                    }, 300);
                  });
                });
              } else {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.skillsSearch,
                  0,
                  (search) => {
                    if (search && search.children.length > 0) {
                      search.children[0].click();
                      skills.shift();
                      if (skills.length === 0) {
                        funcs.trySelectElementBySelector(
                          document,
                          Controls.nextBtn,
                          0,
                          callbackBtnClick
                        );
                      } else {
                        funcs.saveToLocal(Ids.skillsUse, skills);
                      }
                    } else {
                      funcs.trySelectElementBySelector(
                        document,
                        Controls.skillsInput,
                        0,
                        callbackDataInput,
                        skills[0]
                      );
                    }
                  }
                );
              }
            });
            // use by counter
            funcs.loadFromLocal(Ids.noSkill, (isNo) => {
              if (isNo === true) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.skillsList,
                  0,
                  (listParent) => {
                    funcs.loadFromLocal(Ids.skillCountState, (count) => {
                      if (
                        !(typeof count === 'number' && count > 7) &&
                        listParent &&
                        listParent.children &&
                        listParent.children.length > 0
                      ) {
                        let c = 0;
                        if (typeof count === 'number') {
                          c = count + 1;
                        }
                        funcs.saveToLocal(Ids.skillCountState, c, () => {
                          listParent.children[0].click();
                        });
                      } else {
                        funcs.saveToLocal(Ids.skillCountState, 0, () => {
                          funcs.trySelectElementBySelector(
                            document,
                            Controls.nextBtn,
                            0,
                            callbackBtnClick
                          );
                        });
                      }
                    });
                  }
                );
              }
            });
            break;
          case PageUrlPatterns.Overview:
            console.log('ok overview:  ', PageUrlPatterns.Overview);
            funcs.loadFromLocal(Ids.overview, (text) => {
              if (!funcs.isEmpty(text) && text.length > 100) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.overviewTextArea,
                  0,
                  callbackDataInput,
                  text
                );
                setTimeout(() => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    callbackBtnClick
                  );
                }, 3000);
              }
            });
            break;
          case PageUrlPatterns.Categories:
            console.log('ok categories:  ', PageUrlPatterns.Categories);
            funcs.trySelectElementBySelector(
              document,
              Controls.categoryAddBtns,
              null,
              (btns) => {
                let i = 0;
                let breaked = false;
                for (i = 0; i < btns.length; i++) {
                  let btn = btns[i];
                  if (btn.ariaLabel.indexOf('Development') !== -1) {
                    breaked = true;
                    btn.click();
                    break;
                  }
                }
                if (breaked) {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    callbackBtnClick
                  );
                }
              }
            );
            break;
          case PageUrlPatterns.Rate:
            console.log('ok rate:  ', PageUrlPatterns.Rate);
            funcs.loadFromLocal(Ids.hourlyInputState, (index) => {
              if (funcs.isEmpty(index) || index === 0) {
                funcs.saveToLocal(Ids.hourlyInputState, 1, () => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.inputHourly,
                    0,
                    callbackDataInput,
                    '35'
                  );
                });
              } else if (index === 1) {
                funcs.saveToLocal(Ids.hourlyInputState, 0, () => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    callbackBtnClick
                  );
                });
              }
            });
            break;
          case PageUrlPatterns.Location:
            console.log('ok location:  ', PageUrlPatterns.Location);
            const faker = new Faker({ locale: [en, en_US] });
            const number = faker.phone.number().replace("-", "");
            funcs.trySelectElementBySelector(
              document,
              Controls.phoneNumberInput,
              0,
              callbackDataInputIfEmpty,
              number.substring(0, Math.min(8, number.length))
            );

            setTimeout(() => {
              funcs.trySelectElementBySelector(
                document,
                Controls.zipCodeInput,
                0,
                callbackDataInputIfEmpty,
                faker.location.zipCode()
              );
              setTimeout(() => {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.streetAddressInput,
                  0,
                  callbackDataInputIfEmpty,
                  faker.location.streetAddress(false)
                );
                // setTimeout(() => {
                //   funcs.trySelectElementBySelector(
                //     document,
                //     Controls.nextBtn,
                //     0,
                //     callbackBtnClick
                //   );
                // }, 300);
              }, 300);
            }, 300);
            break;
          case PageUrlPatterns.Submit:
            console.log('ok submit:  ', PageUrlPatterns.Submit);
            funcs.trySelectElementBySelector(
              document,
              Controls.submitBtn,
              0,
              callbackBtnClick
            );
            break;
          case PageUrlPatterns.Finish:
            console.log('ok finish:  ', PageUrlPatterns.Finish);
            funcs.trySelectElementBySelector(
              document,
              Controls.browseJobBtn,
              0,
              callbackBtnClick
            );
            break;
          default:
            console.log('no Action to do automatically!!!');
        }
      }
    } else {
      return;
    }
  });
}, 2300);
// });
