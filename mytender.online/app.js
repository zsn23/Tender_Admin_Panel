const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const { MESSAGES } = require('./config/messagesFile');
const pool = require('./config/database'); // Import the database connection
const multer = require('multer');
const nodemailer = require('nodemailer');


app.use(express.json()); // To parse JSON bodies

const checkOrigin = (origin, callback) => {
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);

  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

// Use the CORS middleware with the dynamic origin function
app.use(cors({
  origin: checkOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors({
  origin: checkOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('server running perfectly');
});

// Login dashboard API
app.post('/user/loginDashboard', (req, res) => {
  const { name, password } = req.body;

  try {
    pool.query('SELECT * FROM users WHERE LOWER(name) = LOWER(?) AND LOWER(password) = LOWER(?) LIMIT 1', [name, password], (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, data: results, message: "data not found" });
      }
      if (results.length > 0) {
        res.status(200).json({ status: true, data: results, message: "logged in successfully" });
      } else {
        res.status(401).json({ status: false, message: "Invalid credentials" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Example route to demonstrate CORS functionality
app.get('/tender/mytender.online/categories', (req, res) => {
  res.json({ message: 'This route is CORS-enabled' });
});

const checkCityExists = (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cities WHERE LOWER(name) = LOWER(?)';
    const values = [data.name.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};


 


// Endpoint to send email
// app.post('/send-email/', (req, res) => {
    
//     try{
//     const transporter = nodemailer.createTransport({
//       host: 'smtpout.secureserver.net',
//     port: 465,
//     secure: true,
//     debug: true,
//     auth: {
//         user: 'info@tender786.com',
//         pass: 'P@ssw0rd123///'
//     },
//       tls: {
//         rejectUnauthorized: false
//     }
    
//     });

//     // Compose email
//     const mailOptions = {
//         from: 'info@tender786.com',
//         to: 'asadnoman4@gmail.com',
//         subject: 'Test Email',
//         text: 'This is a test email from Node.js using nodemailer.'
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error occurred:', error);
//               res.status(200).json({ heading: 'email sent'+error.toString() });
//         } else {
//              res.status(200).json({ heading: 'email sent' });
//         }
//     });
    
//     }
//     catch (err) {
//           res.status(200).json({ heading: 'email sent'+err.toString() });
//     }
// });

 const transporter = nodemailer.createTransport({
    host: 'business200.mypowerfulserver.com',
    port: 25,
    auth: {
        user: 'tedner786@tender786.com',
        pass: 'P@ssw0rd123///'
    }
});

// Endpoint to send email
app.post('/send-email/', (req, res) => {
      const { dataForEmail } = req.body;

    try {
        if(dataForEmail.length>0){
            dataForEmail.forEach((items)=>{
         
                var mailOptions = {
                from: 'info@tender786.com',                   // Sender address
                to: items.userInfo.email,       // List of recipients
                subject: 'Today Tender List',              // Subject line
                html:items.tenderInfo              
                };
                            // Send email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error occurred:', error);
                        res.status(500).json({ message: 'Error sending email', error: error.toString() });
                    } else {
                        console.log('Message sent:', info.messageId);
                        res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
                    }
                });
            });
        }
       
      
    } catch (err) {
        console.error('Error in sending email:', err);
        res.status(500).json({ message: 'Failed to send email', error: err.toString() });
    }
});

// Define a route for the heading
app.post('/city/', (req, res) => {
  const { name, effectedBy } = req.body;

  try {

    checkCityExists(req.body)
      .then((exists) => {
        if (exists) {
          res.status(200).json({ status: false, data: {}, message: "already exists" });
        }
        else {
          const sql = 'INSERT INTO cities (name, effectedBy,effectedDate) VALUES (?, ?,?)';
          const values = [name, effectedBy, new Date()];

          pool.query(sql, values, (error, results) => {
            if (error) {
              res.status(200).json({ status: false, data: {}, message: error.toString() });
            } else {

              if (results.insertId > 0) {
                const sql2 = 'SELECT * FROM cities WHERE id = ?';
                const values2 = [results.insertId];

                pool.query(sql2, values2, (err, response) => {
                  res.status(200).json({ status: true, data: response, message: MESSAGES.CREATED });
                });
              }
              else {
                res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
              }
            }
          });
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error('An error occurred:', error);
      });




  }
  catch (err) {
    res.status(500).json({ status: false, data: {}, message: err.toString() });

  }
});

app.get('/city/', (req, res) => {

  try {
       
res.status(200).json({ status: true, data: [], message: 'testing' });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: err.toString() });
  }
});

app.post('/city/deleteCity', (req, res) => {
  try {
    const { id } = req.body;

    const sql = 'DELETE FROM cities WHERE id = ?';
    const values = [id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });

      }
    });
  }
  catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

app.post('/city/updateCity', (req, res) => {
  try {
    const { name, id, effectedBy } = req.body

    const sql = 'UPDATE cities SET name = ?, effectedBy = ?, effectedDate = ? WHERE id = ?';
    const values = [name, effectedBy, new Date(), id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });



  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});




app.get('/categories/', (req, res) => {
  try {
    pool.query('SELECT categories.*, users.name AS userName FROM categories INNER JOIN users ON categories.effectedBy = users.id', (err, results) => {
      if (err) {
        return res.status(200).json({ status: false, data: [], message: err.toString() });
      }
      return res.status(200).json({ status: true, data: results, message: 'Found' });
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: err.toString() });
  }
});

const checkExistsCategories = (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM categories WHERE LOWER(name) = LOWER(?)';
    const values = [data.name.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};

app.post('/categories/', (req, res) => {
  const { name, effectedBy } = req.body;

  try {
    checkExistsCategories(req.body).then((exists) => {
      if (exists) {
        res.status(200).json({ status: false, data: {}, message: "already exists" });
      } else {
        const sql = 'INSERT INTO categories (name, effectedBy, effectedDate) VALUES (?, ?, ?)';
        const values = [name, effectedBy, new Date()];

        pool.query(sql, values, (error, results) => {
          if (error) {
            res.status(200).json({ status: false, data: {}, message: error.toString() });
          } else {
            if (results.insertId > 0) {
              const sql2 = 'SELECT * FROM categories WHERE id = ?';
              const values2 = [results.insertId];

              pool.query(sql2, values2, (err, response) => {
                if (err) {
                  res.status(200).json({ status: false, data: {}, message: err.toString() });
                } else {
                  res.status(200).json({ status: true, data: response, message: 'Created' });
                }
              });
            } else {
              res.status(200).json({ status: false, data: [], message: 'Failed' });
            }
          }
        });
      }
    }).catch((error) => {
      console.error('An error occurred:', error);
    });
  } catch (err) {
    res.status(500).json({ status: false, data: {}, message: err.toString() });
  }
});


app.post('/categories/saveMultipleCategories', (req, res) => {
   const { values,effectedBy } = req.body
  try {   
    const insertPromises = values.map(org => {
      const sql = 'INSERT INTO categories (name, effectedBy, effectedDate) VALUES (?, ?, ?)';
      const values = [org.name, effectedBy, new Date()];
      return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.insertId);
          }
        });
      });
    });

          Promise.all(insertPromises)
            .then(insertedIds => {
              const selectPromises = insertedIds.map(insertedId => {
                const sql = 'SELECT * FROM categories WHERE id = ?';
                const values = [insertedId];
                return new Promise((resolve, reject) => {
                  pool.query(sql, values, (err, response) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(response);
                    }
                  });
                });
              });

              Promise.all(selectPromises)
                .then(responses => {
                  res.status(200).json({ status: true, data: responses, message: "Multiple categories created successfully" });
                })
                .catch(error => {
                  res.status(200).json({ status: false, data: {}, message: error.toString() });
                });
            })
            .catch(error => {
              res.status(200).json({ status: false, data: {}, message: error.toString() });
            });
        }  
  catch (err) {
    res.status(500).json({ status: false, data: {}, message: err.toString() });
  }
});

