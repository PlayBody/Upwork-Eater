import Debuger from "./debuger";
import Funcs from "./func";

const Callbacks = {
  clickButton: (btn, ...params) => {
    Debuger.callback("btn", btn, params);
    if(Funcs.isButton(btn)) {
      const [callback] = params;
      btn.onclick = () => {
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(btn);
          } else {
            callback();
          }
        }
      }
      btn.click();
    }
  },

  clickCheckbox: (radio, ...params) => {
    Debuger.callback("radio", radio, params);
    if (Funcs.isButton(radio) && !radio.checked) {
      const [callback] = params;
      radio.onclick = () => {
        Debuger.callback("radio_callback", callback.length);
        if(typeof callback === 'function'){
          if(callback.length > 0){
            callback(radio);
          } else {
            callback();
          }
        }
      }
      radio.click();
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
      }
      input.oninput = () => {
        input.dispatchEvent(blurEvent);
      }
      input.onclick = () => {
        input.value = text;
        input.dispatchEvent(inputEvent);
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
      }
      input.onclick = () => {
        input.value = text;
        input.dispatchEvent(inputEvent);
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
};

export default Callbacks;
