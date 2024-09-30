import mongoose from "mongoose";

const calculateGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
};

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    marks: [
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: true,
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher",
                // required: true,
            },
            exams: [
                {
                    examType: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "ExamType",
                        required: true,
                    },
                    marksObtained: {
                        type: Number,
                        required: true,
                    },
                },
            ],

            subjectTotalMarks: {
                type: Number,
            },
            subjectGrade: {
                type: String,
            },
        },
    ],
    totalMarkObtained: {
        type: Number,
        default: 0,
    },
    totalMarkPossible: {
        type: Number,
        default: 0,
    },
    percentage: {
        type: Number,
        default: 0,
    },
    finalGrade: {
        type: String,
        default: "F",
    },
    rank: {
        type: Number,
    },
});

marksSchema.pre("save", function (next) {
    let totalMarksObtained = 0;
    let totalMarksPossible = 0;

    this.marks.forEach((subject) => {
        let subjectTotal = 0;
        let subjectMaxTotal = 0;

        subject.exams.forEach((exam) => {
            subjectTotal += exam.marksObtained;
            if (exam.examType && exam.examType.maxMarks) {
                subjectMaxTotal += exam.examType.maxMarks;
            }
        });

        subject.subjectGrade = calculateGrade(subjectTotal);
        subject.subjectTotalMarks = subjectTotal;

        totalMarksObtained += subjectTotal;
        totalMarksPossible += subjectMaxTotal;
    });

    this.totalMarkObtained = totalMarksObtained;
    this.totalMarkPossible = totalMarksPossible;
    this.percentage = totalMarksPossible
        ? ((totalMarksObtained / totalMarksPossible) * 100).toFixed(2)
        : 0;
    this.finalGrade = calculateGrade(this.percentage);

    next();
});

marksSchema.statics.calculateRank = async function (classId, termId) {
    const allMarks = await this.find({ class: classId, term: termId }).sort({
        totalMarkObtained: -1,
    });

    let rank = 1;
    for (const mark of allMarks) {
        mark.rank = rank++;
        await mark.save();
    }
};




export const Marks = mongoose.model("Marks", marksSchema);
