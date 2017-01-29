let fs = require('fs');

let assert = require("assert");
let webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  until = webdriver.until;

let chrome = require("selenium-webdriver/chrome");
let options = new chrome.Options();
let TRACE_CATEGORIES = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];
let logging_prefs = new webdriver.logging.Preferences();
logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
options.setLoggingPrefs(logging_prefs);

options.setPerfLoggingPrefs({
  enableNetwork: true,
  enablePage: true,
  traceCategories: TRACE_CATEGORIES.join(',')
});

//Start browser in Maximized mode using below option
options.addArguments("start-maximized");

//Disable pop ups using below option
options.addArguments("disable-popup-blocking");

//disable developer extension using below option
options.addArguments("chrome.switches", "–disable-extensions");

//security warning is disabled using below option
options.addArguments("test-type");

let driver = new webdriver.Builder().withCapabilities(options.toCapabilities()).build();

//http://jsbin.com/qigolilutu/edit?output
// http://jsbin.com/qigolilutu/edit?output has an alert..... 
driver.get("http://google.com").then(s => {
  console.log('navigation');
  console.log(new Date().getTime());
});

driver.wait(until.alertIsPresent(),10000).then(() => {
  try {
    var alert = driver.switchTo().alert();
    alert.getText().then(function (text) {
      console.log('alert text: ' + text);
      alert.accept();
    });
  } catch (e) {
    console.log('no alert');
  }
}).catch(e => {
  console.log(new Date().getTime());
  console.log('no alert');
});

driver.wait(function () {
  return true;
}, 20000).then(e => {
  console.log(new Date().getTime());
  console.log('wait is done now');
}).catch(e => {
  console.log(e);
});

driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(function (logs) {
  console.log('write');
  fs.writeFileSync('logs.json', JSON.stringify(logs));
});

driver.close();
driver.quit();
