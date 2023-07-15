import Constants from "./const";

const funcs = {
  isEmpty: (e) => {
    if (e === undefined || e === null) {
      return true;
    }
    return false;
  },

  isUpworkPage: (document) => {
    const currentUrl = document.location.href;
    return currentUrl.indexOf('upwork.com') === -1 ? false : true;
  },

  whichUpworkPage: (document) => {
    const currentUrl = document.location.href;
    var whichPage = '';
    Object.keys(Constants.UpworkPages).map((e) => {
      const page = Constants.UpworkPages[e];
      if (currentUrl.indexOf(page) !== -1) {
        whichPage = page;
      }
    });
    return whichPage;
  },

  clickButton: (btn) => {
    btn.then(e => {
      console.log("btn", e);
    })
  },

  isBtn: (e) => {
    if (!funcs.isEmpty(e) && typeof e.click === 'function') {
      console.log('enable to click!')
      return true;
    } else {
      return false;
    }
  },

  isInput: (e) => {
    if (!funcs.isEmpty(e) && typeof e.value === 'string') {
      return true;
    } else {
      return false;
    }
  },

  selectElement: (document, identifier, index, callback, inputData) => {
    let eles = document.getElementsByClassName(identifier);
    console.log('2 enter try select', eles[index], document);
    let ee = eles[index];
    if (funcs.isEmpty(ee)) {
      const observer = new MutationObserver(() => {
        let elements = document.getElementsByClassName(identifier);
        let e = elements[index];

        if (funcs.isEmpty(e)) {
          console.log('empty element', e);
          return;
        }
        // Stop observing and resolve with the selected element
        console.log('which element', e);
        if(inputData == null){
          callback(e);
        } else {
          callback(inputData, e);
        }
        observer.disconnect();
      });
      observer.observe(document, { subtree: true, childList: true });
    } else {
      console.log('which else element', e);
      if(inputData == null){
        callback(ee);
      } else {
        callback(inputData, ee);
      }
    }
  },

  trySelectElementAndCallback: (document, identifier, index, callback) => {
    console.log('1 enter try select');
    funcs.selectElement(document, identifier, index, callback, null);
  },

  trySelectElementAndCallbackInput: (document, identifier, index, callback, inputData) => {
    funcs.selectElement(document, identifier, index, callback, inputData);
  }
}


export default funcs;