import express from "express";
import { globalRouter } from "./src/api/routes.js";

const app = express();
app.use(express.json());

app.use("/", globalRouter);

app.listen(3000, () => console.log("Running on port 3000"));