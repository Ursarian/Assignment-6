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

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null;

function initialize() {
    console.log("Initializing college data...")
    return new Promise((resolve, reject) => {
        let studentDataFromFile;
        let courseDataFromFile;

        fs.readFile("./data/students.json", "utf8", function (error, data) {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }

            studentDataFromFile = data ? JSON.parse(data) : "";

            fs.readFile("./data/courses.json", "utf8", function (error, data) {
                if (error) {
                    console.log(error);
                    reject(error);
                    return;
                }

                courseDataFromFile = data ? JSON.parse(data) : "";

                dataCollection = new Data(studentDataFromFile, courseDataFromFile);
                resolve("Initialization successful!");
            })
        })
    });
}

function getAllStudent() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("No results returned");
        }
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