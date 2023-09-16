const debug = true;
const funcLog = true;
const callbackLog = true;
const ioLog = true;
const domLog = true;

const Debuger = {
  log: (message, ...params) => {
    debug && console.log("log: ", message, ...params);
  },
  func: (message, ...params) => {
    debug && funcLog && console.log("func: ", message, ...params);
  },
  callback: (message, ...params) => {
    debug && callbackLog && console.log("callback: ", message, ...params);
  },
  io: (message, ...params) => {
    debug && ioLog && console.log("io: ", message, ...params);
  },
  dom: (message, ...params) => {
    debug && domLog && console.log("dom: ", message, ...params);
  }
}

export default Debuger;