app.post('/categories/deleteCategory', (req, res) => {
  try {
    const { categoryId } = req.body;

    const sql = 'DELETE FROM categories WHERE id = ?';
    const values = [categoryId];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });

      }
    });
  }
  catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

app.post('/categories/updateCategory', (req, res) => {
  try {
    const { name, id, effectedBy } = req.body

    const sql = 'UPDATE categories SET name = ?, effectedBy = ?, effectedDate = ? WHERE id = ?';
    const values = [name, effectedBy, new Date(), id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });
  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

const checkUserExists = (data) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM users WHERE LOWER(name) = LOWER(?)';
    const values = [data.name.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};

app.post('/user/', (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {

    checkUserExists(req.body)
      .then((exists) => {
        if (exists) {
          res.status(200).json({ status: false, data: {}, message: "already exists" });
        }
        else {
          const sql = 'INSERT INTO users (name, email, password,phoneNumber,status, effectedDate) VALUES (?, ?,?,?,?,?)';
          const values = [name, email, password, phoneNumber, true, new Date()];

          pool.query(sql, values, (error, results) => {
            if (error) {
              res.status(200).json({ status: false, data: {}, message: error.toString() });
            } else {
              res.status(200).json({ status: true, data: results, message: 'user created successfully' });
            }
          });
        }
      })

  }
  catch (err) {
    res.status(200).json({ status: false, data: {}, message: err.toString() });

  }

});

app.get('/user/', (req, res) => {

  try {

    pool.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, data: results, message: "data not' found" });
      }
      res.status(200).json({ status: true, data: results, message: "data found" });
    });

  } catch (err) {
    res.status(500).json({ message: MESSAGES.ERROR_MESSAGE });
  }
});

