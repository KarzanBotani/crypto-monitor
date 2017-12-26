const bcrypt = require('bcrypt');

module.exports = class Login {

  constructor(expressApp) {
    this.app = expressApp;
    this.get();
    this.post();
    this.delete();
  }

  /* LOGIN CHECK */
  get() {
    this.app.get('/rest/login', (req, res) => {

      /* NO EXISTING SESSION. USER IS NOT LOGGED IN */
      if (!req.session.user) {
        res.json({
          user: false,
          status: 'Not logged in!'
        });

        return;
      }

      /* EXISTING SESSION. USER IS LOGGED IN */
      res.json({
        user: req.session.user,
        status: 'Already logged in!'
      });

    });
  }

  /* LOG OUT */
  delete() {
    this.app.delete('/rest/login', (req, res) => {

      /* LOG OUT IF A SESSION EXISTS */
      if (req.session.user) {
        res.json({
          user: false,
          status: 'Logging out!'
        });

        delete req.session.user;
      }

      /* CAN'T LOG OUT IF SESSION DOES NOT EXIST */
      else if (!req.session.user) {
        res.json({
          user: false,
          status: 'Ýou can\'t log out if you\'re not logged in!'
        });
      }

    });
  }

  /* LOG IN */
  post() {
    this.app.post('/rest/login', async (req, res) => {

      /* EXISTING SESSION. USER IS LOGGED IN */
      if (req.session.user) {
        res.json({
          user: req.session.user,
          status: 'Already logged in!'
        });

        return;
      }

      /* ATTEMPT AT LOGGING IN */
      let email = req.body.email;
      let password = req.body.password;

      /* MAP EXISTING EMAILS SO THEY CAN'T BE DUPLICATED */
      let userFromDb = await global.dbQuery('SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (userFromDb.length) {
        userFromDb = userFromDb[0];

        if (await bcrypt.compare(password, userFromDb.password)) {
          let user = Object.assign({}, userFromDb);
          delete user.password;

          req.session.user = user;
          res.json({
            user: user,
            status: 'Logged in!'
          });

          return;
        }
      }

      res.json({
        user: false,
        status: 'Wrong login credentials!'
      });

    });

  }

}