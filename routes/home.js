const express = require("express");
const router = express();
const session = require("express-session");

const getOAuth = require("../APIfunctions/getAuth");
const getPets = require("../APIfunctions/getPets");
const fakeArray = require("../js/details");
const fetch = require("node-fetch");

router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => {
  let user = req.session.user;

  res.render("home", user);
});

router.get("/pet-details", (req, res) => {
  getOAuth((newToken) => {
    req.session.tokenType = newToken.tokenType;
    req.session.token = newToken.token;
    getPets(newToken.token, newToken.tokenType, (data) => {
      res.render("petDetails", data);
    });
  });
});

// router.get("/pet-details", (req, res) => {
//   let animalArray = fakeArray.animals;
//   // animal[0].attributes.map((result) => {
//   //   console.log(result);
//   //});
//   res.render("petDetails", { animal: animalArray[0] });
// });

router.get("/pet-details/:id", (req, res) => {
  let petId = req.params.id;
  // if (!req.session.token) {
  getOAuth((newToken) => {
    req.session.tokenType = newToken.tokenType;
    req.session.token = newToken.token;
    fetch(`https://api.petfinder.com/v2/animals/${petId}`, {
      headers: {
        Authorization: newToken.tokenType + " " + newToken.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.animal);
        res.render("petDetails", data.animal);
      })
      .catch((error) => console.log(error));
  });
  // }
});

//
//
//
//
//
//
//         }})

//       }
//     })
//   //   .then((r) => r.json())
//   //   .then((pet) => {
//   //     console.log(pet);
//   //   });
//   // res.render("petDetails", { petId: petId });
//   })
// });

router.get("/user", authenticate, (req, res) => {
  let user = req.session.user;
  res.render("user", user);
});

router.get("/favorites", authenticate, (req, res) => {
  res.render("favorites");
});

router.get("/dogs", (req, res) => {
  res.render("dogs");
});

router.get("/find-match", (req, res) => {
  res.render("findMatch");
});

router.post("/find-match", (req, res) => {
  let q1 = req.body.catDog;
  let q2 = req.body.indoorOutdoor;
  let q3 = req.body.sml;
  let q4 = req.body.checks;
  console.log(q1);
  console.log(q2);
  console.log(q3);
  console.log(q4);
});

router.get("/cats", (req, res) => {
  res.render("cats");
});

function authenticate(req, res, next) {
  //   req.session.isAuthenticated = true;
  if (req.session) {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/log-in");
    }
  } else {
    res.redirect("/log-in");
  }
}
module.exports = router;