app.post('/user/updateUser', (req, res) => {
  try {
    const { name, email, password, phoneNumber, id } = req.body

    const sql = 'UPDATE users SET name = ?, email = ?,effectedDate = ?, password = ?,status=?,phoneNumber=? WHERE id = ?';
    const values = [name, email, new Date(), password, true, phoneNumber, id];



    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });
  }
  catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.ERROR_MESSAGE + err });
  }
});

app.post('/organizations/saveMultipleOrganizations', (req, res) => {
   const { values,effectedBy } = req.body
  try {   
    const insertPromises = values.map(org => {
      const sql = 'INSERT INTO organizations (name, effectedBy, effectedDate) VALUES (?, ?, ?)';
      const values = [org.name, effectedBy, new Date()];
      return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.insertId);
          }
        });
      });
    });

          Promise.all(insertPromises)
            .then(insertedIds => {
              const selectPromises = insertedIds.map(insertedId => {
                const sql = 'SELECT * FROM organizations WHERE id = ?';
                const values = [insertedId];
                return new Promise((resolve, reject) => {
                  pool.query(sql, values, (err, response) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(response);
                    }
                  });
                });
              });

              Promise.all(selectPromises)
                .then(responses => {
                  res.status(200).json({ status: true, data: responses, message: "Multiple organizations created successfully" });
                })
                .catch(error => {
                  res.status(200).json({ status: false, data: {}, message: error.toString() });
                });
            })
            .catch(error => {
              res.status(200).json({ status: false, data: {}, message: error.toString() });
            });
        }  
  catch (err) {
    res.status(500).json({ status: false, data: {}, message: err.toString() });
  }
});


app.get('/organizations/', (req, res) => {
  try {
    pool.query('SELECT organizations.*, users.name AS userName FROM organizations INNER JOIN users ON organizations.effectedBy = users.id', (err, results) => {
      return res.status(200).json({ status: true, data: results, message: MESSAGES.FOUND });
    });

  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.ERROR_MESSAGE });
  }
});


const checkExistsOrganizations = (data) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM organizations WHERE LOWER(name) = LOWER(?)';
    const values = [data.name.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};

app.post('/organizations/', (req, res) => {
  const { name, effectedBy } = req.body;

  try {

    checkExistsOrganizations(req.body)
      .then((exists) => {
        if (exists) {
          res.status(200).json({ status: false, data: {}, message: "already exists" });
        }
        else {
          const sql = 'INSERT INTO organizations (name, effectedBy,effectedDate) VALUES (?, ?,?)';
          const values = [name, effectedBy, new Date()];

          pool.query(sql, values, (error, results) => {
            if (error) {
              res.status(200).json({ status: false, data: {}, message: error.toString() });
            } else {
              if (results.insertId > 0) {
                const sql2 = 'SELECT * FROM organizations WHERE id = ?';
                const values2 = [results.insertId];

                pool.query(sql2, values2, (err, response) => {
                  res.status(200).json({ status: true, data: response, message: MESSAGES.CREATED });
                });
              }
              else {
                res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
              }
            }
          });
        }
      })
  }
  catch (err) {
    res.status(500).json({ status: false, data: {}, message: err.toString() });

  }

});

