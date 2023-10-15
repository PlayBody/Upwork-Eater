import Debuger from "./debuger";
import Funcs from "./func";

const DELAY = 800;

const Callbacks = {
  clickButton: (btn, ...params) => {
    Debuger.callback("btn", btn, params);
    if(Funcs.isButton(btn)) {
      const [callback] = params;
      btn.onclick = () => {
        Debuger.callback("btn_callback", btn);
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(btn);
          } else {
            callback();
          }
        }
        btn.onclick = null;
      }
      if(btn.disabled){
        setTimeout(()=>{
          if(!btn.disabled){
            btn.click();
          }
        }, DELAY);
      } else {
        btn.click();
      }
    }
  },

  clickCheckbox: (btn, ...params) => {
    Debuger.callback("radio", btn, params);
    if (Funcs.isButton(btn) && !btn.checked) {
      const [callback] = params;
      btn.onclick = () => {
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(btn);
          } else {
            callback();
          }
        }
        btn.onclick = null;
      }
      if(btn.disabled){
        setTimeout(()=>{
          if(!btn.disabled){
            btn.click();
          }
        }, DELAY);
      } else {
        btn.click();
      }
    }
  },

  inputText: (input, ...params) => {
    Debuger.callback("inputText", input, params);
    if (Funcs.isInput(input)) {
      const [text, callback] = params;
      const inputEvent = new Event('input', { bubbles: true });
      const blurEvent = new Event('blur', { bubbles: true });
      input.onblur = () => {
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(input);
          } else {
            callback();
          }
        }
        input.onblur = null;
      }
      input.oninput = () => {
        input.dispatchEvent(blurEvent);
        input.oninput = null;
      }
      input.onclick = () => {
        input.value = text;
        input.dispatchEvent(inputEvent);
        input.onclick = null;
      }
      input.click();
    }
  },

  inputTextNotBlur: (input, ...params) => {
    Debuger.callback("inputTextNotBlur", input, params);
    if (Funcs.isInput(input)) {
      const [text, callback] = params;
      const inputEvent = new Event('input', { bubbles: true });
      input.oninput = () => {
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(input);
          } else {
            callback();
          }
        }
        input.oninput = null;
      }
      input.onclick = () => {
        input.value = text;
        input.dispatchEvent(inputEvent);
        input.onclick = null;
      }
      input.click();
    }
  },

  inputTextIfEmpty: (input, ...params) => {
    Debuger.callback("inputTextIfEmpty", input, params);
    if (input && typeof input.value === 'string' && input.value.length === 0) {
      const [text, callback] = params;
      Callbacks.inputText(input, text, callback);
    }
  },

  inputFile: (input, ...params) => {
    Debuger.callback("inputFile", input, params);
    if (input && typeof input.accept === 'string') {
      const [file, callback] = params;
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      const event = new Event("change", {
        bubbles: !0,
      });
      input.onchange = () => {
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(input);
          } else {
            callback();
          }
        }
        input.onchange = null;
      }
      input.dispatchEvent(event);
    }
  }
};

export default Callbacks;
