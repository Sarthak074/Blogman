import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const data = req.session.data || []; // Retrieve data from session or set to empty object
  res.render("index.ejs", { data });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/blog", (req, res) => {
  const data = req.body;
  console.log(req.body);
  if (!data.t1 || data.t1.trim() === "") {
    res.send(
      "<h1 style='text-align: center; margin-top: 5rem'>No content found ⚠️</h1>"
    );
  } else {
    if (!req.session.data) {
      req.session.data = [];
    }
    req.session.data.push(data.t1); // Store data in session
    res.redirect("/");
  }
});

app.post("/delete/:index", (req, res) => {
  const index = req.params.index;
  if (req.session.data && req.session.data.length > index) {
    req.session.data.splice(index, 1); // Remove post at index
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