app.post('/organizations/deleteOrganization', (req, res) => {

  try {
    const { id } = req.body;

    const sql = 'DELETE FROM organizations WHERE id = ?';
    const values = [id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });

      }
    });
  }
  catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

app.post('/organizations/updateOrganization', (req, res) => {
  try {
    const { name, id, effectedBy } = req.body

    const sql = 'UPDATE organizations SET name = ?, effectedBy = ?, effectedDate = ? WHERE id = ?';
    const values = [name, effectedBy, new Date(), id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
      }
    });
  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});



const checkExists = (data) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM newspapers WHERE LOWER(name) = LOWER(?)';
    const values = [data.name.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};


app.post('/newsPaper/', (req, res) => {
  const { name, effectedBy } = req.body;
  try {

    checkExists(req.body)
      .then((exists) => {
        if (exists) {
          res.status(200).json({ status: false, data: {}, message: "already exists" });
        } else {
          const sql = 'INSERT INTO newspapers (name, effectedBy,effectedDate) VALUES (?, ?,?)';
          const values = [name, effectedBy, new Date()];

          pool.query(sql, values, (error, results) => {
            if (error) {
              res.status(200).json({ status: false, data: {}, message: error.toString() });
            } else {
              res.status(200).json({ status: true, data: results, message: 'newspapers created successfully' });
            }
          });
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error('An error occurred:', error);
      });
  }
  catch (err) {
    res.status(500).json({ status: false, data: {}, message: err.toString() });
  }
});

app.get('/newsPaper/', (req, res) => {
  try {
    pool.query('SELECT newspapers.*, users.name AS userName FROM newspapers INNER JOIN users ON newspapers.effectedBy = users.id', (err, results) => {
      return res.status(200).json({ status: true, data: results, message: MESSAGES.FOUND });
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: err.toString() });
  }
});
app.post('/newsPaper/deleteNewsPaper', (req, res) => {
  try {
    const { id } = req.body;

    const sql = 'DELETE FROM newspapers WHERE id = ?';
    const values = [id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });

      }
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

app.post('/newsPaper/updateNewsPaper', (req, res) => {
  try {
    const { name, id, effectedBy } = req.body

    const sql = 'UPDATE newspapers SET name = ?, effectedBy = ?, effectedDate = ? WHERE id = ?';
    const values = [name, effectedBy, new Date(), id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
      }

    });
  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});


// for tender/id
app.get('/tender', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const offset = (page - 1) * limit;

  pool.query(
    'SELECT tenders.*, users.name AS userName, cities.name AS cityName, organizations.name AS organizationName, newspapers.name AS newPaperName ' +
    'FROM tenders ' +
    'INNER JOIN users ON tenders.effectedBy = users.id ' +
    'INNER JOIN cities ON tenders.city = cities.id ' +
    'INNER JOIN organizations ON tenders.organization = organizations.id ' +
    'INNER JOIN newspapers ON tenders.newspaper = newspapers.id ' +
    'LIMIT ? OFFSET ?', [limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, message: 'An error occurred in fetching tender.' });
      }

      pool.query('SELECT COUNT(*) AS total FROM tenders', (err, countResults) => {
        if (err) {
          return res.status(500).json({ status: false, message: 'An error occurred while fetching the total count of tenders.' });
        }

        const totalItems = countResults[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200).json({
          status: true,
          message: 'All Tender',
          data: {
            current_page: page,
            data: results,
            first_page_url: `http://localhost:${PORT}/tender?page=1&limit=${limit}`,
            from: offset + 1,
            last_page: totalPages,
            last_page_url: `http://localhost:${PORT}/tender?page=${totalPages}&limit=${limit}`,
            next_page_url: page < totalPages ? `http://localhost:${PORT}/tender?page=${page + 1}&limit=${limit}` : null,
            path: `http://localhost:${PORT}/tender`,
            per_page: limit,
            prev_page_url: page > 1 ? `http://localhost:${PORT}/tender?page=${page - 1}&limit=${limit}` : null,
            to: offset + results.length,
            total: totalItems
          },
          statusCode: 200
        });
      });
    }
  );
});

