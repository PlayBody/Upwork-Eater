import Funcs from './modules/func';
import Constants from './modules/const';
import Callbacks from './modules/callback';
import Debuger from './modules/debuger';
import Io from './modules/io';
import Dom from './modules/dom';
import { Faker, en, en_US } from '@faker-js/faker';

Debuger.log('Content script works!');
Debuger.log('Must reload extension for modifications to take effect.');

const { PageUrlPatterns, BtnClassNames, Controls, Ids } = Constants;

const working = {
  clipboard: '',
  cityCombo: 0,
  lastSkill: '',
};

const timerId = setInterval(() => {
  Io.loadFromLocal(Ids.isExit, (isExit) => {
    if (isExit) {
      clearInterval(timerId);
      return;
    }
    Dom.setDocument(document);
    if (Dom.isUpworkPage()) {
      Debuger.log(working);
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
                  Debuger.log(obj);
                  Io.saveToLocalObj(obj);
                }
              } else {
                obj.noSkill = false;
                Debuger.log(obj);
                Io.saveToLocalObj(obj);
              }
            } catch {
              (e) => {
                Debuger.log(e);
              };
            }
          })
          .catch(function (error) {
            console.error('Error reading clipboard:', error);
          });
      }
      const whichPage = Dom.whichUpworkPage();
      switch (whichPage) {
        case PageUrlPatterns.SignUp:
        case PageUrlPatterns.SignUpDest:
          Debuger.log(PageUrlPatterns.SignUpDest);
          Dom.selectElementByQuery(
            Controls.radioSignUpByLancer,
            Callbacks.clickCheckbox,
            () => {
              Dom.selectElementByQuery(
                Controls.btnApplyAsLancer,
                Callbacks.clickButton
              );
            }
          );
          Io.loadFromLocal(Ids.country, (country) => {
            if (!Funcs.isEmpty(country) && country.length) {
              Dom.selectElementByQuery(Controls.spanCountry, (span) => {
                if (
                  !Funcs.isEmpty(span) &&
                  !span.innerHTML.includes(country)
                ) {
                  Dom.selectElementByQuery(
                    Controls.comboCountry,
                    Callbacks.clickButton,
                    () => {
                      setTimeout(() => {
                        Dom.selectElementByQuery(
                          Controls.inputCountrySearch,
                          Callbacks.inputTextNotBlur,
                          [
                            country,
                            () => {
                              setTimeout(() => {
                                Dom.selectElementByQuery(
                                  Controls.liCountryFirst,
                                  Callbacks.clickButton
                                );
                              }, 1500);
                            },
                          ]
                        );
                      }, 2500);
                    }
                  );
                }
              });
            }
          });
          Dom.selectElementByQuery(
            Controls.btnCookieAccept,
            Callbacks.clickButton
          );
          const customFaker = new Faker({ locale: [en, en_US] });
          setTimeout(() => {
            Io.loadFromLocalObj([Ids.firstName, Ids.lastName], (names) => {
              const fname = Funcs.isEmpty(names.firstName) ? customFaker.person.firstName() : names.firstName;
              const lname = Funcs.isEmpty(names.lastName) ? customFaker.person.lastName() : names.lastName;
              Dom.selectElementByQuery(
                Controls.inputFirstName,
                Callbacks.inputTextIfEmpty,
                fname
              );
              Dom.selectElementByQuery(
                Controls.inputLastName,
                Callbacks.inputTextIfEmpty,
                lname
              );
              Dom.selectElementByQuery(
                Controls.inputPassword,
                Callbacks.inputTextIfEmpty,
                '][po}{PO=-09+_)('
              );
              Dom.selectElementByQuery(
                Controls.inputAgreeTerm,
                Callbacks.clickCheckbox
              );
            });
          }, 100);
          setTimeout(() => {
            Dom.selectElementByQuery(Controls.inputEmail, (input) => {
              if (
                !Funcs.isInput(input) &&
                input.value.length > 0
              ) {
                setTimeout(() => {
                  Dom.selectElementByQuery(
                    Controls.btnSignUp,
                    Callbacks.clickButton
                  );
                }, 1500);
              }
            });
          }, 100);
          break;
        case PageUrlPatterns.CreateProfile:
          Debuger.log('ok create profile:  ', PageUrlPatterns.CreateProfile);
          Dom.selectElementByClass(
            BtnClassNames.getStart,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Welcome:
          Debuger.log('ok welcome:  ', PageUrlPatterns.Welcome);
          Dom.selectElementByClass(
            BtnClassNames.getStart,
            Callbacks.clickButton
          );
          break;
        case PageUrlPatterns.Experience:
          Debuger.log('ok exp:  ', PageUrlPatterns.Experience);
          Dom.selectElementByClass(BtnClassNames.skip, Callbacks.clickButton);
          break;
        case PageUrlPatterns.Goal:
          Debuger.log('ok goal:  ', PageUrlPatterns.Goal);
          Dom.selectElementByClass(BtnClassNames.skip, Callbacks.clickButton);
          break;
        case PageUrlPatterns.WorkPreference:
          Debuger.log('ok prefer:  ', PageUrlPatterns.WorkPreference);
          Dom.selectElementByClass(BtnClassNames.skip, Callbacks.clickButton);
          break;
        case PageUrlPatterns.ResumeImport:
          Debuger.log('ok resume:  ', PageUrlPatterns.ResumeImport);
          Io.loadFromLocal(Ids.resumeImportState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Dom.selectElementByQuery(Controls.btnUploadResume, (btn) => {
                Io.saveToLocal(Ids.resumeImportState, 1, () => {
                  Callbacks.clickButton(btn);
                });
              });
              Debuger.log('Resume 1');
            } else if (index === 1) {
              setTimeout(() => {
                Dom.selectElementByQuery(Controls.btnResumeChoose, (btn) => {
                  if (Funcs.isButton(btn)) {
                    try {
                      btn.click();
                      Io.saveToLocal(Ids.resumeImportState, 2, () => {});
                    } catch {
                      // ignore error
                    }
                  }
                });
              }, 500);
              Debuger.log('Resume 2');
            } else if (index === 2) {
              Dom.selectElementByQuery(Controls.btnResumeContinue, (btn) => {
                if (Funcs.isButton(btn)) {
                  setTimeout(() => {
                    Io.saveToLocal(Ids.resumeImportState, 0, () => {
                      Callbacks.clickButton(btn);
                    });
                  }, 1000);
                }
              });
              Debuger.log('Resume 3');
            }
          });
          break;
        case PageUrlPatterns.Title:
          Debuger.log('ok: title', PageUrlPatterns.Title);
          Io.loadFromLocal(Ids.title, (text) => {
            if (typeof text === 'string' && text.indexOf('|') !== -1) {
              Dom.selectElementByQuery(
                Controls.inputTitle,
                Callbacks.inputText,
                text
              );
              setTimeout(function () {
                Dom.selectElementByQuery(
                  Controls.btnNext,
                  Callbacks.clickButton
                );
              }, 500);
            }
          });
          break;
        case PageUrlPatterns.Employeement:
          Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          break;
        case PageUrlPatterns.Education:
          Io.saveToLocal(Ids.languageComboState, 0, () => {
            Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          });
          break;
        case PageUrlPatterns.Certificate:
          Debuger.log('ok certi:  ', PageUrlPatterns.Certificate);
          Io.saveToLocal(Ids.languageComboState, 0, () => {
            Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          });
          break;
        case PageUrlPatterns.Languages:
          Debuger.log('ok language:  ', PageUrlPatterns.Languages);
          Io.loadFromLocal(Ids.languageComboState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Dom.selectElementByQuery(Controls.comboLanguage, (combo) => {
                Io.saveToLocal(Ids.languageComboState, 1, () => {
                  combo.click();
                });
              });
              Debuger.log('Languages 1');
            } else if (index === 1) {
              Dom.selectElementByQuery(Controls.ulLanguage, (listParent) => {
                if (!Funcs.isEmpty(listParent)) {
                  listParent.children[2].click();
                }
              });
              Io.saveToLocal(Ids.languageComboState, 2);
              Debuger.log('Languages 2');
            } else if (index === 2) {
              Io.saveToLocal(Ids.languageComboState, 0, () => {
                Dom.selectElementByQuery(
                  Controls.btnNext,
                  Callbacks.clickButton
                );
              });
              setTimeout(() => {
                Io.saveToLocal(Ids.skillsUse, null);
              }, 200);
              Debuger.log('Languages 3');
            }
          });
          break;
        case PageUrlPatterns.Skills:
          Debuger.log('ok skills:  ', PageUrlPatterns.Skills);
          Io.loadFromLocal(Ids.skillsUse, (skills) => {
            if (Funcs.isEmpty(skills) || skills.length == 0) {
              Io.loadFromLocal(Ids.skills, (skillsAll) => {
                Io.saveToLocal(
                  Ids.skillsUse,
                  skillsAll.split(',').map((v) => v.trim()),
                  () => {
                    setTimeout(() => {
                      Dom.selectElementByQuery(
                        Controls.inputSkills,
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
              Debuger.log(skills);
              Dom.selectElementByQuery(Controls.ulSkillsSearch, (search) => {
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
                    Dom.selectElementByQuery(
                      Controls.btnNext,
                      Callbacks.clickButton
                    );
                  } else {
                    Io.saveToLocal(Ids.skillsUse, skills);
                  }
                } else {
                  working.lastSkill = skills[0];
                  Dom.selectElementByQuery(
                    Controls.inputSkills,
                    Callbacks.inputText,
                    skills[0]
                  );
                }
              });
            }
          });
          // use by counter
          Io.loadFromLocal(Ids.noSkill, (isNo) => {
            if (isNo === true) {
              Dom.selectElementByQuery(Controls.listSkills, (listParent) => {
                Io.loadFromLocal(Ids.skillCountState, (count) => {
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
                    Io.saveToLocal(Ids.skillCountState, c, () => {
                      listParent.children[0].click();
                    });
                  } else {
                    Io.saveToLocal(Ids.skillCountState, 0, () => {
                      Dom.selectElementByQuery(
                        Controls.btnNext,
                        Callbacks.clickButton
                      );
                    });
                  }
                });
              });
            }
          });
          break;
        case PageUrlPatterns.Overview:
          Debuger.log('ok overview:  ', PageUrlPatterns.Overview);
          Io.loadFromLocal(Ids.overview, (text) => {
            if (!Funcs.isEmpty(text) && text.length > 100) {
              Dom.selectElementByQuery(
                Controls.txtOverView,
                Callbacks.inputText,
                text
              );
              setTimeout(() => {
                Dom.selectElementByQuery(
                  Controls.btnNext,
                  Callbacks.clickButton
                );
              }, 3000);
            }
          });
          break;
        case PageUrlPatterns.Categories:
          Debuger.log('ok categories:  ', PageUrlPatterns.Categories);
          Dom.selectElementByQuery(
            Controls.btnCategory,
            (btns) => {
              let i = 0;
              const len = btns.length;
              Debuger.log('btns', btns);
              for (i = 0; i < len; i++) {
                let btn = btns[i];
                if (btn.ariaLabel.includes('Development')) {
                  btn.click();
                  //break;
                }
              }
              if (i === len) {
                setTimeout(() => {
                  Dom.selectElementByQuery(
                    Controls.btnNext,
                    Callbacks.clickButton
                  );
                }, 1000);
              }
            },
            null,
            null
          );
          break;
        case PageUrlPatterns.Rate:
          Debuger.log('ok rate:  ', PageUrlPatterns.Rate);
          Io.loadFromLocal(Ids.hourlyInputState, (index) => {
            if (Funcs.isEmpty(index) || index === 0) {
              Io.saveToLocal(Ids.hourlyInputState, 1, () => {
                Dom.selectElementByQuery(
                  Controls.inputHourly,
                  Callbacks.inputText,
                  '30'
                );
              });
            } else if (index === 1) {
              Io.saveToLocal(Ids.hourlyInputState, 0, () => {
                Dom.selectElementByQuery(
                  Controls.btnNext,
                  Callbacks.clickButton
                );
              });
            }
          });
          break;
        case PageUrlPatterns.Location:
          Debuger.log('ok location:  ', PageUrlPatterns.Location);
          const faker = new Faker({ locale: [en, en_US] });
          Io.loadFromLocal(Ids.phoneNumber, (phoneNumber) => {
            let number = phoneNumber;
            if (Funcs.isEmpty(phoneNumber)) {
              number = Funcs.getRandomPhoneNumbers();
            }
            Dom.selectElementByQuery(
              Controls.inputPhoneNumber,
              Callbacks.inputTextIfEmpty,
              number
            );
          });
          setTimeout(() => {
            Io.loadFromLocal(Ids.zipCode, (zipCode) => {
              let zip = zipCode;
              if (Funcs.isEmpty(zipCode)) {
                zip = Funcs.getRandomZipCode();
              }
              Dom.selectElementByQuery(
                Controls.inputZipCode,
                Callbacks.inputTextIfEmpty,
                zip
              );
            });

            setTimeout(() => {
              Io.loadFromLocal(Ids.address, (address) => {
                let addr = address;
                if (Funcs.isEmpty(address)) {
                  addr = faker.location.streetAddress();
                }
                Dom.selectElementByQuery(
                  Controls.inputStreetAddress,
                  Callbacks.inputTextIfEmpty,
                  addr
                );
              });
            }, 300);
          }, 300);
          Io.loadFromLocal(Ids.city, (city) => {
            if (Funcs.isEmpty(city)) {
              c = String.fromCharCode(
                Math.floor(Math.random() * 10) + 'A'.charCodeAt(0)
              );
              Io.saveToLocal(Ids.city, c);
            } else {
              Dom.selectElementByQuery(Controls.inputCityOther, (other) => {
                if (Funcs.isInput(other) && other.value.length === 0) {
                  Dom.selectElementByQuery(Controls.inputCity, (input) => {
                    if (Funcs.isInput(input)) {
                      if (input.value && input.value.includes(city)) {
                        working.cityCombo++;
                        if (working.cityCombo < 5) {
                          return;
                        }
                        working.cityCombo = 0;
                      }
                      Callbacks.inputTextNotBlur(city, input);
                      setTimeout(() => {
                        Dom.selectElementByQuery(
                          Controls.liCityFirst,
                          Callbacks.clickButton
                        );
                      }, 3500);
                    }
                  });
                }
              });
            }
          });
          break;
        case PageUrlPatterns.Submit:
          Debuger.log('ok submit:  ', PageUrlPatterns.Submit);
          Dom.selectElementByQuery(Controls.btnSubmit, Callbacks.clickButton);
          break;
        case PageUrlPatterns.Finish:
          Debuger.log('ok finish:  ', PageUrlPatterns.Finish);
          Dom.selectElementByQuery(
            Controls.btnBrowseJob,
            Callbacks.clickButton
          );
          clearInterval(timerId);
          Io.saveToLocal(Ids.isExit, true);
          break;
        default:
          Debuger.log('no Action to do automatically!!!');
      }
    }
  });
}, 3000);
