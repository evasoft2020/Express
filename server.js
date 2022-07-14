// import validator from 'validator';

const express = require("express");
const app = express();

/* app.get('/', (req, res) => {
  res.send('Get isteği');
});
app.get('/merhaba', (req, res) => {
  res.send('sanada merhaba');
});
app.post('/', (req, res) => {
  res.send('Post İsteği');
});
app.put('/', (req, res) => {
  res.send('Put İsteği');
});
app.patch('/', (req, res) => {
  res.send('Patch İsteği');
  });
//query string
app.get('/search', (req, res) => {
  var tag = req.query.tag;
  res.send('Search tag : '+ tag);
});

//url param string
app.get('/profile/:id', (req, res) => {
  var id = req.params.id;
  res.send('Profile ID : '+ id);
});
app.get('/kendini-yok-et', (req, res) => {
  var adminPass = req.header('adminPass');
  if(adminPass == '123'){
  res.send('Kendini yok etti!');

  }
  else{
    res.send('Kendini yok edemedi! ');
  }
});

//body 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.post('/', (req, res) => {
  var userName = req.body.userName;
  var password = req.body.password;
  res.send('User Name : '+ userName + ' Password : '+ password);
});

app.listen(9090, () => {
  console.log('Example app listening on port 9090!');
}); */

var Validator = require("validator");

// knex

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: process.cwd() + "/db.sq3",
  },
  useNullAsDefault: true,
});

async function initDatabaseMigration() {
  console.log("Database migration started...");
  await knex.schema.hasTable("tweets");

  await knex.schema.createTableIfNotExists("tweets", (table) => {
    table.increments("id").primary();
    table.string("tweet");
    table.string("userName");
    // createdAt
    table.timestamp("createdAt").defaultTo(knex.fn.now());

    console.log("Database migration stoped...");
  });
}
// start database
initDatabaseMigration();

const PORT = process.env.PORT || "3000";

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get hello
app.get("/", (req, res) => {
  res.send("Hello");
});

// get /tweets - return all tweets
app.get("/tweets", async (req, res) => {
  try {
    var tweets = await knex("tweets").select();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

  return res.json({
    tweets: tweets,
  });
});

// get /tweets/:id - return tweet with id
app.get("/tweets/:id", async (req, res) => {
  var id = req.params.id;
  try {
    var tweet = await knex("tweets").where("id", id);
  } catch (error) {
    console.log(error);
  }
  return res.json({
    tweet: tweet,
  });
});

// post /tweets - create new tweet

app.post("/tweets", async (req, res) => {
  /*  var createDto = validator(req.body, {
    tweet: "required|string|min:1|max:140",
    userName: "required|string|min:1|max:20",
  });
  if (createDto.fails()) {
    return res.status(400).json({ message: createDto.error.all() });
  } */
  //save to db
  try {
    var tweet = await knex("tweets").insert({
      tweet: req.body.tweet,
      userName: req.body.userName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
  return res.json({
    message: "Tweet created",
    tweet: tweet,
  });
});
// put /tweets/:id - update tweet with id
app.put("/tweets/:id", async (req, res) => {
  var id = req.params.id;
  /* var updateDto = validator(req.body, {
    tweet: "required|string|min:1|max:140",
    userName: "required|string|min:1|max:20",
  }); 
  if (updateDto.fails()) {
    return res.status(400).json({ message: createDto.error.all() });
  }*/
  //save to db
  try {
    var tweet = await knex("tweets").where("id", id).update({
      tweet: req.body.tweet,
      userName: req.body.userName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
  return res.json({
    message: "Tweet updated",
    tweet: tweet,
  });
});
// delete /tweets/:id - delete tweet with id
app.delete("/tweets/:id", async (req, res) => {
  const id = req.params.id;
  //delete from db
  try {
    var tweet = await knex("tweets").where("id", id).del();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
  return res.json({
    message: "Tweet deleted",
    deleted_tweet: tweet,
  });
});