app.get('/tender/:id', (req, res) => {
  const tenderId = req.params.id;
  pool.query(
    'SELECT tenders.*, users.name AS userName, cities.name AS cityName, organizations.name AS organizationName, newspapers.name AS newPaperName ' +
    'FROM tenders ' +
    'INNER JOIN users ON tenders.effectedBy = users.id ' +
    'INNER JOIN cities ON tenders.city = cities.id ' +
    'INNER JOIN organizations ON tenders.organization = organizations.id ' +
    'INNER JOIN newspapers ON tenders.newspaper = newspapers.id ' +
    'WHERE tenders.id = ?', [tenderId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, message: 'An error occurred while fetching the tender.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ status: false, message: 'Tender not found.' });
      }
      return res.status(200).json({ status: true, data: results[0], message: 'Tender found successfully.' });
    }
  );
});
const checkExistsTender = (data) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tenders WHERE LOWER(IPLNUMBER) = LOWER(?)';
      const values = [data.IPLNumber];
      pool.query(sql, values, (err, results) => {
          if (err) {
              reject(err);
          } else if (results.length > 0) {
              resolve(true);
          } else {
              resolve(false);
          }
      });
  });
};
app.post('/tender/', (req, res) => {
  const {
      name,
      IPLNumber,
      openDate,
      pubLishDate,
      effectedBy,
      effectedDate,
      tenderImage,
      organization,
      newsPaper,
      category,
      city
  } = req.body;

  try {
      checkExistsTender(req.body)
          .then((exists) => {
              if (exists) {
                  res.status(200).json({ status: false, data: {}, message: 'Tender already exists.' });
              } else {
                  const sql = 'INSERT INTO tenders (IPLNUMBER, name, effectedBy, effectedDate, openDate, pubLishDate, tenderImage, organization, newsPaper, category, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                  const values = [IPLNumber, name, effectedBy, effectedDate, openDate, pubLishDate, tenderImage, organization, newsPaper, category, city];

                  pool.query(sql, values, (error, results) => {
                      if (error) {
                          res.status(200).json({ status: false, data: {}, message: error.toString() });
                      } else {
                          if (results.insertId > 0) {
                              const sql2 = 'SELECT * FROM tenders WHERE id = ?';
                              const values2 = [results.insertId];

                              pool.query(sql2, values2, (err, response) => {
                                  res.status(200).json({ status: true, data: response, message: 'Tender created successfully.' });
                              });
                          } else {
                              res.status(500).json({ status: false, data: {}, message: 'Failed to create tender.' });
                          }
                      }
                  });
              }
          });
  } catch (err) {
      res.status(500).json({ status: false, data: {}, message: 'An internal server error occurred.' });
  }
});


app.post('/tender/deleteTender', (req, res) => {
  try {
    const { id } = req.body;
    const sql = 'DELETE FROM tenders WHERE id = ?';
    const values = [id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });

      }
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

app.post('/tender/updateTender', (req, res) => {
  try {
    const { name,
      IPLNumber,
      openDate,
      pubLishDate,
      effectedBy,
      tenderImage,
      organization,
      newsPaper,
      category,
      city, id } = req.body

    const sql = 'UPDATE tenders SET name = ?, IPLNumber = ?,pubLishDate=?, tenderImage = ?,organization=?,newsPaper=?,category=?,city=?,openDate=?,effectedBy=? WHERE id = ?';
    const values = [name, IPLNumber,pubLishDate, tenderImage, organization, newsPaper, category, city, openDate, effectedBy, id];



    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });
  }
  catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.ERROR_MESSAGE + err });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const newFileName = req.body.file ? req.body.file : file.originalname;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

