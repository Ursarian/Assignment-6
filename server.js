/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Huy Manh Le (Thomas Le)_ Student ID: hle37________ Date: 2024/07/25______
*
* Online (Heroku) Link: https://web700-assignment-6-hle37-352e9627ceef.herokuapp.com/
*
*********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();

// PATHS
const path = require('path');
const collegeData = require("./modules/collegeData.js");

// MIDDLEWARES
// app.use(express.static(__dirname))
app.use(express.static("./public/"));
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// WEEK 8: MULTER

const multer = require("multer");

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./public/photos/",
    filename: function (req, file, cb) {
        // we write the filename as the current date down to the millisecond
        // in a large web service this would possibly cause a problem if two people
        // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
        // this is a simple example.
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// WEEK 9: HANDLEBARS

const exphbs = require("express-handlebars");
const { col } = require("sequelize");

// Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine(
    {
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
            navLink: function (url, options) {
                return '<li' +
                    ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            },
            helper1: function (options) {
                // helper without "context", ie {{#helper}} ... {{/helper}}
            },
            helper2: function (context, options) {
                // helper with "context", ie {{#helper context}} ... {{/helper}}
            }
        }
    },
));
app.set("view engine", ".hbs");

// WEEK 11: PostgreSQL

// const Sequelize = require("sequelize");

// var sequelize = new Sequelize("week11", "week11_owner", "RSn2ycDZQVz5", {
//     host: "ep-yellow-dust-a5ds0cz8-pooler.us-east-2.aws.neon.tech",
//     dialect: "postgres",
//     port: 5432,
//     dialectOptions: {
//         ssl: { rejectUnauthorized: false }
//     },
//     query: { raw: true }
// });

// sequelize.authenticate()
//     .then(function () {
//         console.log("Connection has been established successfully.");
//     })
//     .catch(function (err) {
//         console.log("Unable to connect to the database: ", err);
//     })

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////EXAMPLES//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// WEEK 8 EXAMPLES: FORM

app.get("/registerUser", function (req, res) {
    res.render('registerUser');
});

app.post("/register-user", upload.single("photo"), (req, res) => {
    const formData = req.body;
    const formFile = req.file;

    const dataReceived = "Your submission was received:<br/><br/>" +
        "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" +
        "Your File data was:<br/>" + JSON.stringify(formFile) +
        "<br/><p>This is the image you sent:<br/><img src='/photos/" + formFile.filename + "'/>";
    res.send(dataReceived);
});

// WEEK 9 EXAMPLES: HANDLEBARS

app.get("/viewData", function (req, res) {

    var someData = [{
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank",
        visible: true
    },
    {
        name: "Sarah",
        age: 32,
        occupation: "manager",
        company: "TD",
        visible: false
    }];

    res.render('viewData', {
        data: someData
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////ROUTING///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// GET Home
app.get("/", (req, res) => {
    res.render('home');
});

// GET About
app.get("/about", (req, res) => {
    res.render('about');
});

// GET Demo
app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

// GET Students
app.get("/students", (req, res) => {
    course = req.query.course;

    if (course) {
        collegeData.getStudentByCourse(course).then(result => {
            if (result.length != 0) {
                res.render('students', {
                    header: "Students In Course " + course,
                    students: result
                });
            } else {
                res.render('students', {
                    header: "Students In Course " + course,
                    message: "no results"
                });
            }
        }).catch(error => res.render('students', {
            header: "Students In Course " + course,
            message: "no results"
        }));
    } else {
        collegeData.getAllStudent().then(result => {
            if (result.length != 0) {
                res.render('students', {
                    header: "Students",
                    students: result
                });
            } else {
                res.render('students', {
                    header: "Students",
                    message: "no results"
                });
            }
        }).catch(error => res.render('students', {
            header: "Students",
            message: "no results"
        }));
    }
});

// GET Student by Number
app.get("/student/:num", (req, res) => {
    num = req.params.num;

    collegeData.getStudentByNum(num).then(students => {
        collegeData.getCourses()
            .then((courses) => {
                for (let i = 0; i < courses.length; i++) {
                    courses[i].selected = students[0].course === courses[i].courseId ? true : false
                }
                res.render('student', {
                    student: students[0],
                    courses: courses
                });
            })
            .catch((result) => {
                res.status((404)).render('student', {
                    student: result[0],
                    courses: []
                });
            });
    }).catch(error => res.render('student', {
        header: "Student No " + num,
        message: "no results"
    }));
});

// GET Student Add
app.get("/students/add", (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.render('addStudent', { courses: courses });
        })
        .catch((result) => {
            res.render('addStudent', { courses: [] });
        })
});

// POST Student Add
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body).then(result => sendResponse(res, "Success!", result)).catch(error => sendResponse(res, "Error!", error));
});

// POST Student Update
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then((result) => res.redirect("/students"))
});

// GET Student Delete
app.get("/students/delete/:studentNum", (req, res) => {
    studentNum = req.params.studentNum;
    collegeData.deleteStudentByNum(studentNum)
        .then((result) => res.redirect("/students"))
        .catch((result) => res.status(500).sendResponse(res, "Error!", "Unable to Remove Student / Student not found"));
})

// GET Courses
app.get("/courses", (req, res) => {
    collegeData.getCourses().then(result => {
        if (result.length != 0) {
            res.render('courses', {
                header: "Courses",
                courses: result
            });
        } else {
            res.render('courses', {
                header: "Courses",
                message: "no results"
            });
        }
    }).catch(error => res.render('courses', {
        header: "Courses",
        message: "no results"
    }));
});

// GET Course by ID
app.get("/course/:id", (req, res) => {
    id = req.params.id;

    collegeData.getCourseByID(id).then((result) => {
        res.render('course', { course: result[0] });
    }).catch(error => res.status(404).render('course', {
        header: "Course ID " + id,
        message: "Course Not Found"
    }));
});

// GET Course Add
app.get("/courses/add", (req, res) => {
    res.render('addCourse');
});

// POST Course Add
app.post("/courses/add", (req, res) => {
    collegeData.addCourse(req.body).then(result => sendResponse(res, "Success!", result)).catch(error => sendResponse(res, "Error!", error));
});

// POST Course Update
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then((result) => res.redirect("/students"))
});

// GET Course Delete
app.get("/courses/delete/:id", (req, res) => {
    id = req.params.id;
    collegeData.deleteCourseById(id)
        .then((result) => res.redirect("/courses"))
        .catch((result) => res.status(500).sendResponse(res, "Error!", "Unable to Remove Course / Course not found"));
})

// Catch Error
app.use((req, res) => {
    res.status(404).render('response', {
        header: "Error",
        message: "Page Not THERE, Are you sure of the path?"
    });
});

// Send Response
function sendResponse(res, header, message, code) {
    res.render('response', {
        header: header,
        message: message,
        code: code
    });
}

// Setup HTTP Server to Listen on HTTP_PORT
collegeData.initialize()
    .then((result) => {
        console.log(result);
        app.listen(HTTP_PORT, () => console.log("server listening on port: " + HTTP_PORT));
    })
    .catch(error => console.log(error));