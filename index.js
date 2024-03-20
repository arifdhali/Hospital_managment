const express = require('express');
const app = express();
const session = require('express-session');
const connection = require('./config/db');
const path = require('path');
const multer = require('multer');



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_here',
    resave: true,
    saveUninitialized: true
}));

// For handeling the image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subtype = file.mimetype.split("/");
        if (subtype[0] === "image") {
            return cb(null, "public/uploads/images");
        } else if (file.mimetype === 'application/pdf') {
            return cb(null, "public/uploads/pdf");
        } else {
            return cb(null, "public/uploads/others");
        }
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}-${new Date().getTime()}-${file.originalname}`);
    }

})
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    let sqlQuery = 'SELECT * FROM `doctor_list` WHERE role = "user"';
    connection.query(sqlQuery, (err, data) => {
        if (err) {
            throw err;
        }

        res.render("booking", { data: data });
    });
});

const isAuthenticated = (req, res, next) => {
    if (!req.session.doctorId) {
        res.redirect("/login");
        return;
    }
    next();
};
;
app.get("/dashboard", isAuthenticated, (req, res) => {

    if (req.session.role !== 'admin') {
        res.redirect("/login");
        return;
    }

    let doctorsQuery = 'SELECT id, name,doctor_specalist,start_date,phone_number,user_img FROM `doctor_list` WHERE role = "user"';
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
            res.render("dashboard", { doctors: doctorData, doctorname: req.session.doctorname });
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
app.get("/patient-details", isAuthenticated, (req, res) => {

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
        res.redirect("/");
    });
});

// logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to logout");
        }
        res.redirect("/login");
    })
});




// add-doctor
app.get("/add-doctor", isAuthenticated, (req, res) => {
    res.render("add-doctor");
});

app.post("/add-doctor", upload.single('user_image'), (req, res, next) => {
    let imagePath = req.file.filename;
    const { name, username, pasword, category, start_date, phone, address } = req.body;
    let addQuery = 'INSERT INTO doctor_list (name,username,password_hash,doctor_specalist,start_date,phone_number,user_img,address) VALUES (?,?,?,?,?,?,?,?)';
    connection.query(addQuery, [name, username, pasword, category, start_date, phone, imagePath, address], (err, result) => {
        if (err) throw err;
    })
    res.redirect("/dashboard");
});





// Profile
app.get("/profile", isAuthenticated, (req, res) => {
    const doctorId = req.session.doctorId;
    let profileQuery = 'SELECT * from  doctor_list where id = ?';

    connection.query(profileQuery, [doctorId], (err, result) => {
        if (err) throw err;
        console.log(result[0]);
        res.render('profile', { userInfo: result[0] });

    })
})

// update profile 
app.post("/update-profile", (req, res) => {

    const { hiddenId, username, name, password, phone, img } = req.body;
    const updateProfileQuery = 'UPDATE doctor_list SET username = ?, name = ?, password_hash = ?, phone_number = ?, user_img = ? WHERE id = ?';

    connection.query(updateProfileQuery, [username, name, password, phone, img, hiddenId], (err, result) => {
        if (err) {
            console.error("Error updating profile:", err);
            res.status(500).send("Error updating profile");
            return;
        }

        res.redirect("/dashboard");
    });
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