app.post('/tender/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // File uploaded successfully
    return res.status(200).json({ success: true, message: 'File uploaded successfully', filename: req.file.originalname });
  } catch (error) {
    console.error('Error occurred during file upload:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/Settings/', (req, res) => {
  try {
    pool.query('SELECT settings.*, users.name AS userName FROM settings INNER JOIN users ON settings.effectedBy = users.id', (err, results) => {
      return res.status(200).json({ status: true, data: results, message: MESSAGES.FOUND });
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.ERROR_MESSAGE });
  }
});
app.post('/Settings/', (req, res) => {
  const { phoneNumber, sliderMessage, effectedBy } = req.body;
  try {
    const sql = 'INSERT INTO settings (sliderMessage,phoneNumber, effectedBy,effectedDate) VALUES (?, ?,?,?)';
    const values = [sliderMessage, phoneNumber, effectedBy, new Date()];

    pool.query(sql, values, (error, results) => {
      if (error) {
        res.status(200).json({ status: false, data: {}, message: MESSAGES.FAILED_MESSAGE + error });
      } else {
        res.status(200).json({ status: true, data: results, message: MESSAGES.CREATED });
      }
    });

  }
  catch (err) {
    res.status(200).json({ status: false, data: {}, message: MESSAGES.FAILED_MESSAGE + err });
  }
});


app.post('/Settings/updateSetting', (req, res) => {
  try {
    const { phoneNumber, sliderMessage, effectedBy, id } = req.body;

    const sql = 'UPDATE settings SET sliderMessage = ?,phoneNumber=?, effectedBy = ?, effectedDate = ? WHERE id = ?';
    const values = [sliderMessage, phoneNumber, effectedBy, new Date(), id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });
  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});




const checkExistsFAQs = (data) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM faqs WHERE LOWER(question) = LOWER(?)';
    const values = [data.question.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};

app.post('/FAQs/', (req, res) => {
  const { question, answer, effectedBy } = req.body;

  try {

    checkExistsFAQs(req.body).then((exists) => {
      if (exists) {
        res.status(200).json({ status: false, data: {}, message: MESSAGES.ALREADY_EXISTS });
      }
      else {
        const sql = 'INSERT INTO faqs (question,answer, effectedBy,effectedDate) VALUES (?, ?,?,?)';
        const values = [question, answer, effectedBy, new Date()];

        pool.query(sql, values, (error, results) => {
          if (error) {
            res.status(200).json({ status: false, data: {}, message: MESSAGES.FAILED_MESSAGE });
          } else {
            res.status(200).json({ status: true, data: results, message: MESSAGES.CREATED });
          }
        });
      }
    });

  }
  catch (err) {
    res.status(200).json({ status: false, data: {}, message: MESSAGES.FAILED_MESSAGE });
  }


});

app.get('/FAQs/', (req, res) => {
  try {

    pool.query('SELECT faqs.*, users.name AS userName FROM faqs INNER JOIN users ON faqs.effectedBy = users.id', (err, results) => {
      return res.status(200).json({ status: true, data: results, message: MESSAGES.FOUND });

    });

  } catch (err) {
    res.status(200).json({ status: false, data: [], message: err.toString() });
  }

});

app.post('/FAQs/deleteFAQ', (req, res) => {
  try {
    const { id } = req.body;

    const sql = 'DELETE FROM faqs WHERE id = ?';
    const values = [id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });
      }
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});

app.post('/FAQs/updateFAQ', (req, res) => {
  try {
    const { question, answer, id, effectedBy } = req.body

    const sql = 'UPDATE faqs SET question = ?,answer=?, effectedBy = ?, effectedDate = ? WHERE id = ?';
    const values = [question, answer, effectedBy, new Date(), id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });


  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});





const checkExistsSubscriptions = (data) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM subscriptions WHERE LOWER(email) = LOWER(?)';
    const values = [data.email.toLowerCase()];

    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise in case of an error
      } else if (results.length > 0) {
        resolve(true); // Resolve with true if data exists
      } else {
        resolve(false); // Resolve with false if data does not exist
      }
    });
  });
};

