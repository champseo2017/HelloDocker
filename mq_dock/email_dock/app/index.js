require("dotenv").config();
const amqp = require("amqplib/callback_api");
const nodemailer = require("nodemailer");

console.log("process.env.RELAY_USERNAME", process.env.RELAY_USERNAME)

console.log("process.env.RELAY_PASSWORD", process.env.RELAY_PASSWORD)

function sendEmail(id, firstname, lastname, email) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.RELAY_USERNAME,
      pass: process.env.RELAY_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.RELAY_USERNAME,
    to: email,
    subject: "Register complete",
    text:
      "สวัสดีครับ คุณ " +
      firstname +
      " " +
      lastname +
      " รหัสนักศึกษา " +
      id +
      " ได้ลงทะเบียนแล้ว",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

amqp.connect("amqp://guest:guest@rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = "email_rpc_queue";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.consume(
      queue,
      function (msg) {
        let emailData = JSON.parse(msg.content);
        sendEmail(
          emailData.id,
          emailData.firstname,
          emailData.lastname,
          emailData.email
        );
      },
      {
        noAck: true,
      }
    );
  });
});
