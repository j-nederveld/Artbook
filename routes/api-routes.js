// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  //SEARCH ENDPOINTS
  app.get('/namesearch/:name', (req, res) => {

    var firstName = req.params.name.split(' ').slice(0, -1).join(' ');
    var lastName = req.params.name.split(' ').slice(-1).join(' ');
    var name = `${lastName}, ${firstName}`
          
    db.artwork_data.findAll({
        where: {
          artist: name
        }
      }).then(art => res.json(art))
    });

  app.get('/idsearch/:id', (req, res) => {

    var artId = req.params.id;

      db.artwork_data.findAll({
        where: {
          id: artId
        }
      }).then(art => res.json(art))
    });

  app.get('/artbook/:member', (req, res) => {

      db.artbook.findAll({
        where: {
          user_id: req.params.member
        }
      })
      .then(art => res.json(art))
    });

    app.get('/api/artwork', (req, res) => {
                db.artwork_data.findAll({})
                .then(art => {
      console.log(art)
      res.json(art)
      })
              });


  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  app.post("/api/saveart", (req, res) => {
    
    console.log(req.body);
    db.artbook.create({
      user_id: req.body.email,
      savedArt: req.body.id
    }).then(() => {
      console.log('saved');
      res.send('saved')
    }).catch(err => {
      console.log(err);
      res.status(422).send(err);
    });
  });

  app.get("/api/delete/:member/:id", (req, res) => {
    console.log("i tried");
    console.log(req.params);

    db.artbook.destroy({
      where: {
        user_id: req.params.member,
        savedArt: req.params.id
      }
    }).then(() => {
      console.log('deleted');
      res.send('deleted')
    }).catch(err => {
      console.log(err);
      res.status(422).send(err);
    });
  });




  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
