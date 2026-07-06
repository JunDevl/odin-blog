import "dotenv/config";

import path from "path";
import cors from "cors";
import express, { Router } from "express";
import prisma from "../lib/prisma.ts";
import passport from "passport";
import Jwt from "passport-jwt";
import argon2 from "argon2";
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
passport.use(new Jwt.Strategy(
  {
    jwtFromRequest: Jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env["SECRET_KEY"]!
  },
  async (jwt_payload, done) => {
    const { email, password } = jwt_payload;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: undefined,
          email
        }
      });

      if (!user) return done(null, false, { message: "Incorrect email" });

      const validated = await argon2.verify(user.password, password);
      
      if (!validated) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch(err) {
      return done(err, false);
    }
}))

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