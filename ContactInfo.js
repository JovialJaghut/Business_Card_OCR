import {regexMap, findLines} from "./regexPatterns.js";

export default class ContactInfo {
  
  constructor(ocrText){
    this.ocrText = ocrText;
  }

  //this will work on phones and emails
  //for names, we use the getName method
  #getResult(type, pattern){
    
    //type will either be 'email' or 'phone'
    type = type.toLowerCase();

    //find all lines that match the pattern:
    let lines = findLines(this.ocrText, pattern);

    //in case nothing is found, we should reflect that in the output:
    let notFoundTypeMap = {
      "email": {
        "message": "no email address found"
      },
      "phone": {
        "message": "no phone number found"
      }
    };

    //IIFE to capitalize only the first letter of a string for consistency:
    let capitalizedType = ((str) => {
      if (str.length === 1) return str.toUpperCase();
      let first = str.charAt(0).toUpperCase();
      let rest = str.slice(1).toLowerCase();
      return `${first}${rest}`;
    })(type);

    //if no email or phone is found, reflect that in the output:
    if (!lines || lines.length < 1) return `${capitalizedType}: ${notFoundTypeMap[type].message}`;

    //only one email or phone was found... this is good:
    if (lines.length === 1) {

      //for phones:
      if (type==="phone"){

        //remove faxes that hit:
        lines = lines.filter(result => !result.toLowerCase().includes("fax"))

        //and remove all dashes, spaces, parens, and + signs:
        .map(result => result.replace(/[\-\(\)\+\s]/gmi, ""));

        //after removing those, we might be left with nothing:
        if (!lines[0]) return `${capitalizedType}: ${notFoundTypeMap[type].message}`; 
      }

      //if we've made it here, we're good... create the string:
      let result = `${capitalizedType}: ${lines[0].match(pattern)}`;

      //and return it:
      return result;
    }

    //we have multiple lines:
    else {
      let allResults = lines.filter(line => line.match(pattern));
     
      //a lot of this is duplicated... will consider a better implementation in the future:
      if (type === "phone") {
        allResults = allResults.flat()
                      .filter(result => !result.toLowerCase().includes("fax"))
                      .map(result => result.replace(/[\-\(\)\+\s]/gmi, ""))
                      .map(result => result.match(pattern));
        console.log(allResults);
      }

      //join the results together... basically, somebody can have two emails or phones.. that's okay!
      return `${capitalizedType}: ${allResults.join(" and ")}`;
    }

  }

  //returns the full name of the individual (example: John Smith, Susan Malik)
  getName(){

    //used below with nlp (the amazing compromise module):
    const getNamePart = (parts, type) => {
      let part = parts.find(name => name.tags.has("Person") && name.tags.has(type));
      return (part ? part.text : "");
    }

    //get a breakdown of the whole text:
    let doc = nlp(this.ocrText);

    //we want the first row that has a person:
    let nameRow = doc.document.find(arr => arr.some(o => o.tags && o.tags.has("Person")));

    //get the names and join them together with spaces... might use this later:
    let sentence = nameRow.reduce( (acc, cur) => [...acc, cur.text], []).join(" ");

    //get all name parts that are of type 'Person':
    let nameParts = nameRow.filter(o => o.tags && o.tags.has("Person"));

    //get the name parts and put them together in the right order:
    let salutation = getNamePart(nameParts, "Honorific");
    let firstName = getNamePart(nameParts, "FirstName");
    let lastName = getNamePart(nameParts, "LastName");

    //and return it:
    return `Name: ${salutation} ${firstName} ${lastName}`.trim();

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