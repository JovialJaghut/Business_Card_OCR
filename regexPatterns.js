//some very simple regex patterns:
let regexMap = {
  email: /\b(?:[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5})$/,
  phone: /\(?[0-9]{3}\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/
};

//find lines in text that match a pattern:
const findLines = (text, pattern, splitter=/\r?\n/gmi) => {
  let lines = text.split(splitter);
  let goodLines = lines.filter(line => line.match(pattern));
  return goodLines && goodLines.length > 0 ? goodLines : null;
}

export {regexMap, findLines};