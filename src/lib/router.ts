import express from "express";
import { resolve } from "path";
import { store } from "./api_store";

export const router = express.Router();

router.get("/hello", async (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

router.get("/static", (req, res) => {
  res.sendFile(resolve(__dirname, `./../${req.query.path}`));
});

router.get("/agents", (_, res) => {
  res.send(Object.fromEntries(store.agents));
});

router.get("/status", (_, res) => {
  res.send(store.status);
});

router.get("/data", (_, res) => {
  res.send({ ...store, agents: Object.fromEntries(store.agents) });
});
