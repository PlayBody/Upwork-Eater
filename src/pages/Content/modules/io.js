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
}

export default Io;