const downloader = require('node-image-downloader')
const puppeteer = require('puppeteer');
require('dotenv').config()


const username = process.env.LINKEDIN_USER;
const password = process.env.LINKEDIN_PASS;

var userImg = (async () => {
  let userUrl = process.env.LINKEDIN_USERLINK 
  let url = "https://www.linkedin.com";


  const browser = await puppeteer.launch();
  const loginPage = await browser.newPage();
  await loginPage.goto(url, {waitUntil: 'networkidle0'});

  await loginPage.type('#session_key', username);
  await loginPage.type('#session_password', password);
  await loginPage.click('.sign-in-form__submit-button');
  await loginPage.waitForNavigation();
  await loginPage.close()

  const userPage = await browser.newPage();
  await userPage.goto(userUrl, {waitUntil: 'load'});

  const userImg = await userPage.$eval(`img[alt="${process.env.NAME}"][class*="profile"]`, el => el.src);

  await browser.close();

  downloader({
    imgs: [
      {
        uri: userImg,
        filename: 'profile-picture'
      }
    ],
    dest: '.',
  }).then((info) => console.log(`all done: ${info}`))
  .catch((error) => console.log(`error!: ${error}`));

})();
