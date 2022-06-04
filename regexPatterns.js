let regexMap = {
  email: /\b(?:[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5})$/,
  phone: /\b(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/g
};

const findLines = (text, pattern, splitter=/\r?\n/gmi) => {
  let lines = text.split(splitter);
  let goodLines = lines.filter(line => line.match(pattern));
  return goodLines && goodLines.length > 0 ? goodLines : null;
}

export {regexMap, findLines};