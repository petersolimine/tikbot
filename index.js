const {login} = require('./manualLogin');

//login();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
fs = require('fs');

const cookieLogin = async () => {
    let browser = await puppeteer.launch({
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1'],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', //local chrome on macOS
        //defaultViewport: defaultViewport,
        headless: false, //set headless to false to view while running
        ignoreHTTPSErrors: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000); //30 seconds

    try{        
        fs.readFile('./private/myCookies.json', 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
            // parse JSON object
            //console.log(data.cookies);
            const cookies = JSON.parse(data.toString());
        
            listOfCookies = cookies['cookies'];
            //console.log(listOfCookies);
            // print JSON object
            //console.log(cookies);
        });
        await page.waitFor(1000);
        await page.setViewport({ width: 350, height: 700, isMobile: true});



        try{
            await page.setCookie(...listOfCookies);
            await page.waitFor(5000);
        }catch(err){
            console.log(err);
        }
        console.log('done');

        //await page.goto("https://www.tiktok.com/inbox?lang=en", {waitUntil: "networkidle0"});
        
        await page.goto("https://www.tiktok.com/@nessa.batchelor68?lang=en", {waitUntil: "networkidle0"});
        console.log('logged in');
        
    }catch(err){
        console.log("failed with below error. Try again... \n",err.message);
    }


    //close popup
    page.waitFor(6000);
    //const closeBtn = await page.waitForSelector('.close');
    await page.click('.close');
    page.waitFor(1000);

    //navigate to followers
    try{
        const spanTags = await page.$$('span');
        for (const spanTag of spanTags) {
        const label = await page.evaluate(el => el.innerText, spanTag);
        //await console.log(label.toString());
            if(label.toString().toLowerCase() === 'followers'){
                console.log(label.toString());
                await spanTag.click();
                //don't break because there are multiple things that say "launch meeting"
            }
        }    
    }catch(err){
        console.log('error looking for followers button here');
        console.log(err);
    }

    while (true){
        //dropdown menu
        await page.click('.follow-show-more');
        //wait 10s
        page.waitFor(10000);
        //find follow buttons
        const divTags = await page.$$('div');
        for (const divTag of divTags) {
        const label = await page.evaluate(el => el.innerText, divTag);
        //await console.log(label.toString());
            if(label.toString() == 'Follow'){
                console.log(label.toString());
                await divTag.click();
                //don't break because there are multiple things that say "launch meeting"
                await page.waitFor(10000);
            }
            
        }  
        
        await page.waitFor(100000);
    }


}

cookieLogin();