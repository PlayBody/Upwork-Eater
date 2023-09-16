import Funcs from './modules/func';
import Constants from './modules/const';
import Callbacks from './modules/callback';

import { Faker, en, en_US } from '@faker-js/faker';

Funcs.log('Content script works!');
Funcs.log('Must reload extension for modifications to take effect.');

const { PageUrlPatterns, BtnClassNames, Controls, Ids } = Constants;

const working = {
  clipboard: '',
  countryCombo: false,
  cityCombo: 0,
  lastSkill: '',
};

const timerId = setInterval(() => {
  Funcs.loadFromLocal(Ids.isExit, (isExit) => {
    if(isExit){
      clearInterval(timerId);
      return;
    }
    if (Funcs.isUpworkPage(document)) {
      Funcs.log(working);
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
                Funcs.isEmpty(obj.title) ||
                Funcs.isEmpty(obj.overview) ||
                Funcs.isEmpty(obj.skills)
              ) {
                if (!Funcs.isEmpty(obj.noSkill) && obj.noSkill === true) {
                  Funcs.log(obj);
                  Funcs.saveToLocalObj(obj);
                }
              } else {
                obj.noSkill = false;
                Funcs.log(obj);
                Funcs.saveToLocalObj(obj);
              }
            } catch {
              (e) => {
                Funcs.log(e);
              };
            }
          })
          .catch(function (error) {
            console.error('Error reading clipboard:', error);
          });
      }
      const whichPage = Funcs.whichUpworkPage(document);
      switch (whichPage) {
        case PageUrlPatterns.SignUp:
        case PageUrlPatterns.SignUpDest:
          Funcs.log('ok signUp: ', PageUrlPatterns.SignUp, working.countryCombo);
          Funcs.loadFromLocal(Ids.signupSelectState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Funcs.saveToLocal(Ids.signupSelectState, 1, () => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.signUpFreelancerRadio,
                  0,
                  Callbacks.clickCheckbox
                );
              });
            } else if (index === 1) {
              Funcs.saveToLocal(Ids.signupSelectState, 0, () => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.applyAsFreelancerBtn,
                  0,
                  Callbacks.clickButton
                );
              });
            }
          });
          setTimeout(() => {
            Funcs.loadFromLocal(Ids.country, (country) => {
              if (!Funcs.isEmpty(country) && country.length) {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.countrySpan,
                  0,
                  (span) => {
                    if (
                      !Funcs.isEmpty(span) &&
                      !span.innerHTML.includes(country) &&
                      working.countryCombo === false
                    ) {
                      working.countryCombo = true;
                      Funcs.trySelectElementBySelector(
                        document,
                        Controls.countryCombo,
                        0,
                        (combo) => {
                          if (combo) {
                            combo.click();
                            setTimeout(() => {
                              Funcs.trySelectElementBySelector(
                                document,
                                Controls.countrySearchInput,
                                0,
                                (input) => {
                                  Callbacks.inputTextNotBlur(country, input);
                                  setTimeout(() => {
                                    Funcs.trySelectElementBySelector(
                                      document,
                                      Controls.countryFirstItem,
                                      0,
                                      (btn) => {
                                        Callbacks.clickButton(btn);
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
          Funcs.trySelectElementBySelector(
            document,
            Controls.cookieAcceptBtn,
            0,
            Callbacks.clickButton
          );
          const customFaker = new Faker({ locale: [en, en_US] });
          setTimeout(() => {
            Funcs.loadFromLocalObj([Ids.firstName, Ids.lastName], (names) => {
              let fname = names.firstName;
              if (Funcs.isEmpty(names.firstName)) {
                fname = customFaker.person.firstName();
              }
              Funcs.trySelectElementBySelector(
                document,
                Controls.firstNameInput,
                0,
                Callbacks.inputTextIfEmpty,
                fname
              );
              setTimeout(() => {
                let lname = names.lastName;
                if (Funcs.isEmpty(names.lastName)) {
                  lname = customFaker.person.lastName();
                }
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.lastNameInput,
                  0,
                  Callbacks.inputTextIfEmpty,
                  lname
                );
              }, 100);
              setTimeout(() => {
                setTimeout(() => {
                  Funcs.trySelectElementBySelector(
                    document,
                    Controls.passwordInput,
                    0,
                    Callbacks.inputTextIfEmpty,
                    '][po}{PO=-09+_)('
                  );
                  setTimeout(() => {
                    Funcs.trySelectElementBySelector(
                      document,
                      Controls.agreeTerm,
                      0,
                      Callbacks.clickCheckbox
                    );
                  }, 200);
                }, 200);
              }, 200);
            });
          }, 150);
          setTimeout(() => {
            Funcs.trySelectElementBySelector(
              document,
              Controls.emailInput,
              0,
              (input) => {
                if (!Funcs.isEmpty(input) && input.value.length > 0) {
                  setTimeout(() => {
                    Funcs.trySelectElementBySelector(
                      document,
                      Controls.signupBtn,
                      0,
                      Callbacks.clickButton
                    );
                  }, 1500);
                }
              }
            );
          }, 100);
          break;
        case PageUrlPatterns.CreateProfile:
          Funcs.log('ok create profile:  ', PageUrlPatterns.CreateProfile);
          Funcs.trySelectElementByClassName(
            document,
            BtnClassNames.getStart,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Welcome:
          Funcs.log('ok welcome:  ', PageUrlPatterns.Welcome);
          Funcs.trySelectElementByClassName(
            document,
            BtnClassNames.getStart,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Experience:
          Funcs.log('ok exp:  ', PageUrlPatterns.Experience);
          Funcs.trySelectElementByClassName(
            document,
            BtnClassNames.skipBtn,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Goal:
          Funcs.log('ok goal:  ', PageUrlPatterns.Goal);
          Funcs.trySelectElementByClassName(
            document,
            BtnClassNames.skipBtn,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.WorkPreference:
          Funcs.log('ok prefer:  ', PageUrlPatterns.WorkPreference);
          Funcs.trySelectElementByClassName(
            document,
            BtnClassNames.skipBtn,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.ResumeImport:
          Funcs.log('ok resume:  ', PageUrlPatterns.ResumeImport);
          Funcs.loadFromLocal(Ids.resumeImportState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.uploadResumeBtn,
                0,
                (btn) => {
                  Funcs.saveToLocal(Ids.resumeImportState, 1, () => {
                    Callbacks.clickButton(btn);
                  });
                }
              );
              Funcs.log('Resume 1');
            } else if (index === 1) {
              setTimeout(() => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.resumeChooseBtn,
                  0,
                  (btn) => {
                    if (Funcs.isBtn(btn)) {
                      try {
                        btn.click();
                        Funcs.saveToLocal(Ids.resumeImportState, 2, () => {});
                      } catch {
                        // ignore error
                      }
                    }
                  }
                );
              }, 500);
              Funcs.log('Resume 2');
            } else if (index === 2) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.resumeContinueBtn,
                0,
                (btn) => {
                  if (Funcs.isBtn(btn)) {
                    setTimeout(() => {
                      Funcs.saveToLocal(Ids.resumeImportState, 0, () => {
                        Callbacks.clickButton(btn);
                      });
                    }, 1000);
                  }
                }
              );
              Funcs.log('Resume 3');
            }
          });
          break;
        case PageUrlPatterns.Title:
          Funcs.log('ok: title', PageUrlPatterns.Title);
          Funcs.loadFromLocal(Ids.title, (text) => {
            if (typeof text === 'string' && text.indexOf('|') !== -1) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.titleInput,
                0,
                Callbacks.inputText,
                text
              );
              setTimeout(function () {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.nextBtn,
                  0,
                  Callbacks.clickButton
                );
              }, 500);
            }
          });
          break;
        case PageUrlPatterns.Employeement:
          Funcs.trySelectElementBySelector(
            document,
            Controls.nextBtn,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Education:
          Funcs.saveToLocal(Ids.languageComboState, 0, () => {
            Funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              Callbacks.clickButton
            );
          });
          break;
        case PageUrlPatterns.Certificate:
          Funcs.log('ok certi:  ', PageUrlPatterns.Certificate);
          Funcs.saveToLocal(Ids.languageComboState, 0, () => {
            Funcs.trySelectElementBySelector(
              document,
              Controls.nextBtn,
              0,
              Callbacks.clickButton
            );
          });
          break;
        case PageUrlPatterns.Languages:
          Funcs.log('ok language:  ', PageUrlPatterns.Languages);
          Funcs.loadFromLocal(Ids.languageComboState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.languageCombo,
                0,
                (combo) => {
                  Funcs.saveToLocal(Ids.languageComboState, 1, () => {
                    combo.click();
                  });
                }
              );
              Funcs.log('Languages 1');
            } else if (index === 1) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.languageComboList,
                0,
                (listParent) => {
                  if (!Funcs.isEmpty(listParent)) {
                    listParent.children[2].click();
                  }
                }
              );
              Funcs.saveToLocal(Ids.languageComboState, 2);
              Funcs.log('Languages 2');
            } else if (index === 2) {
              Funcs.saveToLocal(Ids.languageComboState, 0, () => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.nextBtn,
                  0,
                  Callbacks.clickButton
                );
              });
              setTimeout(() => {
                Funcs.saveToLocal(Ids.skillsUse, null);
              }, 200);
              Funcs.log('Languages 3');
            }
          });
          break;
        case PageUrlPatterns.Skills:
          Funcs.log('ok skills:  ', PageUrlPatterns.Skills);
          // parse from json
          Funcs.loadFromLocal(Ids.skillsUse, (skills) => {
            if (Funcs.isEmpty(skills) || skills.length == 0) {
              Funcs.loadFromLocal(Ids.skills, (skillsAll) => {
                Funcs.saveToLocal(
                  Ids.skillsUse,
                  skillsAll.split(',').map((v) => v.trim()),
                  () => {
                    setTimeout(() => {
                      Funcs.trySelectElementBySelector(
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
              Funcs.log(skills);
              Funcs.trySelectElementBySelector(
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
                      Funcs.trySelectElementBySelector(
                        document,
                        Controls.nextBtn,
                        0,
                        Callbacks.clickButton
                      );
                    } else {
                      Funcs.saveToLocal(Ids.skillsUse, skills);
                    }
                  } else {
                    working.lastSkill = skills[0];
                    Funcs.trySelectElementBySelector(
                      document,
                      Controls.skillsInput,
                      0,
                      Callbacks.inputText,
                      skills[0]
                    );
                  }
                }
              );
            }
          });
          // use by counter
          Funcs.loadFromLocal(Ids.noSkill, (isNo) => {
            if (isNo === true) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.skillsList,
                0,
                (listParent) => {
                  Funcs.loadFromLocal(Ids.skillCountState, (count) => {
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
                      Funcs.saveToLocal(Ids.skillCountState, c, () => {
                        listParent.children[0].click();
                      });
                    } else {
                      Funcs.saveToLocal(Ids.skillCountState, 0, () => {
                        Funcs.trySelectElementBySelector(
                          document,
                          Controls.nextBtn,
                          0,
                          Callbacks.clickButton
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
          Funcs.log('ok overview:  ', PageUrlPatterns.Overview);
          Funcs.loadFromLocal(Ids.overview, (text) => {
            if (!Funcs.isEmpty(text) && text.length > 100) {
              Funcs.trySelectElementBySelector(
                document,
                Controls.overviewTextArea,
                0,
                Callbacks.inputText,
                text
              );
              setTimeout(() => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.nextBtn,
                  0,
                  Callbacks.clickButton
                );
              }, 3000);
            }
          });
          break;
        case PageUrlPatterns.Categories:
          Funcs.log('ok categories:  ', PageUrlPatterns.Categories);
          Funcs.trySelectElementBySelector(
            document,
            Controls.categoryAddBtns,
            null,
            (btns) => {
              let i = 0;
              const len = btns.length;
              Funcs.log('btns', btns);
              for (i = 0; i < len; i++) {
                let btn = btns[i];
                if (btn.ariaLabel.includes('Development')) {
                  btn.click();
                  //break;
                }
              }
              if (i === len) {
                setTimeout(() => {
                  Funcs.trySelectElementBySelector(
                    document,
                    Controls.nextBtn,
                    0,
                    Callbacks.clickButton
                  );
                }, 1000);
              }
            }
          );
          break;
        case PageUrlPatterns.Rate:
          Funcs.log('ok rate:  ', PageUrlPatterns.Rate);
          Funcs.loadFromLocal(Ids.hourlyInputState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Funcs.saveToLocal(Ids.hourlyInputState, 1, () => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.inputHourly,
                  0,
                  Callbacks.inputText,
                  '35'
                );
              });
            } else if (index === 1) {
              Funcs.saveToLocal(Ids.hourlyInputState, 0, () => {
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.nextBtn,
                  0,
                  Callbacks.clickButton
                );
              });
            }
          });
          break;
        case PageUrlPatterns.Location:
          Funcs.log('ok location:  ', PageUrlPatterns.Location);
          const faker = new Faker({ locale: [en, en_US] });
          Funcs.loadFromLocal(Ids.phoneNumber, (phoneNumber) => {
            let number = phoneNumber;
            if (Funcs.isEmpty(phoneNumber)) {
              number = Funcs.getRandomPhoneNumbers();
            }
            Funcs.trySelectElementBySelector(
              document,
              Controls.phoneNumberInput,
              0,
              Callbacks.inputTextIfEmpty,
              number
            );
          });
          setTimeout(() => {
            Funcs.loadFromLocal(Ids.zipCode, (zipCode) => {
              let zip = zipCode;
              if (Funcs.isEmpty(zipCode)) {
                zip = Funcs.getRandomZipCode();
              }
              Funcs.trySelectElementBySelector(
                document,
                Controls.zipCodeInput,
                0,
                Callbacks.inputTextIfEmpty,
                zip
              );
            });

            setTimeout(() => {
              Funcs.loadFromLocal(Ids.address, (address) => {
                let addr = address;
                if (Funcs.isEmpty(address)) {
                  addr = faker.location.streetAddress();
                }
                Funcs.trySelectElementBySelector(
                  document,
                  Controls.streetAddressInput,
                  0,
                  Callbacks.inputTextIfEmpty,
                  addr
                );
              });
            }, 300);
          }, 300);
          Funcs.loadFromLocal(Ids.city, (city) => {
            if (Funcs.isEmpty(city)) {
              c = String.fromCharCode(
                Math.floor(Math.random() * 10) + 'A'.charCodeAt(0)
              );
              Funcs.saveToLocal(Ids.city, c);
            } else {
              Funcs.trySelectElementBySelector(
                document,
                Controls.cityOther,
                0,
                (other) => {
                  if (Funcs.isInput(other) && other.value.length === 0) {
                    Funcs.trySelectElementBySelector(
                      document,
                      Controls.cityInput,
                      0,
                      (input) => {
                        if (Funcs.isInput(input)) {
                          if (input.value && input.value.includes(city)) {
                            working.cityCombo++;
                            if (working.cityCombo < 5) {
                              return;
                            } else {
                              working.cityCombo = 0;
                            }
                          }
                          Callbacks.inputTextNotBlur(city, input);
                          setTimeout(() => {
                            Funcs.trySelectElementBySelector(
                              document,
                              Controls.cityFirstItem,
                              0,
                              Callbacks.clickButton
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
          Funcs.log('ok submit:  ', PageUrlPatterns.Submit);
          Funcs.trySelectElementBySelector(
            document,
            Controls.submitBtn,
            0,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Finish:
          Funcs.log('ok finish:  ', PageUrlPatterns.Finish);
          Funcs.trySelectElementBySelector(
            document,
            Controls.browseJobBtn,
            0,
            Callbacks.clickButton
          );
          clearInterval(timerId);
          Funcs.saveToLocal(Ids.isExit, true);
          break;
        default:
          Funcs.log('no Action to do automatically!!!');
      }
    }
  })
}, 2300);
