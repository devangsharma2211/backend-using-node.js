const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const { google } = require('googleapis');

// MongoDB Connection
const mongoUri = "mongodb://localhost:27017/test";

mongoose
    .connect(mongoUri, {
        //useNewUrlParser: true,
      //  useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define the schema and model
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }

});

const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sdevang567@gmail.com',
        pass: 'vaol lbjy cdzk luqm',  // or use an app password if you have 2-factor authentication enabled
    },
});



const Registration = mongoose.model("Registration", registrationSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "reg.html"));
});

app.post('/register', async (req, res) => {
    const { name, email, phone, address, city, state, zip, gender } = req.body;
    // Check for missing fields
    if (!name || !email || !phone || !address || !city || !state || !zip || !gender) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const registrationData = new Registration({
            name,
            email,
            phone,
            address,
            city,
            state,
            zip,
            gender,
        });

        await registrationData.save();
         // Send confirmation email
         const mailOptions = {
            from: 'sdevang567@gmail.com',  // Sender email
            to: email,  // Recipient email
            subject: 'Registration Successful',
            text: `Hello ${name},\n\nYou have successfully registerd in team devang sharma.\n\nBest regards,\nTeam Devang Sharma`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        res.redirect("/popup.html");
    } catch (error) {
        console.error("Error saving registration data:", error);
        res.redirect("/error.html");
    }
});


// Server Start
const port = 5500;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
