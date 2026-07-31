import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalRouter } from "./src/api/routes.js";
import { schedulersBootstrap } from "./src/schedulersBootstrap.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use("/", globalRouter);

async function bootstrap() {
    try {
        await schedulersBootstrap();

        app.listen(3000, () => {
            console.log("Running on port 3000");
        });
    } catch(error) {
        console.error("Erro ao iniciar aplicação", error);
        process.exit(1);
    }
};

bootstrap();