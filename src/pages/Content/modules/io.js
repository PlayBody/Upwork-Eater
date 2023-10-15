import Debuger from "./debuger";

const Io = {
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
        Debuger.io("loadFromLocal", items);
        callback(items[key]);
      });
    }
  },

  loadFromLocalObj: (keys, callback = null) => {
    if(!!callback && typeof callback === 'function'){
      chrome.storage.local.get(keys, function(items) {
        Debuger.io("loadFromLocalObj", items);
        callback(items);
      });
    }
  },

  loadFile: (url, name, callback = null) => {
    Debuger.io("load file prepare: ", name);
    fetch(url).then((response) => {
      Debuger.io("file response: ", response);
      response.blob().then((data) => {
        const metadata = {};
        if(name.endsWith(".pdf")) {
          metadata.type = "application/pdf";
        } else if(name.endsWith(".doc")) {
          metadata.type = "application/msword";
        } else if(name.endsWith(".txt")) {
          metadata.type = "text/plain";
        } else if(name.endsWith(".rtf")) {
          metadata.type = "application/rtf";
        } else if(name.endsWith(".docx")) {
          metadata.type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if(name.endsWith(".xlsx")) {
          metadata.type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        } else if(name.endsWith(".png")) {
          metadata.type = "image/png";  
        } else if(name.endsWith(".jpg")) {
          metadata.type = "image/jpeg";
        } else if(name.endsWith(".bmp")) { 
          metadata.type = "image/bmp";
        } else {
          metadata.type = "application/octet-stream";
        }

        Debuger.io("file name: ", name);
        
        if(metadata.type !== undefined && !!callback && typeof callback === 'function') {
          callback(new File([data], name, metadata));
        }
      }).catch((error) => {
        console.error(`${url} blob error: `, error);
      })
    }).catch((error) => {
      console.error(`${url} fetch error: `, error);
    })
  }
}

export default Io;