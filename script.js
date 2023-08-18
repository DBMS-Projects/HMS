var con = require("./connections");
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Establishing the server connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening to port ${PORT}..'));

//Router to INSERT/POST a appointment detail
app.post('/appointment', (req, res) => {
  try {
    const name = req.body.name;
    const gender = req.body.gender;
    const number = req.body.number;
    const id = req.body.id;
    //  inserting into patient database
    con.query('INSERT INTO patient(Name,gender,phone_number) VALUES(?,?,?)', [name, gender, number], (err, rows) => {
      if (err) {
        console.log(err);
      }
      else {

        // TO GET AVAILABILITY STATUS FROM SHCEDULE DATABASE

        con.query('SELECT Availbility from Schedule WHERE Doctors_id = ?', [id], function (err, result, fields) {
          if (err) {
            console.log(err);
          }
          else {
            // IF the doctor is available then we are gonna insert into appointment table and if the doctors_id has 3 rows then we are gonna change schedule database availability as false
            if (result[0].Availbility == true) {
              // First of all getting patient id for inserting into appointment table
              con.query('Select Patient_id from patient WHERE phone_number =?', [number], function (err, result, fields) {
                if (err) {
                  console.log(err);
                }
                else {
                  const patient_id = result[0].Patient_id;
                  // inserting into appointment database
                  con.query('INSERT INTO appointment(Patient_id,Doctor_id) VALUES(?,?)', [patient_id, id], (err, rows) => {
                    if (err) {
                      console.log(err);
                    }
                    else {
                      res.send("YOUR APPOINTMENT IS SUCCESFUL");
                      // NOW GETTING THE NUMBER OF ROWS FROM THE APPOINTED DOCTOR
                      con.query('SELECT COUNT(Doctor_id) as Number FROM appointment WHERE Doctor_id =?', [id], function (err, result, fields) {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          const count = result[0].Number;
                          // IF COUNT IS EQUAL TO 3 then WE ARE GOING TO CHANGE AVAILABILITY AS FALSE
                          if (count >= 3) {
                            con.query('UPDATE schedule SET Availbility = FALSE WHERE Doctors_id = ?', [id], (err, rows) => {
                              if (err) {
                                console.log(err);
                              }
                            })
                          }
                        }
                      })
                    }
                  })
                }
              });

            }
            // IF THE DOCTOR IS NOT AVAILABLE THEN WE ARE GONNA SHOW THIS
            else {
              res.send("Sorry!,The doctor is already booked for today");
            }
          }
        });
      }
    });

  }
  catch (err) {
    console.log(err);
  }

});
