const nodemailer = require('nodemailer');
// const request = require('request');

// create a nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "hlangari1353@gmail.com",
        pass: "cxvarvezccwedmxe"
    },
});

// define the email message
const mailOptions = {
  from: 'hlangari1353@gmail.com',
  to: 'hlangari1353@gmail.com',
  subject: 'Test Email with Button',
  html: `<body><p>Hello,</p><p>Click the button below to trigger an API request:</p><form method="POST" action="http://127.0.0.1:5000/users/accept?reqid=4&Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY4NzE3NTE2NiwiZXhwIjoxNjg5NzY3MTY2fQ.TvivHZ4verbo-gNwzSomVb1sepIhTc5NJE9sHXL9P_o">
                                                                                <button style="background-color: rgb(44, 51, 64); border-radius: 4px; color: aliceblue; border-style: none; width: 70px; height: 40px; font-size: medium; font-family: sans-serif;" type="submit">Click!</button>
                                                                                </form></body>`
};

// send the email
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
