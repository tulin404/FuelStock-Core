import multer from "multer";
import type { Request } from "express";

// BUFFER FOR THE PARSER
const storage = multer.memoryStorage();

// SECURITY
function fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback    
) {
    const isExcel = file.mimetype === "text/vnd.ms-excelv" || file.originalname.endsWith(".xls");

    if (!isExcel) {
        return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    };

    // ACCEPT FILE
    callback(null, true)

};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});