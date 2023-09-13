console.log('PSG is the background page.');

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   console.log('Listener.', message);
//   // if(message === 'clipboard_read'){
//   //   clipboard.readText().then((text) => {
//   //     sendResponse(text);
//   //   });
//   // }
// });

// chrome.runtime.onConnect.addListener(port => {
//   console.log('connected ', port);

//   if (port.name === 'clipboard_read') {
//     port.onMessage.addListener(function(message, sender, sendResponse) {
//       console.log('Listener.', message);
//       clipboard.readText().then((text) => {
//         sendResponse(text);
//       });
//     });
//   }
// });

// chrome.runtime.on('clipboard_read', (event, data) => {  
//   clipboard.readText().then((text) => {
//     console.log(text);
//   });
// });


// setTimeout(() => {
//   console.log("background clipboard time");
//   clipboard.readText().then((text)=> {
//     console.log("clipboard text:", text);
//   });
// }, 1000);