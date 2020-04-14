const express = require("express");
const db = require("../data/dbConfig");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ server: "be working"})
});

server.get("/api/accounts", (req, res) => {
    db.select("*")
      .from("accounts")
    //   .limit('5')
      .modify(function(queryFunc){if(req.query){
          if(req.query.limit){
           queryFunc.limit(req.query.limit)
          }
          if(req.query.sortby && req.query.sortdir){
          queryFunc.orderBy(req.query.sortby , req.query.sortdir)
          }
          if(req.query.sortby){
          queryFunc.orderBy(req.query.sortby)
          }
      }})
      .then(accounts => {
          console.log(req.query)
        res.status(200).json({ data: accounts });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: error.message });
      });
  });

  server.get("/api/accounts/:id", (req, res) => {
    db("accounts")
      .where({ id: req.params.id })
      .first()
      .then(account => {
        res.status(200).json({ data: account });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: error.message });
      });
  });
  

  server.post("/api/accounts", (req, res) => {
    const accountData = req.body;
    db("accounts")
      .insert(accountData, "id")
      .then(ids => {
        const id = ids[0];
        db("accounts")
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json({ data: account });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: error.message });
      });
  });


  server.patch("/api/accounts/:id", (req, res) => {
    const changes = req.body;
    const { id } = req.params;
    db("accounts")
      .where({ id }) 
      .update(changes)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: "update successful" });
        } else {
          res.status(404).json({ message: "no posts by that id found" });
        }
      });
  });


  server.delete("/api/accounts/:id", (req, res) => {
    db("accounts")
      .where({ id: req.params.id })
      .del()
      .then(count => {
        if (count > 0) {
            res.status(200).json({ message: "Deleted" });
          } else {
            res.status(404).json({ message: "no posts by that id found" });
          }
      })
    
  });
  

module.exports = server;
