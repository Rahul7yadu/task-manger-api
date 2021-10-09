const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "rahulyadu17@gmail.com",
    subject: "thanks for joining in!",
    text: `welcome to the app, ${name}. let me know how to get along with the app`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "rahulyadu17@gmail.com",
    subject: "cancelation email",
    text: `good by ${name} . plese tell why you leaved`,
  });
};

module.exports = { sendWelcomeEmail, sendCancelationEmail };
