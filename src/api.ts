import express, { Express, Request, Response } from "express";
import cors from "cors";
import UserModel from "./models/userModel";
import { connectDB, disconnectDB } from "./db";
import ChannelModel from "./models/channelModel";
import MessageModel from "./models/messageModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createServer } from "node:http";
import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { table } from "node:console";

// Create an Express application
const app: Express = express();
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
// Use CORS middleware
app.use(cors());

// Use JSON middleware to parse JSON bodies
app.use(express.json());

// Define the port
const port = 3000;

connectDB().then(() => console.log("Connected to MongoDB Atlas"));

const server = new Server(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('chat message', async (msg) => {
        console.log('Received message:', msg);
        io.emit('chat message', msg);

        try {
            const messageData = {
                Contenu: msg.Contenu,
                id_User: new mongoose.Types.ObjectId(msg.idUser),
                id_Channel:new mongoose.Types.ObjectId(msg.idChannel),
            };
            const message = await MessageModel.create(messageData);
            console.log('Message stored:', message);
        } catch (error) {
            console.error('Error storing message:', error);
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket: Socket) => {

  socket.on('notification', (msg) => {
    // Emit a 'notification' event to all other clients
    socket.broadcast.emit('notification',msg );
  });
});

app.get('/Message/:idChannel', async (req: Request, res: Response) => {
const { idChannel } = req.params;
try {
    const messages = await MessageModel.find({ id_Channel: idChannel });
    if (messages) {
    res.json({ message: 'Data found', data: messages });
    } else {
    res.status(404).json({ message: 'No data found' });
    }
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
}
});


app.get("/get/:table/:name", async (req: Request, res: Response) => {
  const { table, name } = req.params;

  try {
    await connectDB();

    let result;
    switch (table) {
      case "User":
        result = await UserModel.findOne({ Login: name });
        break;
      case "Channel":
        result = await ChannelModel.findOne({ Name: name });
        break;
      case "Message":
        result = await MessageModel.findOne({ _id: name });
        break;
      // Add cases for other tables here...
      default:
        res.status(400).json({ message: "Invalid table" });
        return;
    }

    if (result && result !== null) {
      res.json({ message: "Data found", data: result });
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getUser/:id_User", async (req: Request, res: Response) => {
  const { id_User } = req.params;

  try {
    await connectDB();

    let result;
    result = await UserModel.findOne({ _id: id_User });

    if (result && result !== null) {
      res.json({ message: "Data found", data: result });
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getAll/:table/:id_user", async (req: Request, res: Response) => {
  const { table, id_user } = req.params;

  try {
    await connectDB();

    let result;
    switch (table) {
      case "Channel":
        result = await ChannelModel.find({ id_user: id_user });
        break;
      case "Message":
        result = await MessageModel.find({ id_Channel: id_user });
        break;
      default:
        res.status(400).json({ message: "Invalid table" });
        return;
    }

    if (result && result.length > 0) {
      res.json({ message: "Data found", data: result });
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get the Channel by the id_Channel
app.get("/getChannel/:id_Channel", async (req: Request, res: Response) => {
  const { id_Channel } = req.params;

  try {
    await connectDB();

    let result;
    result = await ChannelModel.findOne({ _id: id_Channel });

    if (result && result !== null) {
      res.json({ message: "Data found", data: result });
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get(
  "/getLatestMessage/:id_Channel",
  async (req: Request, res: Response) => {
    const { id_Channel } = req.params;

    try {
      await connectDB();

      let result;
      result = await MessageModel.find({ id_Channel: id_Channel })
        .sort({ Logs: -1 })
        .limit(1);

      if (result && result.length > 0) {
        res.json({ message: "Data found", data: result });
      } else {
        res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.post("/login", async (req: Request, res: Response) => {
  const { Login, Password } = req.body;

  

  try {
    await connectDB();
    const user = await UserModel.findOne({ Login: Login });
    if (user && Password && (await bcrypt.compare(Password, user.Password))) {
      // User found and password is correct, generate a token
      //récupérer heure et date
      const date = new Date().toLocaleTimeString();
      const token = jwt.sign(
        { id: user._id, name: user.Name, login: user.Login, date : date },
        secret,
        { expiresIn: "1h" }
      );
      res.json({ message: "Login successful", user: user, token: token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await disconnectDB();
  }
});

app.post("/create/:table", async (req: Request, res: Response) => {
  const { table } = req.params;
  const data = req.body;

  try {
    await connectDB();

    let result;
    switch (table) {
      case "User":
        const existingUser = await UserModel.findOne({ Login: data.Login });
        if (existingUser) {
          res.status(400).json({ message: "Login already taken" });
          return;
        }
        if (data.Password) {
          data.Password = await bcrypt.hash(data.Password, 10);
        }
        result = await UserModel.create(data);
        break;
      case "Channel":
        result = await ChannelModel.create(data);
        break;
      case "Message":
        result = await MessageModel.create(data);
        break;
      default:
        res.status(400).json({ message: "Invalid table" });
        return;
    }

    if (result && result !== null) {
      res.json({ message: "Data created", data: result });
    } else {
      res.status(400).json({ message: "Data could not be created" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await disconnectDB();
  }
});

app.put("/update/:table/:id", async (req: Request, res: Response) => {
  const { table, id } = req.params;
  const data = req.body;

  try {
    await connectDB();

    let result;
    switch (table) {
      case "User":
        if (data.Password) {
          data.Password = await bcrypt.hash(data.Password, 10);
        }
        result = await UserModel.findByIdAndUpdate(id, data, { new: true });
        break;
      case "Channel":
        result = await ChannelModel.findByIdAndUpdate(id, data, { new: true });
        break;
      case "Message":
        result = await MessageModel.findById(id);
        if (result) {
          if (data.Contenu) {
            result.Contenu = data.Contenu;
            result.Logs = new Date().toLocaleTimeString();
          }
          await result.save();
        }
        break;
      default:
        res.status(400).json({ message: "Invalid table" });
        return;
    }

    if (result && result !== null) {
      res.json({ message: "Data updated", data: result });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await disconnectDB();
  }
});

app.delete("/delete/:table/:id", async (req: Request, res: Response) => {
  const { table, id } = req.params;

  try {
    await connectDB();

    let result;
    switch (table) {
      case "User":
        result = await UserModel.findByIdAndDelete(id);
        break;
      case "Channel":
        result = await ChannelModel.findByIdAndDelete(id);
        break;
      case "Message":
        result = await MessageModel.findByIdAndDelete(id);
        break;
      default:
        res.status(400).json({ message: "Invalid table" });
        return;
    }

    if (result && result !== null) {
      res.json({ message: "Data deleted", data: result });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await disconnectDB();
  }
});

app.get("/getAll/:table", async (req: Request, res: Response) => {
  const { table } = req.params;

  try {
    await connectDB();

    let result;
    switch (table) {
      case "Channel":
        result = await ChannelModel.find();
        break;
      case "Message":
        result = await MessageModel.find();
        break;
      case "User":
        result = await UserModel.find();
        break;
      default:
        res.status(400).json({ message: "Invalid table" });
        return;
    }

    if (result && result.length > 0) {
      res.json({ message: "Data found", result });
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default app;
