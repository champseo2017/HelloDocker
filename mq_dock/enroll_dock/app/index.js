const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");

mongoose.connect("mongodb://mongo:27017/devops_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const enrollSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  subjectid: String,
  term: Number,
  year: Number,
});

const Enroll = mongoose.model("Enroll", enrollSchema);

amqp.connect("amqp://guest:guest@rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "enroll";

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(
      " [*] Waiting for messages in %s. To exit press CTRL+C dd gg",
      queue
    );

    channel.consume(
      queue,
      async function (msg) {
        const content = JSON.parse(msg.content);
        const enroll = new Enroll({
          firstname: content.firstname,
          lastname: content.lastname,
          subjectid: content.subjectid,
          term: content.term,
          year: content.year,
        });

        try {
          await enroll.save();
          console.log("Enroll has been saved.");
        } catch (err) {
          console.log(err);
        }
      },
      {
        noAck: true,
      }
    );
  });
});
