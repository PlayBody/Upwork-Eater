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
  notApplyAsLancer: true,
  notInputFirstName: true,
  notInputLastName: true,
  notInputPassword: true,
  notClickUploadResume: true,
  notClickResumeChoose: true,
  notUploadResume: true,
  notClickCookieAccpet: true,
  notLocationSimpleInput: true,
  notLocationCityInput: true,
  notAvatarUpload: true,
  notReadyNextOnLocation: true,
  currentSkill: null,
  skills: [],
  clipboard: '',
};

const timerId = setInterval(() => {
  Io.loadFromLocal(Ids.isExit, (isExit) => {
    if (isExit) {
      Debuger.log('upwork auto signup disabled');
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
              Debuger.log('clipboard: ', obj);
              if (
                Funcs.isEmpty(obj.title) ||
                Funcs.isEmpty(obj.overview) ||
                Funcs.isEmpty(obj.skills)
              ) {
                if (!Funcs.isEmpty(obj.noSkill) && obj.noSkill === true) {
                  Debuger.log('saved clipboard', obj);
                  Io.saveToLocalObj(obj);
                }
              } else {
                obj.noSkill = false;
                Debuger.log('saved clipboard', obj);
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
          working.notApplyAsLancer &&
            Dom.selectElementByQuery(
              Controls.radioSignUpByLancer,
              Callbacks.clickCheckbox,
              () => {
                Dom.selectElementByQuery(
                  Controls.btnApplyAsLancer,
                  Callbacks.clickButton,
                  () => {
                    working.notApplyAsLancer = false;
                  }
                );
              }
            );

          Dom.selectElementByQuery(
            Controls.liCountryFirst,
            (li) => {
              if (li.length === 0) {
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
                                Controls.liCountryFirst,
                                (items) => {
                                  if (items && items.length) {
                                    for (let k = 0; k < items.length; k++) {
                                      const item = items[k];
                                      if (item.innerText.includes(country)) {
                                        Callbacks.clickButton(item);
                                        break;
                                      }
                                    }
                                  }
                                },
                                null,
                                null
                              );
                            }, 1000);
                          }
                        );
                      }
                    });
                  }
                });
              }
            },
            null,
            null
          );
          working.notClickCookieAccpet &&
            Dom.selectElementByQuery(
              Controls.btnCookieAccept,
              Callbacks.clickButton,
              () => {
                working.notClickCookieAccpet = false;
              }
            );
          const customFaker = new Faker({ locale: [en, en_US] });
          (working.notInputFirstName ||
            working.notInputLastName ||
            working.notInputPassword) &&
            setTimeout(() => {
              Io.loadFromLocalObj([Ids.firstName, Ids.lastName], (names) => {
                const fname = Funcs.isEmpty(names.firstName)
                  ? customFaker.person.firstName()
                  : names.firstName;
                const lname = Funcs.isEmpty(names.lastName)
                  ? customFaker.person.lastName()
                  : names.lastName;
                working.notInputFirstName &&
                  Dom.selectElementByQuery(
                    Controls.inputFirstName,
                    Callbacks.inputTextIfEmpty,
                    [
                      fname,
                      () => {
                        working.notInputFirstName = false;
                      },
                    ]
                  );
                working.notInputLastName &&
                  Dom.selectElementByQuery(
                    Controls.inputLastName,
                    Callbacks.inputTextIfEmpty,
                    [
                      lname,
                      () => {
                        working.notInputLastName = false;
                      },
                    ]
                  );
                working.notInputPassword &&
                  Dom.selectElementByQuery(
                    Controls.inputPassword,
                    Callbacks.inputTextIfEmpty,
                    [
                      '][po}{PO=-09+_)(',
                      () => {
                        working.notInputPassword = false;
                      },
                    ]
                  );
                Dom.selectElementByQuery(
                  Controls.inputAgreeTerm,
                  Callbacks.clickCheckbox
                );
              });
            }, 100);
          Dom.selectElementByQuery(Controls.inputEmail, (input) => {
            if (Funcs.isInput(input) && input.value.length > 0) {
              Dom.selectElementByQuery(Controls.pVerifingEmail, (p) => {
                if (Funcs.isEmpty(p)) {
                  Dom.selectElementByQuery(
                    Controls.btnSignUp,
                    Callbacks.clickButton
                  );
                }
              });
            }
          });
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
          working.notClickUploadResume &&
            Dom.selectElementByQuery(
              Controls.btnUploadResume,
              Callbacks.clickButton,
              () => {
                working.notClickUploadResume = false;
              }
            );

          !working.notClickUploadResume &&
            working.notClickResumeChoose &&
            Io.loadFromLocalObj([Ids.resumeUrl], (resumeUrls) => {
              const resumeUrl = resumeUrls.resumeUrl;
              if (!Funcs.isEmpty(resumeUrl)) {
                Debuger.log('resume url: ', resumeUrl);
                working.notClickResumeChoose = false;
                Io.loadFile(
                  resumeUrl,
                  `resume.${resumeUrl.split('.').reverse()[0]}`,
                  (file) => {
                    Debuger.log('file load success: ', file);
                    Dom.selectElementByQuery(
                      Controls.inputResumeFile,
                      Callbacks.inputFile,
                      [
                        file,
                        () => {
                          Debuger.log('file input success: ', file.name);
                          working.notUploadResume = false;
                        },
                      ]
                    );
                  }
                );
              }
            });

          !working.notClickUploadResume &&
            !working.notClickResumeChoose &&
            !working.notUploadResume &&
            Dom.selectElementByQuery(
              Controls.btnResumeContinue,
              Callbacks.clickButton
            );

          break;
        case PageUrlPatterns.Title:
          working.notClickUploadResume = true;
          working.notClickResumeChoose = true;
          working.notUploadResume = true;
          Debuger.log('ok: title', PageUrlPatterns.Title);
          Io.loadFromLocal(Ids.title, (text) => {
            if (typeof text === 'string' && text.indexOf('|') !== -1) {
              Dom.selectElementByQuery(
                Controls.inputTitle,
                Callbacks.inputText,
                [
                  text,
                  () => {
                    setTimeout(function () {
                      Dom.selectElementByQuery(
                        Controls.btnNext,
                        Callbacks.clickButton
                      );
                    }, 500);
                  },
                ]
              );
            }
          });
          break;
        case PageUrlPatterns.Employeement:
          Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          break;
        case PageUrlPatterns.Education:
          Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          break;
        case PageUrlPatterns.Certificate:
          Debuger.log('ok certi:  ', PageUrlPatterns.Certificate);
          Io.saveToLocal(Ids.languageComboState, 0, () => {
            Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          });
          break;
        case PageUrlPatterns.Languages:
          Debuger.log('ok language:  ', PageUrlPatterns.Languages);
          Dom.selectElementByQuery(Controls.comboLanguage, (combo) => {
            combo.click();
            setTimeout(() => {
              Dom.selectElementByQuery(Controls.ulLanguage, (listParent) => {
                if (!Funcs.isEmpty(listParent)) {
                  listParent.children[3].click();
                  setTimeout(() => {
                    Dom.selectElementByQuery(
                      Controls.btnNext,
                      Callbacks.clickButton,
                      () => {
                        Io.saveToLocal(Ids.skillsUse, null);
                      }
                    );
                  }, 500);
                }
              });
            }, 1000);
          });
          break;
        case PageUrlPatterns.Skills:
          Debuger.log('ok skills:  ', PageUrlPatterns.Skills);
          let skills = working.skills;
          if (Funcs.isEmpty(skills) || skills.length == 0) {
            if (Funcs.isEmpty(working.currentSkill)) {
              Io.loadFromLocal(Ids.skills, (skillsAll) => {
                working.skills = skillsAll.split(',').map((v) => v.trim());
                Dom.selectElementByQuery(
                  Controls.inputSkills,
                  Callbacks.clickButton
                );
              });
            } else {
              Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
            }
          } else {
            Dom.selectElementByQuery(Controls.ulSkillsSearch, (search) => {
              if (search && search.children.length > 0) {
                return;
              } else {
                working.currentSkill = skills.shift();
                Dom.selectElementByQuery(
                  Controls.inputSkills,
                  Callbacks.inputText,
                  [
                    working.currentSkill,
                    () => {
                      setTimeout(() => {
                        Dom.selectElementByQuery(
                          Controls.ulSkillsSearch,
                          (search) => {
                            if (search && search.children.length > 0) {
                              Callbacks.clickButton(search.children[0]);
                            }
                          }
                        );
                      }, 1700);
                    },
                  ]
                );
              }
            });
          }
          // Io.loadFromLocal(Ids.skillsUse, (skills) => {
          //   if (Funcs.isEmpty(skills) || skills.length == 0) {
          //     Io.loadFromLocal(Ids.skills, (skillsAll) => {
          //       Io.saveToLocal(
          //         Ids.skillsUse,
          //         skillsAll.split(',').map((v) => v.trim()),
          //         () => {
          //           setTimeout(() => {
          //             Dom.selectElementByQuery(
          //               Controls.inputSkills,
          //               (input) => {
          //                 if (input) {
          //                   input.click();
          //                 }
          //               }
          //             );
          //           }, 300);
          //         }
          //       );
          //     });
          //   } else {
          //     Debuger.log(skills);
          //     Dom.selectElementByQuery(Controls.ulSkillsSearch, (search) => {
          //       let checkSkill = false;
          //       if (search && search.children.length > 0) {
          //         search.children[0].click();
          //         checkSkill = true;
          //       } else if (working.currentSkill === skills[0]) {
          //         checkSkill = true;
          //       }
          //       if (checkSkill) {
          //         skills.shift();
          //         if (skills.length === 0) {
          //           Dom.selectElementByQuery(
          //             Controls.btnNext,
          //             Callbacks.clickButton
          //           );
          //         } else {
          //           Io.saveToLocal(Ids.skillsUse, skills);
          //         }
          //       } else {
          //         working.currentSkill = skills[0];
          //         Dom.selectElementByQuery(
          //           Controls.inputSkills,
          //           Callbacks.inputText,
          //           skills[0]
          //         );
          //       }
          //     });
          //   }
          // });
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
          // Io.loadFromLocal(Ids.hourlyInputState, (index) => {
          //   if (Funcs.isEmpty(index) || index === 0) {
          //     Io.saveToLocal(Ids.hourlyInputState, 1, () => {
          //       Dom.selectElementByQuery(
          //         Controls.inputHourly,
          //         Callbacks.inputText,
          //         '30'
          //       );
          //     });
          //   } else if (index === 1) {
          //     Io.saveToLocal(Ids.hourlyInputState, 0, () => {
          //       Dom.selectElementByQuery(
          //         Controls.btnNext,
          //         Callbacks.clickButton
          //       );
          //     });
          //   }
          // });
          Dom.selectElementByQuery(Controls.inputHourly, Callbacks.inputText, [
            '30',
            setTimeout(() => {
              Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
            }, 100),
          ]);
          break;
        case PageUrlPatterns.Location:
          Debuger.log('ok location:  ', PageUrlPatterns.Location);
          const faker = new Faker({ locale: [en, en_US] });
          working.notLocationSimpleInput &&
            Io.loadFromLocalObj(
              [Ids.phoneNumber, Ids.zipCode, Ids.address, Ids.birthday],
              (detail) => {
                const number = Funcs.isEmpty(detail.phoneNumber)
                  ? Funcs.getRandomPhoneNumbers()
                  : detail.phoneNumber;
                const zip = Funcs.isEmpty(detail.zipCode)
                  ? Funcs.getRandomZipCode()
                  : detail.zipCode;
                const addr = Funcs.isEmpty(detail.address)
                  ? faker.location.streetAddress()
                  : detail.address;
                const birthday = Funcs.isEmpty(detail.birthday)
                  ? '1998-12-16'
                  : detail.birthday;
                Dom.selectElementByQuery(
                  Controls.inputPhoneNumber,
                  Callbacks.inputTextIfEmpty,
                  [
                    number,
                    setTimeout(() => {
                      Dom.selectElementByQuery(
                        Controls.inputZipCode,
                        Callbacks.inputTextIfEmpty,
                        [
                          zip,
                          setTimeout(() => {
                            Dom.selectElementByQuery(
                              Controls.inputStreetAddress,
                              Callbacks.inputTextIfEmpty,
                              [
                                addr,
                                setTimeout(() => {
                                  Dom.selectElementByQuery(
                                    Controls.inputBirthday,
                                    Callbacks.inputTextIfEmpty,
                                    [
                                      birthday,
                                      () => {
                                        working.notLocationSimpleInput = false;
                                      },
                                    ]
                                  );
                                }, 50),
                              ]
                            );
                          }, 50),
                        ]
                      );
                    }, 50),
                  ]
                );
              }
            );

          working.notLocationCityInput &&
            !working.notLocationSimpleInput &&
            Io.loadFromLocal(Ids.city, (pattern) => {
              let city = pattern;
              if (Funcs.isEmpty(city)) {
                city = String.fromCharCode(
                  Math.floor(Math.random() * 10) + 'A'.charCodeAt(0)
                );
              }

              Dom.selectElementByQuery(Controls.inputCityOther, (other) => {
                if (Funcs.isInput(other) && other.value.length === 0) {
                  Dom.selectElementByQuery(
                    Controls.inputCity,
                    Callbacks.inputTextNotBlur,
                    [
                      city,
                      () => {
                        setTimeout(() => {
                          Dom.selectElementByQuery(
                            Controls.liCityFirst,
                            Callbacks.clickButton,
                            () => {
                              working.notLocationCityInput = false;
                            }
                          );
                        }, 2000);
                      },
                    ]
                  );
                }
              });
            });

          !working.notLocationSimpleInput &&
            !working.notLocationCityInput &&
            working.notAvatarUpload &&
            Io.loadFromLocalObj([Ids.avatarUrl], (avatarUrls) => {
              const avatarUrl = avatarUrls.avatarUrl;
              if (!Funcs.isEmpty(avatarUrl)) {
                Debuger.log('avatar url: ', avatarUrl);
                working.notAvatarUpload = false;
                Io.loadFile(
                  avatarUrl,
                  `avatar.${avatarUrl.split('.').reverse()[0]}`,
                  (file) => {
                    Debuger.log('avatar load success: ', file);
                    Dom.selectElementByQuery(
                      Controls.btnUploadPhoto,
                      Callbacks.clickButton,
                      () => {
                        setTimeout(() => {
                          Dom.selectElementByQuery(
                            Controls.inputAvatarFile,
                            Callbacks.inputFile,
                            [
                              file,
                              () => {
                                Debuger.log(
                                  'avatar input success: ',
                                  file.name
                                );
                                setTimeout(() => {
                                  Dom.selectElementByQuery(
                                    Controls.btnAttachPhoto,
                                    Callbacks.clickButton,
                                    () => {
                                      working.notReadyNextOnLocation = false;
                                    }
                                  );
                                }, 1000);
                              },
                            ]
                          );
                        }, 100);
                      }
                    );
                  }
                );
              }
            });

          !working.notReadyNextOnLocation &&
            Dom.selectElementByQuery(Controls.btnNext, Callbacks.clickButton);
          break;
        case PageUrlPatterns.Submit:
          working.notAvatarUpload = true;
          working.notLocationSimpleInput = true;
          working.notLocationCityInput = true;
          working.notReadyNextOnLocation = true;
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
}, 1800);
