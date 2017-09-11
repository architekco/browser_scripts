const co = require('co');
const webdriver = require("selenium-webdriver"),
  ChromeOptions = require("selenium-webdriver/chrome").Options,
  By = webdriver.By,
  until = webdriver.until;

const drivers = {
  firefox: function(){
    return new webdriver.Builder().forBrowser('firefox').build();
  },
  chrome: function(){
    return new webdriver.Builder().forBrowser('chrome').build();
  }
}

module.exports = function(){

  const driver = drivers.chrome();

  const browser = {

    getDriver: co.wrap(function(){
      return driver;
    }),

    visit: co.wrap(function*(url){
      return driver.get(url);
    }),

    click: co.wrap(function*(css){
      return (yield browser.waitFor(css)).click();
    }),

    type: co.wrap(function*(css, str){
      return (yield browser.waitFor(css)).sendKeys(str);
    }),

    waitFor: co.wrap(function*(css){
      return driver.wait(until.elementLocated(By.css(css)), 2000);
    }),

    switchFrame: co.wrap(function*(css){
      return driver.switchTo().frame(yield browser.waitFor(css))
    }),

    switchToLastWindow: co.wrap(function*(){
      const handles = yield driver.getAllWindowHandles();
      return driver.switchTo().window(handles[handles.length - 1]);
    }),

    exists: co.wrap(function*(css){
      return driver.findElement(By.css(css)).then(ele=>true,err=>false);
    }),

    getElements: co.wrap(function*(css){
      return driver.findElements(By.css(css))
    }),

    quit: co.wrap(function*(){
      return driver.quit();
    }),

    sleep: co.wrap(function*(time_ms){
      return driver.sleep(time_ms);
    })

  }

  return browser;
}
