const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const moment = require("moment");
require("dotenv").config();
const port = process.env.PORT || 5000; //!Admin: disha@gmail.com / password: diasha11

//? ----> middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER2}:${process.env.DB_PASS2}@cluster0.l9sv8bf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const teachersCollection = client
      .db("schoolProject")
      .collection("teachersCollection");
    const admissionCollection = client
      .db("schoolProject")
      .collection("admissionCollection");
    const usersCollection = client
      .db("schoolProject")
      .collection("usersCollection");
    const studentsMsgCollection = client
      .db("schoolProject")
      .collection("studentsMsgCollection");
    const resultsCollection = client
      .db("schoolProject")
      .collection("resultsCollection");
    const noticeCollection = client
      .db("schoolProject")
      .collection("noticeCollection");
    const routineCollection = client
      .db("schoolProject")
      .collection("routineCollection");
    const calenderCollection = client
      .db("schoolProject")
      .collection("calenderCollection"); 

    const verifyAdmin = async (req, res, next) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user?.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }

      next();
    };

    app.post("/calender", verifyAdmin, async (req, res) => {
      try {
        const calender = req.body;
        const result = await calenderCollection.insertOne(calender);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.get("/calender", async (req, res) => {
      try {
        const query = {
          start: { $gte: moment(req.query.start).toDate() },
          end: { $lte: moment(req.query.end).toDate() }, 
        };
        const events = await calenderCollection.find(query);
        res.send(events);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.get("/routine", async (req, res) => {
      const routine = await routineCollection.find({}).toArray();
      res.send(routine);
    });

    app.get("/notice", async (req, res) => {
      try {
        const result = await noticeCollection.find({}).toArray();
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.delete("/notice/:id", verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await noticeCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.post("/notice", verifyAdmin, async (req, res) => {
      try {
        const notice = req.body;
        const result = await noticeCollection.insertOne(notice);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.post("/results", verifyAdmin, async (req, res) => {
      try {
        const stResult = req.body;
        const result = await resultsCollection.insertOne(stResult);
        res.send(result);
      } catch (error) {
        res.send(res.message);
      }
    });

    app.get("/results/:roll", async (req, res) => {
      try {
        const roll = req.params.roll;
        const filter = { roll: roll };
        const result = await resultsCollection.findOne(filter);
        res.send(result);
      } catch (error) {
        res.send(res.message);
      }
    });

    app.get("/teachers", async (req, res) => {
      try {
        const query = {};
        const teachers = await teachersCollection.find(query).toArray();
        res.send(teachers);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.post("/teachers", verifyAdmin, async (req, res) => {
      try {
        const teacher = req.body;
        const result = await teachersCollection.insertOne(teacher);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.delete("/teachers/:id", verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await teachersCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.get("/admission", async (req, res) => {
      try {
        const query = {};
        const admissions = await admissionCollection.find(query).toArray();
        res.send(admissions);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.post("/admission", async (req, res) => {
      try {
        const admission = req.body;
        const result = await admissionCollection.insertOne(admission);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.put("/admission/:id", verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: "approved",
          },
        };
        const result = await admissionCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.get("/users", verifyAdmin, async (req, res) => {
      try {
        const query = {};
        const user = await usersCollection.find(query).toArray();
        res.send(user);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.delete("/users/admin/:id", verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.get("/users/admin/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === "admin" });
      } catch (error) {
        res.send(error.message);
      }
    });

    app.put("/users/admin/:id", verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await usersCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.post("/message", async (req, res) => {
      try {
        const message = req.body;
        const result = await studentsMsgCollection.insertOne(message);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.get("/message", verifyAdmin, async (req, res) => {
      try {
        const query = {};
        const result = await studentsMsgCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    app.delete("/message/:id", verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await studentsMsgCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("school project server is running....");
});

app.listen(port, () =>
  console.log(`school project server is running on ${port}`)
);
