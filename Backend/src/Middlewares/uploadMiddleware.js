// multerConfig.js
import multer from 'multer';

// Set up file filter
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel and CSV files are allowed'), false);
    }
};

// Configure multer middleware with in-memory storage
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: fileFilter,
});

// Export the upload middleware
export const uploadMiddleware = upload.single('file');
