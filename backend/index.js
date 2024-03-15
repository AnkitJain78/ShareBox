const express = require("express");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("./files")) {
      fs.mkdirSync("./files");
    }
    cb(null, path.join(__dirname, "./files/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  }
});

const upload = multer({ storage: storage });
app.post("/upload", upload.any(), function (req, res) {
  res.status(200).send({ message: "Uploaded Successfully!", files: req.files });
});
app.post("/email", function (req, res) {
  const fileNames = [];
 
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const { email, firstName, lastName } = req.body;

  const uploaded = req.body.uploaded
  if (!uploaded || uploaded.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const attachments = uploaded.map((file) => {
    return {
      filename: file.originalname,
      path: file.path
    };
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Someone shared you a file!",
    text: `Hey!, ${firstName} ${lastName} want to share a file with you. Here are the attachments of the files`,
    attachments: attachments
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Email not sent");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully!");
    }
  });
});
app.get("/file/:filename", function (req, res) {
  res
    .status(200)
    .sendFile(path.join("./files/", `files/${req.params.filename}`));
});
app.listen(5000, () => console.log("Listening"));