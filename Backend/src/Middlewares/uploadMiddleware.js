import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the uploads directory path
const uploadDir = path.join(__dirname, 'uploads');

// Check if the uploads directory exists, create it if not
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
        );
    },
});

// Set up file filter
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'text/csv' ||
        file.mimetype === 'application/vnd.ms-excel'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

// Configure multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter,
});

// Export the upload middleware
export const uploadMiddleware = upload.single('file');
