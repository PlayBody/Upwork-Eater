import funcs from './modules/func';
import Constants from './modules/const';

import { Faker, en, en_US } from '@faker-js/faker';

funcs.log('Content script works!');
funcs.log('Must reload extension for modifications to take effect.');

const { PageUrlPatterns, BtnClassNames, Controls, Ids } = Constants;

const callbackBtnClick = (btn) => {
  funcs.isBtn(btn) && btn.click();
};

const callbackRadioClick = (radio) => {
  if (funcs.isBtn(radio) && !radio.checked) {
    radio.click();
  }
};

const callbackDataInputRelease = (data, input) => {
  if (funcs.isInput(input)) {
    input.click();
    input.value = data;
    const inputEvent = new Event('input', { bubbles: true });
    const blurEvent = new Event('blur', { bubbles: true });
    input.dispatchEvent(inputEvent);
    input.dispatchEvent(blurEvent);
  }
};

const callbackDataInputFocus = (data, input) => {
  if (funcs.isInput(input)) {
    input.click();
    input.value = data;
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }
};

const callbackDataInputIfEmpty = (data, input) => {
  if (input && typeof input.value === 'string' && input.value.length === 0) {
    callbackDataInputRelease(data, input);
  }
};

const working = {
  clipboard: '',
  countryCombo: false,
  cityCombo: 0,
  lastSkill: '',
};

