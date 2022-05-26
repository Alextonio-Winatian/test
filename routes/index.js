const express = require("express")

const bcrypt = require("bcrypt")

// Import middlewares
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");

const pool = require("../sql");
// Setup the router for express
const router = express.Router();

// *************************
// Set up the route handlers
// *************************

//GET USER ALL DATA
router.get("/users", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbuserwaras";
 	pool.query(query, (error, result)=>{
		res.json(result); 
	});
});

//GET DIAGNOSE ALL DATA
router.get("/diagnoses", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbdiagnose";
 	pool.query(query, (error, result)=>{
		res.json(result); 
	});
});

//GET RECOMENDATION ALL DATA
router.get("/recomendations", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbrecom";
 	pool.query(query, (error, result)=>{
		res.json(result); 
	});
});

//GET ALL dataRecomendation 
router.get("/dataRecomendations", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbdatarecom";
 	pool.query(query, (error, result)=>{
		res.json(result); 
	});
});

//GET ALL HISTORY DATA 
router.get("/history", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbhistory";
 	pool.query(query, (error, result)=>{
		res.json(result); 
	});
});

//GET USER DATA BY USERNAME
router.get("/users/username", [auth, admin], async (req, res)=>{
	const username = req.query.username
	const query = `SELECT * FROM tbuserwaras WHERE username = '${username}'`;
	pool.query(query, [req.params.username], (error, result)=>{
		if (!result[0]) {
			res.json({status: "Error", message: "User Not found!"});
		} else {
			res.json(result[0]);
		} 
	});
});

//GET DIAGNOSE DATA BY ID
router.get("/diagnoses/:id", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbdiagnose WHERE id_diagnose= ?";
	pool.query(query, [req.params.id], (error, result)=>{
		if (!result[0]) {
			res.json({status: "Error", message: "User Not found!"});
		} else {
			res.json(result[0]);
		} 
	});
});

//GET RECOMENDATION DATA BY ID
router.get("/recomendations/:id", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbrecom WHERE id_rekomendasi = ?";
	pool.query(query, [req.params.id], (error, result)=>{
		if (!result[0]) {
			res.json({status: "Error", message: "User Not found!"});
		} else {
			res.json(result[0]);
		} 
	});
});

//GET dataRecomendation BY ID
router.get("/dataRecomendations/:id", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbdatarecom WHERE id_dataRecom = ?";
	pool.query(query, [req.params.id], (error, result)=>{
		if (!result[0]) {
			res.json({status: "Error", message: "User Not found!"});
		} else {
			res.json(result[0]);
		} 
	});
});

//GET ALL HISTORY DATA 
router.get("/history/:id", [auth, admin], async (req, res)=>{
	const query = "SELECT * FROM tbhistory WHERE id_history = ?";
	pool.query(query, [req.params.id], (error, result)=>{
		if (!result[0]) {
			res.json({status: "Error", message: "User Not found!"});
		} else {
			res.json(result[0]);
		} 
	});
});

//POST CREATE ADMIN DATA TO DB
router.post("/token", [auth, admin], async (req, res)=>{
	try {
		const hashedPassword = await bcrypt.hash(req.query.password, 10)
		const created_at = new Date().toISOString();
		const data = {
			username: req.query.username,
			password: hashedPassword,
			roles: req.query.roles,
			created_at: created_at,
		}
		const query1 = "INSERT INTO tbauth (username, password, roles, created_at) VALUES (?, ?, ?, ?)";
		pool.query(query1, Object.values(data), (error)=>{
				if (error){
						res.json({status: "Error", message : "Username and/or Email already exists!" });
				} else {
						res.json({status: "Success", message : "User Created!" });
				}
		});
  } catch(error) {
	 		res.json({ status: "Error", reason: error });  
    }
});

//POST REGISTER DATA TO DB
router.post("/register", [auth, admin], async (req, res)=>{
	try {
		const hashedPassword = await bcrypt.hash(req.query.password, 10)
		const created_at = new Date().toISOString();
  	const updatedAt = created_at;
		const data = {
			username: req.query.username,
			full_name: req.query.full_name,
			email: req.query.email,
			password: hashedPassword,
			telephone: req.query.telephone,
			date_of_birth: req.query.date_of_birth,
			created_at: created_at,
			updated_at: updatedAt,
		}
		const query1 = "INSERT INTO tbuserwaras ( username, full_name,  email, password, telephone, date_of_birth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		pool.query(query1, Object.values(data), (error)=>{
				if (error){
						res.json({status: "Error", message : "Username and/or Email already exists!" });
				} else {
						res.json({status: "Success", message : "User Created!" });
				}
		});
  } catch {
			res.json({ status: "Error" });  
    }
});

