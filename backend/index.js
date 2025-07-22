const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "adityahedau293@gmail.com",
        pass: "xvfl qbks tskl xpav", // App password (never share this in production)
    },
});

app.post("/send-mail", async (req, res) => {
    const { name, email, query } = req.body;

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: "adityahedau293@gmail.com",
        subject: "📨 New Query from Footer",
        text: `
You received a new query from the portfolio contact form:

👤 Name: ${name}
📧 Email: ${email}
💬 Message: ${query}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent from portfolio contact form.");
        res.send("Query sent successfully");
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        res.status(500).send("Failed to send query");
    }
});

const PORT = 5400;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
