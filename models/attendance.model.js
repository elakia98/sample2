const mongoose = require('mongoose')
const attendanceSchema = new mongoose.Schema({
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    totalLecturesByFaculty: {
        type: Number,
        default:0
    },
    lectureConducted: {
        type: Number,
        default:0
    }
});
module.exports = mongoose.model('Attendance',attendanceSchema);