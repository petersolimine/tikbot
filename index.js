const {login} = require('./manualLogin');

//login();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
fs = require('fs');

const cookieLogin = async () => {
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
        

        if(cookieList){
            await fs.readFile('private/myCookies.json', function (err) {
                if (err) return console.log(err);
                console.log('cookieLogin worked');
              });
        }



        await page.setCookie(...cookies);
        await page.waitFor(5000);

        await page.goto("https://www.tiktok.com/login/");
        console.og('done');
    }catch(err){
        console.log("failed with below error. Try again... \n",err.message);
    }
}