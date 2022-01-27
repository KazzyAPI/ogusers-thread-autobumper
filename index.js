/** @format */

const puppeteer = require("puppeteer-extra");
const colors = require("colors");
const config = require("./config.json");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());


async function scrape() {
  try {
    console.log(colors.green("[+] Starting Automation"));
    puppeteer.launch({ headless: false }).then(async (browser) => {

      const page = await browser.newPage();
      await page.goto("https://ogusers.com/login");

      let username = `#fullcontainment > div > form:nth-child(2) > div > div.container.mt-4 > div > div.col-md-6.bg-container.py-4.px-5.rounded-right.rounded-xs > div > span > div:nth-child(1) > span > label > input`;
      let password = `#fullcontainment > div > form:nth-child(2) > div > div.container.mt-4 > div > div.col-md-6.bg-container.py-4.px-5.rounded-right.rounded-xs > div > span > div:nth-child(3) > label > input`;
      let submitButton = `#fullcontainment > div > form:nth-child(2) > div > div.container.mt-4 > div > div.col-md-6.bg-container.py-4.px-5.rounded-right.rounded-xs > div > span > button > span`;
      let newPosts = `body > div.headertop > div > div.headerright > a.conversationnotification.newposts > div`;
      let textArea = `#fullcontainment > div.wraps > form > table > tbody > tr:nth-child(4) > td > div > iframe`;
      let newReply = `#fullcontainment > div.wraps > form > div.responsivehide > input:nth-child(1)`;

      await page.waitForSelector(username);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.click(username);
      await page.type(username, config.username, { delay: 50 });
      console.log(
        colors.green("[+] Username: ") + colors.yellow(config.username)
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));


      await page.click(password);
      console.log(
        colors.green("[+] Password: ") + colors.yellow(`${config.password}`)
      );
      await page.type(password, config.password, { delay: 50 });
      await new Promise((resolve) => setTimeout(resolve, 1000));


      await page.click(submitButton);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.waitForSelector(newPosts);
      console.log(
        colors.green(`[+] Logged in as:  ${colors.yellow(config.username)}`)
      );


      console.log(colors.green("[+] Bypassed Cloudflare bot protection"));
      console.log(colors.green("[+] Starting to post"));


      let newPage = await page.goto(config.thread, {
        waitUntil: "load",
        timeout: 0,
      });
      console.log(colors.green("[+] New reply page loaded"));
      const handleElement = await page.waitForXPath(
        '//*[@id="fullcontainment"]/div[1]/form/table/tbody/tr[4]/td/div/iframe'
      );
      let frame = await handleElement.contentFrame();
      await frame.type("body", config.message, { delay: 100 });
      console.log(colors.green("[+] Textbox loaded"));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.click(newReply);
      await new Promise((resolve) => setTimeout(resolve, 3000));


      console.log(colors.green("[+] Bumping the thread"));
      console.log(colors.green(`[+] Bumped the thread`));
      console.log(colors.green("[+] Closing Browser"));


      await browser.close();
    }).catch((err) => {
      console.log(colors.red(`[-] Error: ${err.message}`));

    });
  } catch (error) {
    console.log(colors.red(`[-] Error: ${error.message}`));
    await browser.close();
  }
}

setInterval(() => {
  scrape();
}, 3600000);
scrape();

