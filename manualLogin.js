import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { ANTI_CAPTCHA_KEY } from './consts.js'
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const login_time = 30000; //30 seconds
fs = require('fs');

export default login = async () => {
    try{
        let browser = await puppeteer.launch({
            args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', //local chrome on macOS
            //defaultViewport: defaultViewport,
            headless: false, //set headless to false to view while running
            ignoreHTTPSErrors: false,
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(30000); //30 seconds
        
        await page.goto("https://www.tiktok.com/login/");
        await page.waitFor(login_time);

        var cookieList = await page._client.send('Network.getAllCookies');
        console.log(cookieList);
        if(cookieList){
            fs.writeFile('private/myCookies.txt', cookieList, function (err) {
                if (err) return console.log(err);
                console.log('Hello World > helloworld.txt');
              });
        }
    }catch(err){
        console.log("failed with below error. Try again... \n",err.message);
    }
}
