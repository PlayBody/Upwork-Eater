const Funcs = {
  getRandomPhoneNumbers: () => {
    let randomNumber = Math.floor(Math.random() * 100000000);
    let numberString = randomNumber.toString().padStart(8, '0');
    return numberString;
  },
  getRandomZipCode: () => {
    let randomNumber = Math.floor(Math.random() * 100000);
    let numberString = randomNumber.toString().padStart(5, '0');
    return numberString;
  },

  isEmpty: (e) => {
    if (e === undefined || e === null) {
      return true;
    }
    return false;
  },

  isButton: (e) => {
    if (!Funcs.isEmpty(e) && typeof e.click === 'function') {
      return true;
    } else {
      return false;
    }
  },

  isInput: (e) => {
    if (!Funcs.isEmpty(e) && (typeof e.value === 'string' || typeof e.innerHTML === 'string')) {
      return true;
    } else {
      return false;
    }
  },
}

export default Funcs;