//VALIDATE LOGIN
router.post("/login", [auth, admin], async (req, res) => {
		const username = req.query.username
		const password = req.query.password
		if (username == null || username == '' || password == ''|| password == null){
			return res.json({ status: "Error", message: "Please input username and/or password!"});
		} 
	  const query1 = `SELECT * FROM tbuserwaras WHERE username = '${username}'`;
		try {
				pool.query(query1, async(error, result)=>{
					if (!result[0]) {  
						return res.json({status: "Error", message: "User Not found!"});
					}
					if(await bcrypt.compare(password , result[0].password)) {
						res.json({status: "Success", data : result[0]});
					} else {
						res.json({status: "Error", message: "Incorrect Username and/or Password!"});
					}
				});
			} catch {
				res.json({status: "Error", reason: 500});
			}
});

//VALIDATE PASSWORD 
router.post("/users/changePassword", [auth, admin], async (req, res) => {
	const username = req.query.username
	const password = req.query.password
	if (username == null || username == '' || password == ''|| password == null){
		return res.json({status: "Error", message: "Please input username and/or password"});
	} 
	const query1 = `SELECT * FROM tbuserwaras WHERE username = '${username}'`;
	try {
			pool.query(query1, async(error, result)=>{
				console.log(result)
				if (!result[0]) {  
					return res.json({status: "Error", message: "User Not found!"});
				}
				if(await bcrypt.compare(password , result[0].password)) {
					res.json({ status: "Success"});
				} else {
					res.json({ status: "Error", message : "Incorrect Password!"});
				}
			});
		} catch {
			res.json({status: "Error", reason: 500});
		}
});

//VALIDATE EMAIL
router.post("/email", [auth, admin], async (req, res) => {
	const email = req.query.email
	if (email == null || email == ''){
		return res.json({ status: "Error", message: "Please input email!"});
	} 
	const query1 = `SELECT * FROM tbuserwaras WHERE email = '${email}'`;
	try {
			pool.query(query1, async(error, result)=>{
				if (!result[0]) {  
					return res.json({status: "Error", message: "User Not found!"});
				} else {
					res.json({ status: "Success", data : result[0]});
				}
			});
		} catch {
			res.json({status: "Error", reason: 500});
		}
});

//POST DIAGNOSE DATA TO DB
router.post("/diagnoses", [auth, admin], async (req, res)=>{
	try {
		const created_at = new Date().toISOString();
		const data = {
			umur: req.query.umur,
			gender: req.query.gender,
			demam: req.query.demam,
			batuk: req.query.batuk,
			kelelahan: req.query.kelelahan,
			sakit_tenggorokan: req.query.sakit_tenggorokan,
			pilek: req.query.pilek,
			sesak_napas: req.query.sesak_napas,
			muntah: req.query.muntah,
			lama_hari_sembuh: req.query.lama_hari_sembuh,
			created_at: created_at,
			id_user: req.query.id_user,
		}
		const query1 = "INSERT INTO tbdiagnose (umur, gender, demam, batuk, kelelahan, sakit_tenggorokan, pilek, sesak_napas, muntah, lama_hari_sembuh, created_at, id_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		pool.query(query1, Object.values(data), (error)=>{
				if (error){
						res.json({status: "Error", message : "Please fill correctly!"});
				} else {
						res.json({status: "Success", message : "Diagnose Created!" });
				}
		});
  } catch {
			res.json({ status: "Error" });  
    }
});

//POST RECOMENDATIONS DATA TO DB
router.post("/recomendations", [auth, admin], async (req, res)=>{
	try {
		const created_at = new Date().toISOString();
		const data = {
			rekomendasi: req.query.rekomendasi,
			created_at: created_at,
			id_user: req.query.id_user,
		}
		const query1 = "INSERT INTO tbrecom (rekomendasi, created_at, id_user) VALUES (?, ?, ?)";
		pool.query(query1, Object.values(data), (error)=>{
				if (error){
						res.json({status: "Error", message : "Please fill correctly!"});
				} else {
						res.json({status: "Success", message : "recomendations Created!" });
				}
		});
  } catch {
			res.json({ status: "Error" });  
    }
});

