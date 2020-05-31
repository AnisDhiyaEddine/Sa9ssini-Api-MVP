const puppeteer = require("puppeteer");
const { githubUserID, githubUser } = require("../factories/userFactory");
const sessionFactory = require("../factories/sessionFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandox"],
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const { session, sig } = await sessionFactory(githubUserID);
    await this.page.setCookie({
      name: "session",
      value: session,
      domain: "http://localhost:3000",
    });
    await this.page.setCookie({
      name: "session.sig",
      value: sig,
      domain: "http://localhost:3000",
    });
    await this.page.goto("http://localhost:3000");
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
