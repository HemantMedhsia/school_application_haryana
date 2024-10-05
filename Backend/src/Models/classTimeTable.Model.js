import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema({
    period: {
        type: String,
        required: true,
        trim: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
});

const timetableSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    dayOfWeek: {
        type: String,
        required: true,
    },
    entries: [timetableEntrySchema],
});

timetableSchema.pre("save", async function (next) {
    try {
        for (const entry of this.entries) {
            const existingTimetable = await mongoose
                .model("Timetable")
                .findOne({
                    dayOfWeek: this.dayOfWeek,
                    "entries.period": entry.period,
                    "entries.teacherId": entry.teacherId,
                });

            if (existingTimetable) {
                throw new Error(
                    `Teacher is already assigned to another class at period ${entry.period} on ${this.dayOfWeek}.`
                );
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const Timetable = mongoose.model("Timetable", timetableSchema);
