const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

// initializing app
const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Connet to DB (will be created if not already existed)
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});
const articleSchema = new mongoose.Schema({ name: String, content: String });
const Article = mongoose.model("articles", articleSchema);

////////////////////////////////////////// Request targeting all articles //////////////////////////////////////////

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      name: req.body.name,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("successfully updated!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("successfully deletet everything!");
      } else {
        res.send(err);
      }
    });
  });

////////////////////////////////////////// Request targeting specific article //////////////////////////////////////////
app
  .route("/articles/:article")
  .get((req, res) => {
    article = req.params.article;
    Article.findOne({ name: article }, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    });
  })
  .patch((req, res) => {
    inputArticle = req.params.article;
    // const newArticle = new Article({
    //   name: req.body.name,
    //   content: req.body.content,
    // });
    Article.findOneAndUpdate(
      { name: inputArticle },
      { content: req.body.content },
      function (err) {
        if (!err) {
          res.send("articel updated");
        } else {
          console.log(err);
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("sever is running on port 3000");
});

// app.get("/articles", function (req, res) {
//   Article.find({}, function (err, docs) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(docs);
//     }
//   });
// });

// app.post("/articles", function (req, res) {
//     const newArticle = new Article({name: req.body.name, content: req.body.content});
//     newArticle.save(function(err) {
//         if (!err){
//             res.send("successfully updated!");
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.delete("/articles", function(req, res) {
//     Article.deleteMany({}, function(err) {
//         if (!err) {
//             res.send("successfully deletet everything!")
//         } else {
//             res.send(err);
//         }
//     });
// });
