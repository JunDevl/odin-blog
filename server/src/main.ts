import "dotenv/config";

import path from "path";
import cors from "cors";
import express, { Router } from "express";
import prisma from "../lib/prisma.ts";
import passport from "passport";
import LocalStrategy from "passport-local";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
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

// TODO:
passport.use(new LocalStrategy.Strategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return done(null, false, { message: "Incorrect email" });

    const validated = await argon2.verify(user.password, password);
    
    if (!validated) return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  } catch(err) {
    return done(err);
  }
}))

// TODO:
passport.serializeUser((user, done) => {
  // done(null, (user as any).id);
});

// TODO:
passport.deserializeUser(async (id: string, done) => {
  // try {
  //   const user = await prisma.user.findUnique({
  //     where: { id }
  //   });

  //   app.locals.user = user;
  //   done(null, user);
  // } catch(err) {
  //   done(err);
  // }
});

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