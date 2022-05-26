// Import dependencies
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

const pool = require("../sql");

// Setup the express server router
const router = express.Router();


// On post
router.post("/", async (req, res) => {
	const username = req.query.username
	const password = req.query.password
	if (username == null || username == '' || password == ''|| password == null){
		return res.json({ status: "Error", message: "Please input username and/or password!"});
	} 
	const query1 = `SELECT * FROM tbauth WHERE username = '${username}'`;
	try {
			pool.query(query1, async(error, result)=>{
				const users = result[0];
				if (!result[0]) {  
					return res.json({status: "Error", message: "User Not found!"});
				}
				if(await bcrypt.compare(password , result[0].password)) {
					const token = jwt.sign({
						id: result[0]._id,
						roles: result[0].roles,
					}, "jwtPrivateKey");
		
					res.json({status: "Success", token : token});
				} else {
					res.json({status: "Error", message: "Incorrect Username and/or Password!"});
				}
			});
		} catch {
			res.json({status: "Error", reason: 500});
		}
});

// Export the router
module.exports = router;
