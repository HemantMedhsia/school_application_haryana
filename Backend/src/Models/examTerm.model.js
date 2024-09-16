import mongoose from "mongoose";

const examTermSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

export const ExamTerm = mongoose.model("ExamTerm", examTermSchema);
