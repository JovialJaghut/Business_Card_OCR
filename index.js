import BusinessCardParser from "./BusinessCardParser.js";

var tests = [

 `name: william zona
phone number: 410 349 7787
email: william.zona@gmail.com`,

`ASYMMETRIK LTD
Mike Smith
Senior Software Engineer
(410)555-1234
email address msmith@asymmetrik.com`,

`Foobar Technologies
Analytic Developer
Lisa Haung
1234 Sentry Road
Columbia, MD 12345
Phone: 410-555-1234
Fax: 410-555-4321
lisa.haung@foobartech.com`,

`Arthur Wilson
Software Engineer
Decision & Security Technologies
ABC Technologies
123 North 11th Street
Suite 229
Arlington, VA 22209
Tel: +1 (703) 555-1259
Fax: +1 (703) 555-1200
awilson@abctech.com`, 

`Arthur Wilson
Software Engineer
Decision & Security Technologies
ABC Technologies
123 North 11th Street
Suite 229
Arlington, VA 22209
Fax: +1 (703) 555-1200
Tel: +1 (703) 555-1259
email: awilson@abctech.com`,

`Mr. Billy Zona
Software Engineer
william.zona@gmail.com
443-292-9022`

];

(async () => {
  var getResult = (test) => {
    var bcParser = new BusinessCardParser(test);
    console.log(bcParser);
    var result = bcParser.getContactInfo({asHtml: true});
    return {"result": result, "test": test};
  };
  let promises = tests.map(getResult);
  let results = await Promise.all(promises);
  console.log(results);
})();


