import Constants from "./const";
import Debuger from "./debuger";
import Funcs from "./func";

const Dom = {
  document: null,
  setDocument: (document) => {
    Dom.document = document;
  },
  isUpworkPage: () => {
    return Dom.document && Dom.document.location.href.includes('upwork.com');
  },

  whichUpworkPage: () => {
    const currentUrl = Dom.document.location.href;
    var whichPage = '';
    Object.keys(Constants.PageUrlPatterns).map((e) => {
      const page = Constants.PageUrlPatterns[e];
      if (currentUrl.endsWith(page)) {
        whichPage = page;
      }
    });
    return whichPage;
  },
  selectElement: (identifier, callback, param, index, isClass) => {
    const document = Dom.document;
    const findElements = isClass ? document.getElementsByClassName(identifier) : document.querySelectorAll(identifier);
    const findElement = Funcs.isEmpty(index) ? findElements : (findElements.length > index ? findElements[index] : null);
    // Debuger.func(document, "ABC", findElements, findElements.length, findElement, identifier, isClass);
    if (Funcs.isEmpty(findElement)) {
      const observer = new MutationObserver(() => {
        const elements = isClass ? document.getElementsByClassName(identifier) : document.querySelectorAll(identifier);
        const element = Funcs.isEmpty(index) ? elements : (elements.length > index ? elements[index] : null);
        // Debuger.func(document, "Observer", elements, elements.length, element, identifier, isClass);
        if (Funcs.isEmpty(element)) {
          callback(null);
        }
        if(Funcs.isEmpty(param)){
          callback(element);
        } else {
          callback(element, param);
        }
        observer.disconnect();
      });
      observer.observe(document, { subtree: true, childList: true });
    } else {
      if(Funcs.isEmpty(param)){
        callback(findElement);
      } else if(Array.isArray()){
        Debuger.dom("dom_param_arr", param);
        callback(findElement, ...param);
      } else {
        Debuger.dom("dom_param_obj", param);
        callback(findElement, param);
      }
    }
  },

  selectElementByClass: (identifier, callback, param = null, index = 0) => {
    Dom.selectElement(identifier, callback, param, index, true);
  },
  
  selectElementByQuery: (identifier, callback, param = null, index = 0) => {
    Dom.selectElement(identifier, callback, param, index, false);
  },
}

export default Dom;