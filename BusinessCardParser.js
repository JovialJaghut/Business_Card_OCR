import ContactInfo from "./ContactInfo.js";

class BusinessCardParser {
  
  constructor(ocrText){
    this.ocrText = ocrText;
  }

  getContactInfo(asHtml = false){
    let joiner = asHtml ? "<br>" : "\r\n";
    let contactInfo = new ContactInfo(this.ocrText);
    let name = contactInfo.getName();
    let email = contactInfo.getEmailAddress();
    let phone = contactInfo.getPhoneNumber();
    return `${[name, email, phone].filter(x => x).join(joiner)}`;
  }

}

export default BusinessCardParser;