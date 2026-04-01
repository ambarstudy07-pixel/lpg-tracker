const express = require("express");
const { google } = require("googleapis");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "1hoMj-g6dESp9HJr23VawUHDcC1sikqale482f_G9XY8";

app.post("/submit", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const d = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          d.date,
          d.agency,
          d.omc,
          d.dom_rec,
          d.dom_dis,
          d.com_rec,
          d.com_dis,
          d.ind_rec,
          d.ind_dis,
          d.stock
        ]]
      }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
