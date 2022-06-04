import {regexMap, findLines} from "./regexPatterns.js";

export default class ContactInfo {
  
  constructor(ocrText){
    this.ocrText = ocrText;
  }

  #getResult(type, pattern){
    
    var type = type.toLowerCase();

    let lines = findLines(this.ocrText, pattern);

    let notFoundTypeMap = {
      "email": {
        "message": "no email address found"
      },
      "phone": {
        "message": "no phone number found"
      }
    };

    let capitalizedType = ((str) => {
      if (str.length === 1) return str.toUpperCase();
      let first = str.charAt(0).toUpperCase();
      let rest = str.slice(1).toLowerCase();
      return `${first}${rest}`;
    })(type);

    if (!lines || lines.length < 1) return `${capitalizedType}: ${notFoundTypeMap[type].message}`;

    if (lines.length === 1) {
      var result = `${capitalizedType}: ${lines[0].match(pattern)}`;
      return result;
    }
    else {
      var allResults = lines.filter(line => line.match(pattern));
      if (type === "phone") {
        console.log(allResults);
        allResults = allResults.flat()
                      .filter(result => !result.toLowerCase().includes("fax"))
                      .map((result => result.match(pattern)));
      }
      return `${capitalizedType}: ${allResults.join(" and ")}`;
    }

  }

  //returns the full name of the individual (example: John Smith, Susan Malik)
  getName(){
    const getNamePart = (parts, type) => {
      var part = parts.find(name => name.tags.has("Person") && name.tags.has(type));
      return (part ? part.text : "");
    }
    var doc = nlp(this.ocrText);
    var nameRow = doc.document.find(arr => arr.some(o => o.tags && o.tags.has("Person")));
    var sentence = nameRow.reduce( (acc, cur) => [...acc, cur.text], []).join(" ");
    console.log(sentence);
    var nameParts = nameRow.filter(o => o.tags && o.tags.has("Person"));
    console.log(nameParts);
    var salutation = getNamePart(nameParts, "Honorific");
    var firstName = getNamePart(nameParts, "FirstName");
    var lastName = getNamePart(nameParts, "LastName");
    return `Name: ${salutation} ${firstName} ${lastName}`.trim();

    /* let apiKey = "7b87bdd601789ad64ab32733aa85c5a5";
    let uri = `https://api.parser.name/?api_key=${apiKey}&endpoint=extract&text=${this.ocrText}`;
    let result = await fetch(uri);
    console.log(result);
    return result; */


    /* var lines = this.ocrText.split(/\r?\n/gmi).filter(line => {
      return !line.match(regexMap.email) && !line.match(regexMap.phone);
    }).filter(line => {
      var parts = line.split(/[\s\,]+/gi).map(part => part.replace(/\./g, ""));
      return parts.every(part => part.match(/[\w\d]+/));
    }).filter(line => {
      var parts = line.split(/[\s\,]+/gi).map(part => part.trim());
      var fullNumberParts = parts.some(part => part.trim().match(/^\d+$/));
      return fullNumberParts ? false : true;
    });
    console.log(lines);
    return lines.join( " and this "); */
  }

  //returns the phone number formatted as a sequence of digits
  getPhoneNumber(){
    return this.#getResult("phone", regexMap.phone);
  }

  //returns the email address
  getEmailAddress(){
    return this.#getResult("email", regexMap.email);
  }

}