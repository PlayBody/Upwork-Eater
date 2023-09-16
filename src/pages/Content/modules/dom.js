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
  selectElement: (identifier, callback, params, index, isClass) => {
    const document = Dom.document;
    const findElements = isClass ? document.getElementsByClassName(identifier) : document.querySelectorAll(identifier);
    const findElement = Funcs.isEmpty(index) ? findElements : (findElements.length > index ? findElements[index] : null);
    if (Funcs.isEmpty(findElement)) {
      const observer = new MutationObserver(() => {
        const elements = isClass ? document.getElementsByClassName(identifier) : document.querySelectorAll(identifier);
        const element = Funcs.isEmpty(index) ? elements : (elements.length > index ? elements[index] : null);
        // Debuger.func(document, "Observer", elements, elements.length, element, identifier, isClass);
        if (Funcs.isEmpty(element)) {
          callback(null);
        }
        if(Funcs.isEmpty(params)){
          callback(element);
        } else {
          callback(element, params);
        }
        observer.disconnect();
      });
      observer.observe(document, { subtree: true, childList: true });
    } else {
      if(Funcs.isEmpty(params)){
        callback(findElement);
      } else if(Array.isArray(params)){
        Debuger.dom(document, "Array", index, findElements.length, findElement, identifier, isClass);
        callback(findElement, ...params);
      } else {
        Debuger.dom(document, "String", index, findElement, findElement, identifier, isClass);
        callback(findElement, params);
      }
    }
  },

  selectElementByClass: (identifier, callback, params = null, index = 0) => {
    Dom.selectElement(identifier, callback, params, index, true);
  },
  
  selectElementByQuery: (identifier, callback, params = null, index = 0) => {
    Dom.selectElement(identifier, callback, params, index, false);
  },
}

export default Dom;