"use strict";
const co = require('co');
const By = require("selenium-webdriver").By;
const Browser = require('./browser.js')
const USER = require('./user.json')
const dateformat = require('dateformat');
const nextSat = () => {
  const day = (new Date()).getDay();
  const epochNextSat = Date.now()+((day>6 ? 13-day : 6-day) * 24*60*60*1000);
  return dateformat(new Date(epochNextSat), 'dddd dd mmmm yyyy');
};

const browser = Browser();
const longMoment = 500;

co(function*(){
  yield browser.visit("https://better.legendonlineservices.co.uk/enterprise/account/login");
  yield browser.type("#login_Email", USER.email);
  yield browser.type("#login_Password", USER.password);
  yield browser.click("#login")
  yield browser.click('#submenu > ul > li:nth-child(2) > a'); //make booking
  yield browser.sleep(longMoment);
  yield browser.click('input[value="279"]');//lambeth parks
  yield browser.sleep(longMoment);
  yield browser.click('#behaviours input[value="2365"]'); // court booking
  yield browser.sleep(longMoment);
  yield browser.click('#activities input[value="733"]'); // vauxhall park
  yield browser.sleep(longMoment);
  yield browser.click('#bottomsubmit'); // view timetable
  yield browser.switchFrame('#TB_iframeContent')
  const elements = yield browser.getElements('.sportsHallSlotWrapper > div');
  let day;
  const availableSlots = (yield Promise.all(elements.map(co.wrap(function*(e){
    if((yield e.getAttribute('class')) !== 'sporthallSlot' ){
      day = yield e.getText();
      return null;
    } else {
      return {day: day,
              hour: (yield e.getText()).match(/\n(.*)\n/)[1],
              link: yield e.findElement(By.css('.sporthallSlotAddLink')).then(ele=>ele, err=>null)}
    }
  })))).filter(e=> !!e && !!e.link).filter(e=>e.day===nextSat());
  // yield availableSlots[0].link.click();
  // yield browser.switchFrame('#TB_iframeContent')
  // yield browser.click('div.formSubmit > a:nth-child(2)');
  // yield browser.switchToLastWindow();
  // yield browser.click('a#btnPayNow');
  // yield browser.type('input#panInput', USER.cardNumber);
  // yield browser.type('select#ExpiryDateMonth', USER.cardExpiryMonth);
  // yield browser.type('select#ExpiryDateYear', USER.cardExpiryYear);
  // yield browser.type('input#csc', USER.cardSecurityCode);
  // yield browser.type('input#cardholdername', USER.cardHolderName);
  // yield browser.click('a#btnPayNow');
  // yield browser.click('#menu > ul > li > a');
  // yield browser.quit();
}).catch(co.wrap(function*(err){
  console.log(err);
  yield browser.click('#menu > ul > li > a');
  console.log("Logged Out");
  yield browser.quit();
}))