app.post('/Subscriptions/', (req, res) => {
  const { userName, email, phoneNumber, company, billingPeriod, BillingAmount, categories, billingDate, effectedBy } = req.body;

  try {


    checkExistsSubscriptions(req.body).then((exists) => {
      if (exists) {
        res.status(200).json({ status: false, data: {}, message: MESSAGES.ALREADY_EXISTS });
      }
      else {
        const sql = 'INSERT INTO subscriptions (userName,email,phoneNumber,company,billingPeriod,BillingAmount,categories,billingDate, effectedBy,status ) VALUES (?,?,?,?,?,?,?,?,?,?)';
        const values = [userName, email, phoneNumber, company, billingPeriod, BillingAmount, categories, billingDate, effectedBy,false];

        pool.query(sql, values, (error, results) => {
          if (error) {
            res.status(200).json({ status: false, data: {}, message: MESSAGES.FAILED_MESSAGE });
          } else {
            res.status(200).json({ status: true, data: results, message: MESSAGES.CREATED });
          }
        });
      }
    });



  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});


app.post('/Subscriptions/updateSubscriptions', (req, res) => {
  try {
    const {id,userName, email, phoneNumber, company, billingPeriod, BillingAmount, categories, billingDate, effectedBy,status } = req.body

    const sql = 'UPDATE subscriptions SET userName = ?,email=?, phoneNumber = ?, company = ?,billingPeriod=?,BillingAmount=?,categories=?,billingDate=?,effectedBy=?,status=? WHERE id = ?';
    const values = [userName, email, phoneNumber, company, billingPeriod, BillingAmount, categories, billingDate, effectedBy,status, id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });


  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});


app.post('/Subscriptions/updateSubscriptionsStatus', (req, res) => {
  try {
    const {id,isActive } = req.body

    const sql = 'UPDATE subscriptions SET status = ? WHERE id = ?';
    const values = [isActive,id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.UPDATE });
      }
      else {
        res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });

      }

    });


  } catch (err) {
    return res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});


app.get('/Subscriptions/', (req, res) => {
  try {
    pool.query('SELECT *  FROM subscriptions', (err, results) => {
      return res.status(200).json({ status: true, data: results, message: MESSAGES.FOUND });
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.ERROR_MESSAGE });
  }
});

app.post('/Subscriptions/deleteSubscription', (req, res) => {
  try {
    const { id } = req.body;

    const sql = 'DELETE FROM subscriptions WHERE id = ?';
    const values = [id];

    pool.query(sql, values, (error, results) => {

      if (results.affectedRows > 0) {
        res.status(200).json({ status: true, data: results, message: MESSAGES.DELETE });
      }
      else {
        res.status(200).json({ status: false, data: results, message: MESSAGES.FAILED_MESSAGE });
      }
    });
  } catch (err) {
    res.status(200).json({ status: false, data: [], message: MESSAGES.FAILED_MESSAGE });
  }
});





//....................................................................................................instagram testing
const ACCESS_TOKEN = 'IGQWRNQWJmV2QzNjhuNEZAZAaklyeUdIeXo2SlZAQdmV5bHdzTEhPN1lQd0t6S2YwWVBqOGhZAbktwZAWJKOS0wNUhHekRMbUJ4UmxlLWY1aTZAZAa3RqNWdXcmhCN1hWSURwRHR4SGlLZAEtjelVtODB3bTFiejVQU3FLMUUZD'
const SubscribeEndPoint = 'https://graph.instagram.com/v12.0/me/subscribed_apps'
const MessagesEndPoint = 'https://graph.instagram.com/v12.0/me/messages'
const apiDomain = "graph.facebook.com"
const apiVersion = "v12.0"



const getUrl = () => {
  return `${apiDomain}/${apiVersion}/subscriptions`;
}

function generateVerifyToken(CLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < CLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}



app.get('/subscribe', async (req, res) => {
    try {
        const fields = "messages, messaging_postbacks, messaging_optins, " +
            "message_deliveries, messaging_referrals,user_profile,user_media,user_friends";
        const verifyToken = generateVerifyToken(32);

        const postData = JSON.stringify({
            access_token: ACCESS_TOKEN,
            object: "page",
            callback_url: `http://localhost/tender/mytender.online`,
            verify_token: verifyToken,
            fields: fields,
            include_values: "true"
        });

        const options = {
            hostname: apiDomain,
            path: `/${apiVersion}/subscriptions`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const request = http.request(options, (response) => {
            console.log(`statusCode: ${response.statusCode}`);
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {

  console.log('Response ended: ');
    
                res.status(200).json({ status: true, data: response.statusCode, message:"success"});
            });
        });

        request.on('error', (error) => {
            console.error(error);
            res.status(500).json({ status: false, data: error.toString(), message: "Failed to subscribe" });
        });

        request.write(postData);
        request.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, data: error.toString(), message: "Failed to subscribe" });
    }
});




