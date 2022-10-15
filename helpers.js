async function wait(ms) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

function getRandomElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// slow but sure :P
function deepCopy(stuff) {
  return JSON.parse(JSON.stringify(stuff));
}

module.exports = {
  wait,
  getRandomElem,
  deepCopy,
};