//POST dataRecomendation TO DB
router.post("/dataRecomendation",[auth, admin],  async (req, res)=>{
	try {
		const data = {
			data_rekomendasi: req.query.data_rekomendasi,
		}
		const query1 = "INSERT INTO tbdatarecom (data_rekomendasi) VALUES (?)";
		pool.query(query1, Object.values(data), (error)=>{
				if (error){
						res.json({status: "Error", message : "Please fill correctly!"});
				} else {
						res.json({status: "Success", message : "dataRecomendation Created!" });
				}
		});
  } catch {
			res.json({ status: "Error" });  
    }
});

//POST HISTORY DATA TO DB
router.post("/history", [auth, admin], async (req, res)=>{
	try {
		const created_at = new Date().toISOString();
		const data = {
			lama_hari_sembuh: req.query.lama_hari_sembuh,
			rekomendasi: req.query.rekomendasi,
			created_at: created_at,
			id_user: req.query.id_user,
		}
		const query1 = "INSERT INTO tbhistory (lama_hari_sembuh, rekomendasi, created_at, id_user) VALUES (?, ?, ?, ?)";
		pool.query(query1, Object.values(data), (error)=>{
				if (error){
						res.json({status: "Error", message : "Please fill correctly!"});
				} else {
						res.json({status: "Success", message : "recomendations Created!" });
				}
		});
  } catch {
			res.json({ status: "Error" });  
    }
});

//UPDATE PASSWORD TO DB
router.put("/users/changePassword", [auth, admin], async (req, res)=>{
	const username = req.query.username
	const hashedPassword = await bcrypt.hash(req.query.password, 10)
	let password = hashedPassword;
  let updated_at = new Date().toISOString();
	const data = {
		password: password,
		updated_at: updated_at,
	}
	const query1 = `UPDATE tbuserwaras SET password ='${password}', updated_at='${updated_at}' WHERE username = '${username}'`;
	const query2 = `SELECT * FROM tbuserwaras WHERE username = '${username}'`;
	try {
		pool.query(query2, (error, result)=>{
			if (!result[0]) {  
				return res.json({status: "Error", message: "User Not found!"});
			}	
		pool.query(query1, (error, result)=>{
			res.json({status: "Succes", message: "Update Succes!", data : data});		
		})	
		});
	} catch {
		res.json({status: "Error", reason: 500});
	}
});

//UPDATE ALL DATA TO DB
router.put("/users/:id", [auth, admin], async (req, res)=>{
	let id = req.params.id;
	let username = req.query.username;
	let full_name = req.query.full_name;
	let email = req.query.email;
	let telephone = req.query.telephone;
	let date_of_birth = req.query.date_of_birth;
  let updated_at = new Date().toISOString();
	const data = {
		username: username,
		full_name: full_name,
		email: email,
		telephone: telephone,
		date_of_birth: date_of_birth,
	}
	const query1 = `UPDATE tbuserwaras SET username = '${username}', full_name ='${full_name}', email ='${email}', telephone= '${telephone}', date_of_birth = '${date_of_birth}', updated_at='${updated_at}' WHERE id = ${id}`;
	const query2 = `SELECT * FROM tbuserwaras WHERE id= ${id}`;
	try {
		pool.query(query2, (error, result)=>{
			if (!result.length) {  
				return res.json({status: "Error", message: "User Not found!"});
			}
		pool.query(query1, (error, result)=>{
			if(error){
				return res.json({status: "Error", message: "Username, Full name or Email already exists!", reason: error.code });
			} else {
				res.json({status: "Succes", message: "Update Succes!", data: data});
			}
		})	
		});
	} catch {
		res.json({status: "Error", reason: 500});
	}
});


//DELETE USER DATA FROM DB
router.delete("/users/:id", [auth, admin], async (req, res)=>{
	const id = req.params.id
	const query1 = `SELECT * FROM tbuserwaras WHERE id= ${id}`;
	const query = `DELETE FROM tbuserwaras WHERE id= ${id}`;
		try {
			pool.query(query1, (error, result)=>{
				if (!result.length) {  
					return res.json({status: "Error", message: "User Not found!"});
				} else {
					pool.query(query, (error, result)=>{
						res.json({status: "Succes!"});
					})
				}
			});
		} catch {
			res.json({status: "Error", reason: 500});
		}
});

// Export the router
module.exports = router;