import Debuger from "./debuger";
import Funcs from "./func";

const Callbacks = {
  clickButton: (btn, ...params) => {
    Debuger.callback("btn", btn, params);
    if(Funcs.isButton(btn)) {
      const [callback] = params;
      btn.onclick = () => {
        if(typeof callback === 'function'){
          callback(btn);
        }
      }
      btn.click();
    }
  },

  clickCheckbox: (radio, ...params) => {
    Debuger.callback("btn", radio, params);
    if (Funcs.isButton(radio) && !radio.checked) {
      const [callback] = params;
      radio.onclick = () => {
        if(typeof callback === 'function'){
          callback(radio);
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
          callback(input);
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
          callback(input);
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
