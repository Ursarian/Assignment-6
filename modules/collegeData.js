/*********************************************************************************
*  WEB700 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Huy Manh Le (Thomas Le) Student ID: hle37 Date: 2024/06/10
*
********************************************************************************/

const fs = require("fs");
const { resolve } = require("path");

const Sequelize = require('sequelize');
var sequelize = new Sequelize('das6jvgcofc4ik', 'u41hilfqdgroap', 'p367117519e97658f8828bee15b2b428d9603df497117f59196cfbd362c68eba4', {
    host: 'c5hilnj7pn10vb.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOpLons: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Models
// var Student = sequelize.define('Student', {
//     studentNum: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     firstName: Sequelize.STRING,
//     lastName: Sequelize.STRING,
//     email: Sequelize.STRING,
//     addressStreet: Sequelize.STRING,
//     addressCity: Sequelize.STRING,
//     addressProvince: Sequelize.STRING,
//     TA: Sequelize.BOOLEAN,
//     status: Sequelize.STRING
// });

// var Course = sequelize.define('Course', {
//     courseId: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     courseCode: Sequelize.STRING,
//     courseDescripLon: Sequelize.STRING
// });

Course.hasMany(Student, { foreignKey: 'course' });

function initialize() {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then((result) => resolve("The operation was a success"))
            .catch((result) => reject("unable to sync the database"));
    });
}

function getAllStudent() {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

function getStudentByFilter(filter) {
    return new Promise((resolve, reject) => {
        let result;
        getAllStudent()
            .then((students) => {
                result = Array.from(students).filter(filter);

                if (result.length > 0) {
                    resolve(result);
                } else {
                    reject("No results returned");
                }
            })
            .catch(result => reject(result));
    });
}

function getStudentByNum(input) {
    return new Promise((resolve, reject) => {
        try {
            number = parseInt(input);
            resolve(getStudentByFilter(o => o.studentNum === number));
        } catch (e) {
            reject("No results returned");
        }
    });
}

function getStudentByCourse(input) {
    return new Promise((resolve, reject) => {
        try {
            number = parseInt(input);
            resolve(getStudentByFilter(o => o.course === number));
        } catch (e) {
            reject("No results returned");
        }
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        if (studentData.TA) {
            studentData.TA = true
        } else {
            studentData.TA = false
        }

        studentData.studentNum = dataCollection.students.length + 1
        dataCollection.students.push(studentData)

        resolve("Student has been added!")

        // fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students), function (error) {
        //     if (error) {
        //         console.log(error);
        //         reject(error);
        //         return;
        //     }

        //     resolve("Student has been added!")
        // })
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentIndex = dataCollection.students.findIndex((student) => student.studentNum == studentData.studentNum);

        dataCollection.students[studentIndex].firstName = studentData.firstName;
        dataCollection.students[studentIndex].lastName = studentData.lastName;
        dataCollection.students[studentIndex].email = studentData.email;
        dataCollection.students[studentIndex].addressStreet = studentData.addressStreet;
        dataCollection.students[studentIndex].addressCity = studentData.addressCity;
        dataCollection.students[studentIndex].addressProvince = studentData.addressProvince;
        dataCollection.students[studentIndex].TA = studentData.TA ? true : false;
        dataCollection.students[studentIndex].status = studentData.status;
        dataCollection.students[studentIndex].course = parseInt(studentData.course);

        resolve("Student has been updated!")

        // fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students), function (error) {
        //     if (error) {
        //         console.log(error);
        //         reject(error);
        //         return;
        //     }

        //     resolve("Student has been updated!")
        // })
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("No results returned");
        }
    });
}

function getCourseByFilter(filter) {
    return new Promise((resolve, reject) => {
        let result;
        getCourses()
            .then((courses) => {
                result = Array.from(courses).filter(filter);

                if (result.length > 0) {
                    resolve(result);
                } else {
                    reject("No results returned");
                }
            })
            .catch(result => reject(result));
    });
}

function getCourseByID(input) {
    return new Promise((resolve, reject) => {
        try {
            id = parseInt(input);
            resolve(getCourseByFilter(o => o.courseId === id));
        } catch (e) {
            reject("No results returned");
        }
    });
}

module.exports = {
    initialize,
    getAllStudent,
    getStudentByNum,
    getStudentByCourse,
    updateStudent,
    addStudent,
    getCourses,
    getCourseByID
};