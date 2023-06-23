const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");

mongoose.connect("mongodb://mongo:27017/devops_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
});

const Student = mongoose.model("Student", studentSchema);

amqp.connect("amqp://guest:guest@rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "student";

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(
      " [*] Waiting for messages in %s. To exit press CTRL+C dd gg easy",
      queue
    );

    channel.consume(
      queue,
      async function (msg) {
        const content = JSON.parse(msg.content);
        const student = new Student({
          firstname: content.firstname,
          lastname: content.lastname,
          email: content.email,
        });

        try {
          await student.save();
          console.log("Student has been saved.");
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
