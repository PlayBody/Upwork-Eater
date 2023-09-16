import Constants from "./const";

const debug = false;

const funcs = {
  log: (message, ...params) => {
    debug && console.log(message, ...params);
  },
  getRandomPhoneNumbers: () => {
    let randomNumber = Math.floor(Math.random() * 100000000);
    let numberString = randomNumber.toString().padStart(8, '0');
    return numberString;
  },
  getRandomZipCode: () => {
    let randomNumber = Math.floor(Math.random() * 100000);
    let numberString = randomNumber.toString().padStart(5, '0');
    return numberString;
  },
  saveToLocal: (key, value, callback = null) => {
    chrome.storage.local.get(null, function(items) {
      items[key] = value;
      chrome.storage.local.set(items, function() {
        if(!!callback && typeof callback === 'function'){
          callback();
        }
      })
    });
  },
  
  saveToLocalObj: (obj) => {
    chrome.storage.local.get(null, function(items) {
      items = {...items, ...obj};
      chrome.storage.local.set(items, ()=>{})
    });
  },

  loadFromLocal: (key, callback = null) => {
    if(!!callback && typeof callback === 'function'){
      chrome.storage.local.get([key], function(items) {
        callback(items[key]);
      });
    }
  },

  loadFromLocalObj: (keys, callback = null) => {
    if(!!callback && typeof callback === 'function'){
      chrome.storage.local.get(keys, function(items) {
        callback(items);
      });
    }
  },

  isEmpty: (e) => {
    if (e === undefined || e === null) {
      return true;
    }
    return false;
  },

  isUpworkPage: (document) => {
    const currentUrl = document.location.href;
    return currentUrl.includes('upwork.com');
  },

  whichUpworkPage: (document) => {
    const currentUrl = document.location.href;
    var whichPage = '';
    Object.keys(Constants.PageUrlPatterns).map((e) => {
      const page = Constants.PageUrlPatterns[e];
      if (currentUrl.endsWith(page)) {
        whichPage = page;
      }
    });
    return whichPage;
  },

  clickButton: (btn) => {
    btn.then(e => {
    })
  },

  isBtn: (e) => {
    if (!funcs.isEmpty(e) && typeof e.click === 'function') {
      return true;
    } else {
      return false;
    }
  },

  isInput: (e) => {
    if (!funcs.isEmpty(e) && (typeof e.value === 'string'||typeof e.innerHTML === 'string')) {
      return true;
    } else {
      return false;
    }
  },

  selectElement: (document, identifier, index, callback, inputData, isByClassName) => {
    let findElements;
    if(isByClassName === true){
      findElements = document.getElementsByClassName(identifier);
    } else {
      findElements = document.querySelectorAll(identifier);
    }
    let findElement;
    if(index == null){
      findElement = findElements;
    } else {
      findElement = findElements[index];
    }
    if (funcs.isEmpty(findElement)) {
      const observer = new MutationObserver(() => {
        let elements;
        if(isByClassName === true){
          elements = document.getElementsByClassName(identifier);
        } else {
          elements = document.querySelectorAll(identifier);
        }

        let element;
        if(index == null){
          element = elements;
        } else {
          element = elements[index];
        }

        if (funcs.isEmpty(element)) {
          callback(null);
        }
        // Stop observing and resolve with the selected element
        if(inputData == null){
          callback(element);
        } else {
          callback(inputData, element);
        }
        observer.disconnect();
      });
      observer.observe(document, { subtree: true, childList: true });
    } else {
      if(inputData == null){
        callback(findElement);
      } else {
        callback(inputData, findElement);
      }
    }
  },

  trySelectElementByClassName: (document, identifier, index, callback) => {
    funcs.selectElement(document, identifier, index, callback, null, true);
  },

  trySelectElementByClassName: (document, identifier, index, callback, inputData) => {
    funcs.selectElement(document, identifier, index, callback, inputData, true);
  },
  
  trySelectElementBySelector: (document, identifier, index, callback) => {
    funcs.selectElement(document, identifier, index, callback, null, false);
  },

  trySelectElementBySelector: (document, identifier, index, callback, inputData) => {
    funcs.selectElement(document, identifier, index, callback, inputData, false);
  }
}


export default funcs;