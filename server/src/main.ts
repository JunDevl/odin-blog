import "dotenv/config";

import path from "path";

import cors from "cors";
import express, { Router } from "express";

import passport from "passport";
import { localStrategy } from "./auth.ts";
import { JWTStrategy } from "./auth.ts";

import usersRouter from "./routes/usersRouter.ts";
import postsRouter from "./routes/postsRouter.ts";

const __dirname = path.resolve();
const PORT = process.env["PORT"]!;

const apiRouter = Router();

const app = express();

app.use(cors({
  origin: "*", ///^https:\/\/odin-inventory-client.*$/,
  // credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(localStrategy);

passport.use(JWTStrategy);

app.use("/api", apiRouter);

apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);

app.use((err: any, _: any, res: any, __: any) => {
  console.error(err.stack);
  res.send(err.message);
})

app.listen(PORT, err => 
  err ? console.log(err) : 
  console.log(`Listening on port ${PORT}\n`)
);