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

const fs = require("fs");

// Postgres

const database = 'das6jvgcofc4ik'
const user = 'u41hilfqdgroap'
const password = 'p367117519e97658f8828bee15b2b428d9603df497117f59196cfbd362c68eba4'
const host = 'c5hilnj7pn10vb.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com'

const Sequelize = require('sequelize');
var sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Models

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

// Functions

function initialize() {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then((result) => resolve("The operation was a success"))
            .catch((result) => reject("Unable to sync the database"));
    });
}

function getAllStudent() {
    return getStudentByFilter();
}

function getStudentByFilter(filter) {
    return new Promise((resolve, reject) => {
        Student.findAll(filter)
            .then((result) => resolve(result))
            .catch((result) => reject("No results returned"));
    });
}

function getStudentByNum(studentNum) {
    return getStudentByFilter({
        where: {
            studentNum: studentNum
        }
    })
}

function getStudentByCourse(course) {
    return getStudentByFilter({
        where: {
            course: course
        }
    })
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA ? true : false

        for (field in studentData) {
            if (field.length == 0)
                field = null
        }

        Student.create(studentData)
            .then((result) => resolve("Student has been added!"))
            .catch((result) => reject("Failed to add student"));
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA ? true : false

        for (field in studentData) {
            if (field.length == 0)
                field = null
        }

        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then((result) => resolve("Student has been updated!"))
            .catch((result) => reject("Failed to update student"));
    });
}

function deleteStudentByNum(studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({ where: { studentNum: studentNum } })
            .then((result) => resolve("Student has been deleted!"))
            .catch((result) => reject("Failed to delete student"));
    });
}

function getCourses() {
    return getCourseByFilter()
}

function getCourseByFilter(filter) {
    return new Promise((resolve, reject) => {
        Course.findAll(filter)
            .then((result) => resolve(result))
            .catch((result) => reject("No results returned"));
    });
}

function getCourseByID(courseId) {
    return getCourseByFilter({
        where: {
            courseId: courseId
        }
    })
}

function addCourse(courseData) {
    return new Promise((resolve, reject) => {
        for (field in courseData) {
            if (field.length == 0)
                field = null
        }

        Course.create(courseData)
            .then((result) => resolve("Course has been added!"))
            .catch((result) => reject("Failed to add course"));
    });
}

function updateCourse(courseData) {
    return new Promise((resolve, reject) => {
        for (field in courseData) {
            if (field.length == 0)
                field = null
        }

        Course.update(courseData, { where: { courseId: courseData.courseId } })
            .then((result) => resolve("Course has been updated!"))
            .catch((result) => reject("Failed to update course"));
    });
}

function deleteCourseById(courseId) {
    return new Promise((resolve, reject) => {
        Course.destroy({ where: { courseId: courseId } })
            .then((result) => resolve("Course has been deleted!"))
            .catch((result) => reject("Failed to delete course"));
    });
}

module.exports = {
    initialize,
    getAllStudent,
    getStudentByNum,
    getStudentByCourse,
    addStudent,
    updateStudent,
    deleteStudentByNum,
    getCourses,
    getCourseByID,
    addCourse,
    updateCourse,
    deleteCourseById
};