// window.addEventListener('load', function () {
const timerId = setInterval(async function () {
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
              if (working.clipboard === clipboardText) {
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
                  funcs.log(obj);
                  funcs.saveToLocalObj(obj);
                }
              } else {
                obj.noSkill = false;
                funcs.log(obj);
                funcs.saveToLocalObj(obj);
              }
            } catch {
              (e) => {
                funcs.log(e);
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
          funcs.log(
            'ok signUp: ',
            PageUrlPatterns.SignUp,
            working.countryCombo
          );
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
          setTimeout(() => {
            funcs.loadFromLocal(Ids.country, (country) => {
              if (!funcs.isEmpty(country) && country.length) {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.countrySpan,
                  0,
                  (span) => {
                    if (
                      !funcs.isEmpty(span) &&
                      !span.innerHTML.includes(country) &&
                      working.countryCombo === false
                    ) {
                      working.countryCombo = true;
                      funcs.trySelectElementBySelector(
                        document,
                        Controls.countryCombo,
                        0,
                        (combo) => {
                          if (combo) {
                            combo.click();
                            setTimeout(() => {
                              funcs.trySelectElementBySelector(
                                document,
                                Controls.countrySearchInput,
                                0,
                                (input) => {
                                  callbackDataInputFocus(country, input);
                                  setTimeout(() => {
                                    funcs.trySelectElementBySelector(
                                      document,
                                      Controls.countryFirstItem,
                                      0,
                                      (btn) => {
                                        callbackBtnClick(btn);
                                      }
                                    );
                                  }, 1500);
                                }
                              );
                            }, 2500);
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }, 500);
          funcs.trySelectElementBySelector(
            document,
            Controls.cookieAcceptBtn,
            0,
            callbackBtnClick
          );
          const customFaker = new Faker({ locale: [en, en_US] });
          setTimeout(() => {
            funcs.loadFromLocalObj([Ids.firstName, Ids.lastName], (names) => {
              let fname = names.firstName;
              if (funcs.isEmpty(names.firstName)) {
                fname = customFaker.person.firstName();
              }
              funcs.trySelectElementBySelector(
                document,
                Controls.firstNameInput,
                0,
                callbackDataInputIfEmpty,
                fname
              );
              setTimeout(() => {
                let lname = names.lastName;
                if (funcs.isEmpty(names.lastName)) {
                  lname = customFaker.person.lastName();
                }
                funcs.trySelectElementBySelector(
                  document,
                  Controls.lastNameInput,
                  0,
                  callbackDataInputIfEmpty,
                  lname
                );
              }, 100);
              setTimeout(() => {
                setTimeout(() => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.passwordInput,
                    0,
                    callbackDataInputIfEmpty,
                    '][po}{PO=-09+_)('
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
            });
          }, 150);
          setTimeout(() => {
            funcs.trySelectElementBySelector(
              document,
              Controls.emailInput,
              0,
              (input) => {
                if (!funcs.isEmpty(input) && input.value.length > 0) {
                  setTimeout(() => {
                    funcs.trySelectElementBySelector(
                      document,
                      Controls.signupBtn,
                      0,
                      callbackBtnClick
                    );
                  }, 1500);
                }
              }
            );
          }, 100);
          break;
        case PageUrlPatterns.CreateProfile:
          funcs.log('ok create profile:  ', PageUrlPatterns.CreateProfile);
          funcs.trySelectElementByClassName(
            document,
            BtnClassNames.getStart,
            0,
            callbackBtnClick
          );
          break;
        case PageUrlPatterns.Welcome:
          funcs.log('ok welcome:  ', PageUrlPatterns.Welcome);
          funcs.trySelectElementByClassName(
            document,
            BtnClassNames.getStart,
            0,
            callbackBtnClick
          );
          break;
        case PageUrlPatterns.Experience:
          funcs.log('ok exp:  ', PageUrlPatterns.Experience);
          funcs.trySelectElementByClassName(
            document,
            BtnClassNames.skipBtn,
            0,
            callbackBtnClick
          );
          break;
        case PageUrlPatterns.Goal:
          funcs.log('ok goal:  ', PageUrlPatterns.Goal);
          funcs.trySelectElementByClassName(
            document,
            BtnClassNames.skipBtn,
            0,
            callbackBtnClick
          );
          break;
        case PageUrlPatterns.WorkPreference:
          funcs.log('ok prefer:  ', PageUrlPatterns.WorkPreference);
          funcs.trySelectElementByClassName(
            document,
            BtnClassNames.skipBtn,
            0,
            callbackBtnClick
          );
          break;
        case PageUrlPatterns.ResumeImport:
          funcs.log('ok resume:  ', PageUrlPatterns.ResumeImport);
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
              funcs.log('Resume 1');
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
              funcs.log('Resume 2');
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
              funcs.log('Resume 3');
            }
          });
          break;
        case PageUrlPatterns.Title:
          funcs.log('ok: title', PageUrlPatterns.Title);
          funcs.loadFromLocal(Ids.title, (text) => {
            if (typeof text === 'string' && text.indexOf('|') !== -1) {
              funcs.trySelectElementBySelector(
                document,
                Controls.titleInput,
                0,
                callbackDataInputRelease,
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
          funcs.saveToLocal(Ids.languageComboState, 0, () => {
            funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              callbackBtnClick
            );
          });
          break;
        case PageUrlPatterns.Certificate:
          funcs.log('ok certi:  ', PageUrlPatterns.Certificate);
          funcs.saveToLocal(Ids.languageComboState, 0, () => {
            funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              callbackBtnClick
            );
          });
          break;
        case PageUrlPatterns.Languages:
          funcs.log('ok language:  ', PageUrlPatterns.Languages);
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
              funcs.log('Languages 1');
            } else if (index === 1) {
              funcs.trySelectElementBySelector(
                document,
                Controls.languageComboList,
                0,
                (listParent) => {
                  if (!funcs.isEmpty(listParent)) {
                    listParent.children[2].click();
                  }
                }
              );
              funcs.saveToLocal(Ids.languageComboState, 2);
              funcs.log('Languages 2');
            } else if (index === 2) {
              funcs.saveToLocal(Ids.languageComboState, 0, () => {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.nextBtn,
                  0,
                  callbackBtnClick
                );
              });
              setTimeout(() => {
                funcs.saveToLocal(Ids.skillsUse, null);
              }, 200);
              funcs.log('Languages 3');
            }
          });
          break;
        case PageUrlPatterns.Skills:
          funcs.log('ok skills:  ', PageUrlPatterns.Skills);
          // parse from json
          funcs.loadFromLocal(Ids.skillsUse, (skills) => {
            if (funcs.isEmpty(skills) || skills.length == 0) {
              funcs.loadFromLocal(Ids.skills, (skillsAll) => {
                funcs.saveToLocal(
                  Ids.skillsUse,
                  skillsAll.split(',').map((v) => v.trim()),
                  () => {
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
                  }
                );
              });
            } else {
              funcs.log(skills);
              funcs.trySelectElementBySelector(
                document,
                Controls.skillsSearch,
                0,
                (search) => {
                  let checkSkill = false;
                  if (search && search.children.length > 0) {
                    search.children[0].click();
                    checkSkill = true;
                  } else if (working.lastSkill === skills[0]) {
                    checkSkill = true;
                  }
                  if (checkSkill) {
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
                    working.lastSkill = skills[0];
                    funcs.trySelectElementBySelector(
                      document,
                      Controls.skillsInput,
                      0,
                      callbackDataInputRelease,
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
          funcs.log('ok overview:  ', PageUrlPatterns.Overview);
          funcs.loadFromLocal(Ids.overview, (text) => {
            if (!funcs.isEmpty(text) && text.length > 100) {
              funcs.trySelectElementBySelector(
                document,
                Controls.overviewTextArea,
                0,
                callbackDataInputRelease,
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
          funcs.log('ok categories:  ', PageUrlPatterns.Categories);
          funcs.trySelectElementBySelector(
            document,
            Controls.categoryAddBtns,
            null,
            (btns) => {
              let i = 0;
              const len = btns.length;
              funcs.log('btns', btns);
              for (i = 0; i < len; i++) {
                let btn = btns[i];
                if (btn.ariaLabel.includes('Development')) {
                  btn.click();
                  //break;
                }
              }
              if (i === len) {
                setTimeout(() => {
                  funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    callbackBtnClick
                  );
                }, 1000);
              }
            }
          );
          break;
        case PageUrlPatterns.Rate:
          funcs.log('ok rate:  ', PageUrlPatterns.Rate);
          funcs.loadFromLocal(Ids.hourlyInputState, (index) => {
            if (funcs.isEmpty(index) || index === 0) {
              funcs.saveToLocal(Ids.hourlyInputState, 1, () => {
                funcs.trySelectElementBySelector(
                  document,
                  Controls.inputHourly,
                  0,
                  callbackDataInputRelease,
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
          funcs.log('ok location:  ', PageUrlPatterns.Location);
          const faker = new Faker({ locale: [en, en_US] });
          funcs.loadFromLocal(Ids.phoneNumber, (phoneNumber) => {
            let number = phoneNumber;
            if (funcs.isEmpty(phoneNumber)) {
              number = funcs.getRandomPhoneNumbers();
            }
            funcs.trySelectElementBySelector(
              document,
              Controls.phoneNumberInput,
              0,
              callbackDataInputIfEmpty,
              number
            );
          });
          setTimeout(() => {
            funcs.loadFromLocal(Ids.zipCode, (zipCode) => {
              let zip = zipCode;
              if (funcs.isEmpty(zipCode)) {
                zip = funcs.getRandomZipCode();
              }
              funcs.trySelectElementBySelector(
                document,
                Controls.zipCodeInput,
                0,
                callbackDataInputIfEmpty,
                zip
              );
            });

            setTimeout(() => {
              funcs.loadFromLocal(Ids.address, (address) => {
                let addr = address;
                if (funcs.isEmpty(address)) {
                  addr = faker.location.streetAddress();
                }
                funcs.trySelectElementBySelector(
                  document,
                  Controls.streetAddressInput,
                  0,
                  callbackDataInputIfEmpty,
                  addr
                );
              });
            }, 300);
          }, 300);
          funcs.loadFromLocal(Ids.city, (city) => {
            if (funcs.isEmpty(city)) {
              c = String.fromCharCode(
                Math.floor(Math.random() * 10) + 'A'.charCodeAt(0)
              );
              funcs.saveToLocal(Ids.city, c);
            } else {
              funcs.trySelectElementBySelector(
                document,
                Controls.cityOther,
                0,
                (other) => {
                  if (funcs.isInput(other) && other.value.length === 0) {
                    funcs.trySelectElementBySelector(
                      document,
                      Controls.cityInput,
                      0,
                      (input) => {
                        if (funcs.isInput(input)) {
                          if (input.value && input.value.includes(city)) {
                            working.cityCombo++;
                            if (working.cityCombo < 5) {
                              return;
                            } else {
                              working.cityCombo = 0;
                            }
                          }
                          callbackDataInputFocus(city, input);
                          setTimeout(() => {
                            funcs.trySelectElementBySelector(
                              document,
                              Controls.cityFirstItem,
                              0,
                              callbackBtnClick
                            );
                          }, 3500);
                        }
                      }
                    );
                  }
                }
              );
            }
          });
          break;
        case PageUrlPatterns.Submit:
          funcs.log('ok submit:  ', PageUrlPatterns.Submit);
          funcs.trySelectElementBySelector(
            document,
            Controls.submitBtn,
            0,
            callbackBtnClick
          );
          break;
        case PageUrlPatterns.Finish:
          funcs.log('ok finish:  ', PageUrlPatterns.Finish);
          funcs.trySelectElementBySelector(
            document,
            Controls.browseJobBtn,
            0,
            callbackBtnClick
          );
          clearInterval(timerId);
          break;
        default:
          funcs.log('no Action to do automatically!!!');
      }
    }
  } else {
    return;
  }
}, 2300);
// });