app.get('/authorize', (req, res) => {
     const clientId = '1824324294708074';
    const redirectUri = 'http://localhost/tender/mytender.online/';
    const scope = 'user_profile,user_media,pages_manage_metadata,pages_messaging,pages_read_engagement,instagram_basic,instagram_manage_messages';
    const responseType = 'code';

    const authorizationUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
    res.redirect(authorizationUrl);

 });
 

app.get('/access_token', (req, res) => {
  const instagramAppSecret = 'be71226f4ec5678dc51ba63743af1752';
  const shortLivedAccessToken = 'AQDHVc4iiSev-tGxgAnVcyA7vWoBmrithBdhc6dHNHNDsGl_w_srXUZBeV_ozIYz1i3tl25iiMyRc4DKU83kQ03ywu-AsW85RWh_QT551iCakTgtl1A2meZNMmqTCZBXLXzrYkyzbCauaeOPGUcHfjx27pw-Xuk46NlgxrS15zVkVbUQ_AD0QvMGoV9v2OGhOEzitVSgp4S11gjXF5wRl1FmmqU4KgM5T4hSvaeXsfZ5MQ';

  const options = {
    hostname: 'graph.instagram.com',
    path: `/access_token?grant_type=ig_exchange_token&client_secret=${instagramAppSecret}&access_token=${shortLivedAccessToken}`,
    method: 'GET',
  headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          
        }
  };

  const call = http.request(options, (instagramResponse) => {
    let data = '';
  
    instagramResponse.on('data', (chunk) => {
      data += chunk;
    });
  
    instagramResponse.on('end', () => {
      res.status(200).json({ data: data,response:"success" });
    });
  });

  call.on('error', (error) => {
     res.status(500).json({ error: error.message });
  });
  
  call.end();
});

app.get('/cities', (req, res) => {
  try {
    pool.query('SELECT * FROM cities', (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, data: [], message: "Error fetching cities" });
      }
      res.status(200).json({ status: true, data: results, message: "Cities fetched successfully" });
    });
  } catch (err) {
    res.status(500).json({ status: false, data: [], message: err.toString() });
  }
});
 

app.post('/access_token', (req, res) => {
    const clientId = '320949927633718';
    const appSecret = 'be71226f4ec5678dc51ba63743af1752';
    const redirectUri = 'http://localhost/tender/mytender.online/';
    const code = 'AQDgCOV32BKMm5gGikbzXXvinTP-gbNV49YkBZyvHk5ZFo1jUy9Ua7faKHgoLvJSPw88GpaX8zxNeqqzv9PU2g9JhTMj5A6rfg2OBmyWxbrYMxKde5AdvgK5YbO5IO4dTTGDAWxXMKeLzjI-4FNCOXrv7pqHyXPBjswAkBqQPkPBjcMNAHdPqD5tmAMJdVPy9EPC0qESgSIBMOsCI5HM-9YXdfTcrnjznFuyBiWz6cb1Kg';

    const postData = new URLSearchParams({
        client_id: clientId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code: code
    }).toString();

    const options = {
        hostname: 'graph.instagram.com',
    path: '/oauth/access_token',
    method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

  const request = http.request(options, response => {
    let data = '';
 res.status(500).json({ data: response });
    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', () => {
        try {
            // Check if data is not empty
            if (data) {
            
                  res.status(500).json({ data: data });
            } else {
                throw new Error('Empty response data');
            }
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).json({ error: 'Failed to parse response data' });
        }
    });
    });
    
    request.on('error', error => {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Failed to fetch access token' });
    });
    
    request.write(postData);
    request.end();
});
 

const PORT = process.env.PORT || 5000; // Use the default port 5000 or the one set in the environment
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});