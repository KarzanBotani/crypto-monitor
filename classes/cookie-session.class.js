module.exports = class Cookiesession {

  constructor(cookieName = 'crypto-monitor-cookie') {
    this.sessionMem = {};
    this.cookieName = cookieName;
  }

  /* middleware */
  middleware() {
    return (req,res,next) => {
      let cookieVal = this.getCookie(req) || this.setCookie(res);
      req.session = this.getSession(cookieVal);
      req.session.lastActivity = new Date();
      next();
    }
  }

  getCookie(req) {
    return req.cookies[this.cookieName];
  }

  setCookie(res) {
    let value = this.generateCookieValue();

    res.cookie(this.cookieName, value, {
      maxAge: 30*24*60*60*1000,
      httpOnly: true,
      path: '/',
      secure: false
    });

    return value;
  }

  generateCookieValue() {
    let newCookieValue;

    while (!newCookieValue || this.sessionMem[newCookieValue]) {
      newCookieValue = (Math.random() + '').split('.')[1];
    }

    return newCookieValue;
  }

  getSession(cookieVal) {
    if (!this.sessionMem[cookieVal]) {
      let session = {
        cookieVal: cookieVal,
        user: false
      };

      this.sessionMem[cookieVal] = session;
    }

    return this.sessionMem[cookieVal];
  }

}