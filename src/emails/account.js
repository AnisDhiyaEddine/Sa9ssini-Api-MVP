var nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  //  service: "gmail",
  service: "Gmail",
  auth: {
    user: process.env.ADMIN,
    pass: process.env.PASSWORD,
  },
});

const sendWelcomeEmail = async ({ email, userName }) => {
  let mailOptions = {
    from: process.env.ADMIN,
    to: email,
    subject: "Hello",
    test: `Hi ${userName}!

      Welcome to Sa9ssini! Thanks so much for joining us. You’re on your way to solve problems and beyond!
      Have any questions? Just shoot us an email! We’re always here to help.
      
      Cheerfully yours,
      
      The Sa9ssini Team`,
  };

  let info = await transporter.sendMail(mailOptions);
};

const sendCancelationEmail = async ({ email, UserName }) => {
  let mailOptions = {
    from: process.env.ADMIN,
    to: email,
    subject: "customize later",
    test: `customize later`,
  };

  let info = await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent : " + data.response);
    }
  });
};

module.exports = { sendWelcomeEmail, sendCancelationEmail };
