import fs from "fs/promises";
import path from "path";
import crypto from "crypto";


export default async function saveFile(file: Express.Multer.File) {
    const fileId = crypto.randomUUID();
    const extension = path.extname(file.originalname);

    const fileName = `${fileId}${extension}`; 

    const uploadDir = path.resolve("uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return filePath;
};