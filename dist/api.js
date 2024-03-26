"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userModel_1 = __importDefault(require("./models/userModel"));
const db_1 = require("./db");
const channelModel_1 = __importDefault(require("./models/channelModel"));
const messageModel_1 = __importDefault(require("./models/messageModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_path_1 = require("node:path");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Create an Express application
const app = (0, express_1.default)();
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
// Use CORS middleware
app.use((0, cors_1.default)());
// Use JSON middleware to parse JSON bodies
app.use(express_1.default.json());
// Define the port
const port = 3000;
(0, db_1.connectDB)().then(() => console.log("Connected to MongoDB Atlas"));
const server = new http_1.Server(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
app.get("/", (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, "index.html"));
});
// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received message:', msg);
        io.emit('chat message', msg);
        try {
            const messageData = {
                Contenu: msg.Contenu,
                id_User: new mongoose_1.default.Types.ObjectId(msg.idUser),
                id_Channel: new mongoose_1.default.Types.ObjectId(msg.idChannel),
            };
            const message = yield messageModel_1.default.create(messageData);
            console.log('Message stored:', message);
        }
        catch (error) {
            console.error('Error storing message:', error);
        }
    }));
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
io.on('connection', (socket) => {
    socket.on('notification', (msg) => {
        // Emit a 'notification' event to all other clients
        socket.broadcast.emit('notification', msg);
    });
});
app.get('/Message/:idChannel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idChannel } = req.params;
    try {
        const messages = yield messageModel_1.default.find({ id_Channel: idChannel });
        if (messages) {
            res.json({ message: 'Data found', data: messages });
        }
        else {
            res.status(404).json({ message: 'No data found' });
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
app.get("/get/:table/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table, name } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        switch (table) {
            case "User":
                result = yield userModel_1.default.findOne({ Login: name });
                break;
            case "Channel":
                result = yield channelModel_1.default.findOne({ Name: name });
                break;
            case "Message":
                result = yield messageModel_1.default.findOne({ _id: name });
                break;
            // Add cases for other tables here...
            default:
                res.status(400).json({ message: "Invalid table" });
                return;
        }
        if (result && result !== null) {
            res.json({ message: "Data found", data: result });
        }
        else {
            res.status(404).json({ message: "No data found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
app.get("/getUser/:id_User", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_User } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        result = yield userModel_1.default.findOne({ _id: id_User });
        if (result && result !== null) {
            res.json({ message: "Data found", data: result });
        }
        else {
            res.status(404).json({ message: "No data found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
app.get("/getAll/:table/:id_user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table, id_user } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        switch (table) {
            case "Channel":
                result = yield channelModel_1.default.find({ id_user: id_user });
                break;
            case "Message":
                result = yield messageModel_1.default.find({ id_Channel: id_user });
                break;
            default:
                res.status(400).json({ message: "Invalid table" });
                return;
        }
        if (result && result.length > 0) {
            res.json({ message: "Data found", data: result });
        }
        else {
            res.status(404).json({ message: "No data found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
//get the Channel by the id_Channel
app.get("/getChannel/:id_Channel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Channel } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        result = yield channelModel_1.default.findOne({ _id: id_Channel });
        if (result && result !== null) {
            res.json({ message: "Data found", data: result });
        }
        else {
            res.status(404).json({ message: "No data found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
app.get("/getLatestMessage/:id_Channel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_Channel } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        result = yield messageModel_1.default.find({ id_Channel: id_Channel })
            .sort({ Logs: -1 })
            .limit(1);
        if (result && result.length > 0) {
            res.json({ message: "Data found", data: result });
        }
        else {
            res.status(404).json({ message: "No data found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Login, Password } = req.body;
    try {
        yield (0, db_1.connectDB)();
        const user = yield userModel_1.default.findOne({ Login: Login });
        if (user && Password && (yield bcrypt_1.default.compare(Password, user.Password))) {
            // User found and password is correct, generate a token
            //récupérer heure et date
            const date = new Date().toLocaleTimeString();
            const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.Name, login: user.Login, date: date }, secret, { expiresIn: "1h" });
            res.json({ message: "Login successful", user: user, token: token });
        }
        else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
    finally {
        yield (0, db_1.disconnectDB)();
    }
}));
app.post("/create/:table", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table } = req.params;
    const data = req.body;
    try {
        yield (0, db_1.connectDB)();
        let result;
        switch (table) {
            case "User":
                const existingUser = yield userModel_1.default.findOne({ Login: data.Login });
                if (existingUser) {
                    res.status(400).json({ message: "Login already taken" });
                    return;
                }
                if (data.Password) {
                    data.Password = yield bcrypt_1.default.hash(data.Password, 10);
                }
                result = yield userModel_1.default.create(data);
                break;
            case "Channel":
                result = yield channelModel_1.default.create(data);
                break;
            case "Message":
                result = yield messageModel_1.default.create(data);
                break;
            default:
                res.status(400).json({ message: "Invalid table" });
                return;
        }
        if (result && result !== null) {
            res.json({ message: "Data created", data: result });
        }
        else {
            res.status(400).json({ message: "Data could not be created" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
    finally {
        yield (0, db_1.disconnectDB)();
    }
}));
app.put("/update/:table/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table, id } = req.params;
    const data = req.body;
    try {
        yield (0, db_1.connectDB)();
        let result;
        switch (table) {
            case "User":
                if (data.Password) {
                    data.Password = yield bcrypt_1.default.hash(data.Password, 10);
                }
                result = yield userModel_1.default.findByIdAndUpdate(id, data, { new: true });
                break;
            case "Channel":
                result = yield channelModel_1.default.findByIdAndUpdate(id, data, { new: true });
                break;
            case "Message":
                result = yield messageModel_1.default.findById(id);
                if (result) {
                    if (data.Contenu) {
                        result.Contenu = data.Contenu;
                        result.Logs = new Date().toLocaleTimeString();
                    }
                    yield result.save();
                }
                break;
            default:
                res.status(400).json({ message: "Invalid table" });
                return;
        }
        if (result && result !== null) {
            res.json({ message: "Data updated", data: result });
        }
        else {
            res.status(404).json({ message: "Data not found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
    finally {
        yield (0, db_1.disconnectDB)();
    }
}));
app.delete("/delete/:table/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table, id } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        switch (table) {
            case "User":
                result = yield userModel_1.default.findByIdAndDelete(id);
                break;
            case "Channel":
                result = yield channelModel_1.default.findByIdAndDelete(id);
                break;
            case "Message":
                result = yield messageModel_1.default.findByIdAndDelete(id);
                break;
            default:
                res.status(400).json({ message: "Invalid table" });
                return;
        }
        if (result && result !== null) {
            res.json({ message: "Data deleted", data: result });
        }
        else {
            res.status(404).json({ message: "Data not found" });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
    finally {
        yield (0, db_1.disconnectDB)();
    }
}));
app.get("/getAll/:table", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table } = req.params;
    try {
        yield (0, db_1.connectDB)();
        let result;
        switch (table) {
            case "Channel":
                result = yield channelModel_1.default.find();
                break;
            case "Message":
                result = yield messageModel_1.default.find();
                break;
            case "User":
                result = yield userModel_1.default.find();
                break;
            default:
                res.status(400).json({ message: "Invalid table" });
                return;
        }
        if (result && result.length > 0) {
            res.json({ message: "Data found", result });
        }
        else {
            res.status(404).json({ message: "No data found" });
        }
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = app;
