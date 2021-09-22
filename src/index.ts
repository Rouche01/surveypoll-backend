import express from "express";
import { createServer } from "http";
import Websocket, { OPEN } from "ws";
import dotenv from "dotenv";
import { v4 } from "uuid";
import mongoose from "mongoose";
import { Response } from "./models/Response";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8080;

const wss = new Websocket.Server({ server });

const clients = new Map();

wss.on("connection", async (ws) => {
  console.log("A new client connected");
  const id = v4();
  const metadata = { id };
  clients.set(ws, metadata);
  const responses = await Response.find();
  ws.send(JSON.stringify(responses.reverse().slice(0, 100)));
  ws.on("message", async (data) => {
    const response = Response.build({
      response: data.toString(),
      createdDate: Date.now(),
    });
    await response.save();
    const uniqueClients = Array.from(clients.keys());
    uniqueClients.forEach(async (client) => {
      if (client.readyState === OPEN) {
        const responses = await Response.find();
        client.send(JSON.stringify(responses.reverse().slice(0, 100)));
      }
    });
  });
  ws.on("close", () => clients.delete(ws));
});

const startup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("mongodb connected");
  } catch (err) {
    console.log(err);
    console.log("unable to connect to mongodb");
  }
  server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
};

startup();
