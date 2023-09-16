const Callbacks = {
  clickButton: (btn) => {
    funcs.isBtn(btn) && btn.click();
  },

  clickCheckbox: (radio) => {
    if (funcs.isBtn(radio) && !radio.checked) {
      radio.click();
    }
  },

  inputText: (data, input) => {
    if (funcs.isInput(input)) {
      input.click();
      input.value = data;
      const inputEvent = new Event('input', { bubbles: true });
      const blurEvent = new Event('blur', { bubbles: true });
      input.dispatchEvent(inputEvent);
      input.dispatchEvent(blurEvent);
    }
  },

  inputTextNotBlur: (data, input) => {
    if (funcs.isInput(input)) {
      input.click();
      input.value = data;
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  },

  inputTextIfEmpty: (data, input) => {
    if (input && typeof input.value === 'string' && input.value.length === 0) {
      Callbacks.inputText(data, input);
    }
  },
};

export default Callbacks;
