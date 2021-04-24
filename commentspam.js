const { name } = require("random-name");
const { login } = require("./manualLogin");
const like_min = 50;
const like_max = 1000000; //1m
const follower_min = 40;
const follower_max = 5000;
const following_min = 200;
const folowing_max = 100000;

//login();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
fs = require("fs");

const cookieLogin = async () => {
  let browser = await puppeteer.launch({
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1",
    ],
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", //local chrome on macOS
    //defaultViewport: defaultViewport,
    headless: false, //set headless to false to view while running
    ignoreHTTPSErrors: false,
  });
  const page = await browser.newPage();
  const emailPage = await browser.newPage();
  page.setDefaultNavigationTimeout(30000); //30 seconds

  //get email
  try {
    context.overridePermissions("https://10minutemail.com", ["clipboard-read"]);
    context.overridePermissions("https://zoom.us", ["clipboard-read"]);
    await emailPage.goto("https://10minutemail.com");
    await page.click("#copy_address");
    mail_message;
    message_bottom;
  } catch (err) {}

  try {
    fs.readFile("./private/myCookies.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      // parse JSON object
      //console.log(data.cookies);
      const cookies = JSON.parse(data.toString());

      listOfCookies = cookies["cookies"];
      //console.log(listOfCookies);
      // print JSON object
      //console.log(cookies);
    });
    await page.waitFor(1000);
    await page.setViewport({ width: 350, height: 700, isMobile: true });

    //await page.goto("https://www.tiktok.com/inbox?lang=en", {waitUntil: "networkidle0"});

    await page.goto("https://www.tiktok.com/signup/phone-or-email", {
      waitUntil: "networkidle0",
    });
    await page.click(".container-1lSJp");
    await page.click(".list-item-MOAq4");
    await page.click(".select-container-2Ubyt");
    await page.click(".list-item-MOAq4");

    console.log("logged in");
  } catch (err) {
    console.log("failed with below error. Try again... \n", err.message);
  }

  //close popup
  page.waitFor(6000);
  //const closeBtn = await page.waitForSelector('.close');
  await page.click(".close");
  page.waitFor(1000);

  //navigate to followers
  try {
    const spanTags = await page.$$("span");
    for (const spanTag of spanTags) {
      const label = await page.evaluate((el) => el.innerText, spanTag);
      //await console.log(label.toString());
      if (label.toString().toLowerCase() === "followers") {
        console.log(label.toString());
        await spanTag.click();
        //don't break because there are multiple things that say "launch meeting"
      }
    }
  } catch (err) {
    console.log("error looking for followers button here");
    console.log(err);
  }

  while (true) {
    //dropdown menu
    await page.click(".follow-show-more");
    //wait 10s
    page.waitFor(10000);
    //find follow buttons
    const btnTags = await page.$$("button");
    for (const btnTag of btnTags) {
      const label = await page.evaluate((el) => el.innerText, btnTag);
      var counter = 1;
      //await console.log(label.toString());
      if (label.toString() == "Follow" && counter < 5) {
        console.log(label.toString());
        await btnTag.click();
        counter++;
        //don't break because there are multiple things that say "launch meeting"
        await page.waitFor(1000);
      }
      break;
    }
    //next
    await page.click(".recommend-item");
    await page.waitFor(6000);
    await page.click(".comp-card-cover");
    await page.waitFor(6000);
    await page.click(".heart-twink");
    await page.waitFor(6000);
    await page.goBack();
    //await page.click('.follow-show-more');

    await page.waitFor(100000);
  }
};

cookieLogin();
