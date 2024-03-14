const express = require('express');
const app = express();
const session = require('express-session');
const connection = require('./config/db');
const path = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_here',
    resave: true,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    let sqlQuery = 'SELECT * FROM `doctor_list` WHERE role = "user"';
    connection.query(sqlQuery, (err, data) => {
        if (err) {
            throw err;
        }

        res.render("booking", { data: data });
    });
});

app.get("/dashboard", (req, res) => {
    if (!req.session.doctorId) {
        res.redirect("/login");
        return;
    }

    if (req.session.role !== 'admin') {
        res.redirect("/login");
        return;
    }

    let doctorsQuery = 'SELECT id, name,doctor_specalist,start_date,phone_number FROM `doctor_list` WHERE role = "user"';
    connection.query(doctorsQuery, (err, doctors) => {
        if (err) {
            throw err;
        }

        let doctorIds = doctors.map(doctor => doctor.id);
        let patientsCountQuery = `SELECT doctor_id, COUNT(*) as patient_count FROM patient_list WHERE doctor_id IN (${doctorIds.join(',')}) GROUP BY doctor_id`;

        connection.query(patientsCountQuery, (err, results) => {
            if (err) {
                throw err;
            }

            let doctorData = doctors.map(doctor => {
                let patientCount = results.find(result => result.doctor_id === doctor.id)?.patient_count || 0;
                return { ...doctor, patient_count: patientCount };
            });

            res.render("dashboard", { doctors: doctorData });
        });
    });
});


app.get("/login", (req, res) => {
    if (req.session.doctorId) {
        if (req.session.role === 'admin') {
            res.redirect("/dashboard");
        } else {
            res.redirect("/patient-details");
        }
    } else {
        res.render("login");
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    let loginQuery = 'SELECT id, name, role, password_hash FROM doctor_list WHERE username = ?';
    connection.query(loginQuery, [username], (err, result) => {
        if (err) {
            res.status(500).send("Error checking user");
            return;
        }
        if (result.length > 0) {
            const { id, name, role, password_hash } = result[0];
            if (password === password_hash) {
                req.session.doctorId = id;
                req.session.doctorname = name;
                req.session.role = role;

                if (role === 'admin') {
                    res.redirect("/dashboard");
                } else {
                    res.redirect("/patient-details");
                }
            } else {
                res.status(403).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});
app.get("/patient-details", (req, res) => {
    if (!req.session.doctorId) {
        res.redirect("/login");
        return;
    }

    if (req.session.role !== 'user') {
        res.redirect("/login");
        return;
    }

    const doctorId = req.session.doctorId;
    const doctorname = req.session.doctorname;

    let patientsQuery = `SELECT * FROM patient_list WHERE doctor_id = ${doctorId}`;
    connection.query(patientsQuery, (err, patients) => {
        if (err) {
            throw err;
        }
        res.render("allpatient", { patients: patients, doctorname: doctorname });
    });
});


app.post("/booking", (req, res) => {
    const { patientName, bookingDate, bookingTime, doctorName } = req.body;
    let INSERTQuery = 'INSERT INTO patient_list (patient_name, booking_date, booking_time, doctor_id) VALUES (?, ?, ?, ?)';
    connection.query(INSERTQuery, [patientName, bookingDate, bookingTime, doctorName], (err, result) => {
        if (err) {
            throw err;
        }
        console.log("Inserted patient");
        res.redirect("/");
    });
});

// logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to logout");
        }
        res.redirect("/login");
    })
});


// error handeling
app.use((req, res, next) => {
    res.render('error');
})

app.listen(8080, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Listening on http://localhost:8080`);
});
