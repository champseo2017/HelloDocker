const amqp = require("amqplib");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let channel;
let connection;

// Connect to RabbitMQ and create a channel
async function setupAmqp() {
  try {
    connection = await amqp.connect("amqp://guest:guest@rabbitmq");
    channel = await connection.createChannel();
  } catch (error) {
    console.error("Error setting up AMQP:", error);
  }
}

setupAmqp();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  const student = req.body;
  const queueStudent = "student";
  const msgStudent = JSON.stringify(student);

  const dataEnroll = {
    firstname: student.firstname,
    lastname: student.lastname,
    subjectid: "081102",
    term: 1,
    year: 2023,
  };
  const queueEnroll = "enroll";
  const msgEnroll = JSON.stringify(dataEnroll);

  // send to 'email_rpc_queue' queue
  const email_rpc_queue = "email_rpc_queue";
  const dataEmail = {
    id: 1,
    firstname: student.firstname,
    lastname: student.lastname,
    email: student.email,
  };
  const msgEmail = JSON.stringify(dataEmail);

  try {
    if (!channel || !connection) {
      throw new Error("No connection to RabbitMQ");
    }

    // send to 'student' queue
    await channel.assertQueue(queueStudent, { durable: false });
    await channel.sendToQueue(queueStudent, Buffer.from(msgStudent));
    console.log(" [x] Sent to student queue %s", msgStudent);

    // send to 'enroll' queue
    await channel.assertQueue(queueEnroll, { durable: false });
    await channel.sendToQueue(queueEnroll, Buffer.from(msgEnroll));
    console.log(" [x] Sent to enroll queue %s", msgEnroll);

    // send to 'email_rpc_queue' queue
    await channel.assertQueue(email_rpc_queue, { durable: false });
    await channel.sendToQueue(email_rpc_queue, Buffer.from(msgEmail));
    console.log(" [x] Sent to email_rpc_queue queue %s", msgEmail);

    res.status(200).json({ result: "registered" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred when trying to send the message" });
  }
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
