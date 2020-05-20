const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("localhost:1234");
});

afterEach(async () => {
  await browser.close();
});

test("signed in", async () => {
  const Buffer = require("safe-buffer").Buffer;
  const id = "5ec2eee9ac823d25a642863a";
  const sessionObj = {
    passport: {
      user: id,
    },
  };
  const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
  const Keygrip = require("keygrip");
  const keys = [process.env.cookieSessionKey];
  const keygrip = new Keygrip(keys);
  const sig = keygrip.sign("session=" + sessionStr);
  await page.setCookie({ name: "session", value: sessionStr });
  await page.setCookie({ name: "session.sig", value: sig });
});
