const pm = require('promisemaker'),
      mysql = require('mysql'),
      bcrypt = require('bcrypt');

module.exports = class Rest {

  /* INITIALIZE MIDDLEWARE */
  static start(settings) {
    Rest.settings = settings;
    Rest.connectToSql();
    return (...args) => new Rest(...args);
  }

  /* MySQL CONNECTION METHOD */
  static connectToSql() {
    Rest.db = pm(
      mysql.createConnection(Rest.settings.dbCredentials),
      {
        rejectOnErrors: Rest.settings.runtimeErrors,
        mapArgsToProps: {
          query: ['rows', 'fields']
        }
      }
    );

    Rest.checkDbCredentials();
    Rest.db.query(`SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`);
    Rest.db.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`);
  }

  /* CHECK DATABASE CREDENTIALS */
  static async checkDbCredentials() {
    let r = await Rest.db.query('show tables');
    if (r.constructor == Error) {
      console.log('WRONG PASSWORD: ', Rest.settings.dbCredentials.password, '------', r.sqlMessage);
    }
  }

  constructor(req,res,next) {
    // SAVE RES, RES, NEXT AS PROPERTIES
    this.req = req;
    this.res = res;
    this.next = next;

    this.settings = Rest.settings;

    // MAKE SURE THE BASEURL ENDS WITH '/'
    if (this.settings.baseUrl.substr(-1) != '/') {
      this.settings.baseUrl += '/';
    }

    this.analyzeUrl();

    // CALL THE CORRECT METHOD
    if (['get', 'post', 'put', 'delete'].includes(this.method)) {
      this[this.method]();
    }
  }

  analyzeUrl() {
    let url = this.req.url;
    let method = this.req.method.toLowerCase();
    let baseUrl = this.settings.baseUrl;

    if (url.indexOf(baseUrl) != 0) {
      this.next();
      return;
    }

    // REMOVE BASEURL.
    // SPLIT THE REST OF THE URL ON '/'
    let urlParts = url.split(baseUrl,2)[1].split('/');

    // SET PROPERTIES AFTER ANALYSIS
    this.table = urlParts[0].split(';').join('').split('?')[0];
    this.id = urlParts[1];
    this.method = method;
    this.idColName = this.settings.idMap[this.table] || 'id';
  }

  async get() {
    let result = await this.query(
      'SELECT * FROM `' + this.table + '`' +
      (this.id ? ' WHERE ' + this.idColName + ' = ?' : ''),
      [this.id]
    );

    if (result.constructor == Error) {
      this.res.status(500);
    }

    else if (this.id && result.length === 0) {
      this.res.status(500);
      this.res.json({ Error: 'Cannot be found!' });
      return;
    }

    else if (this.id) {
      result = result[0];
    }

    this.res.json(result);
  }

  async delete() {
    let result = await this.query(
      'DELETE FROM `' + this.table + '`' +
      (this.id ? ' WHERE ' + this.idColName + ' = ?' : ''),
      [this.id]
    );

    if (result.constructor == Error) {
      this.res.status(500);
    }

    this.res.json(result);
  }

  async post() {

    // console.log('POST!', this.req.body, this.table);

    // IF THE TABLE IS 'users'
    // HASH 'req.body.password'
    if (this.table == 'users' && this.req.body.password) {
      let hash = await bcrypt.hash(this.req.body.password, 12);
      this.req.body.password = hash;
    }

    let result = await this.query(
      'INSERT INTO `' + this.table + '` SET ?',
      [this.req.body]
    );

    if (result.constructor == Error) {
      this.res.status(500);
    }

    if (this.table == 'users' && this.id && this.id == this.req.session.user.id) {
      let userFromDb = await this.query('SELECT * FROM users WHERE id = ?',
        [this.id]
      );

      // console.log(userFromDb, this.id);
      // console.log(await this.query('SELECT * FROM users'));

      userFromDb = userFromDb[0];
      delete userFromDb.password;

      this.req.session.user = userFromDb;
      result = {
        user: userFromDb,
        result: result
      };
    }

    this.res.json(result);
  }

  async put() {

    // IF THE TABLE IS 'users'
    // HASH 'req.body.password'
    if (this.table == 'users' && this.req.body.password) {
      let hash = await bcrypt.hash(this.req.body.password, 12);
      this.req.body.password = hash;
    }

    let result = await this.query(
      'UPDATE `' + this.table + '` SET ? WHERE `' + this.idColName + '` = ?',
      [this.req.body, this.id]
    );

    if (result.constructor == Error) {
      this.res.status(500);
    }

    if (this.table == 'users' && this.id && this.id == this.req.session.user.id) {
      let userFromDb = await this.query('SELECT * FROM users WHERE id = ?',
        [this.id]
      );

      userFromDb = userFromDb[0];
      delete userFromDb.password;

      this.req.session.user = userFromDb;
      result = {
        user: userFromDb,
        result: result
      };
    }

    this.res.json(result);
  }

  /* QUERY HELPER1 */
  async query(query, params) {
    let result = await Rest.db.query(query, params);
    return result.rows;
  }

  /* QUERY HELPER2 */
  static async query(query, params) {
    let result = await Rest.db.query(query, params);
    return result.rows;
  }

}