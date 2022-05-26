const express = require("express")

const app = express();

app.use(express.json());

// Import routes
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/index");

// Setup all the routes
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);

const port = process.env.port || 8080;
app.listen(port, ()=>{
	console.log(`Waras REST API listening on port ${port}`);
});

app.get("/", async (req, res)=> {
	res.json({ status: "Waras APP READY!!"})
});