export const getApiConfig = {
    getAllSchools: {
        url: "/get-schools",
        method: "GET"
    },
    getSingleSchool: {
        url: "/get-single-school",
        method: "GET"
    },
    loginTeacher: {
        url: "/login-teacher",
        method: "GET"
    },
    getAllTeachers: {
        url: "/get-all-teachers", // Corrected URL to start with '/'
        method: "GET"
    },
    getAllSubjects: {
        url: "/all-subject",
        method: "GET"
    },
    getAllClasses: {    
        url: "/all-class",
        method: "GET"
    },
    getAllSections: {
        url: "/get-all-sections",
        method: "GET"
    },
    getAllSessions: {
        url: "/get-all-sessions",
        method: "GET"
    },
    getAllStudents: {
        url: "/get-all-students",
        method: "GET"
    },
    getAllParents: {
        url: "/get-all-parents",
        method: "GET"
    },
    addStudent: {
        url: "/create-student/:schoolId", 
        method: "POST"
    },
};