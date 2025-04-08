import express from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';
import { User } from './models/User.js';
import { Post } from './models/Post.js';
import { Message } from './models/Message.js';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import uploadRouter from './routes/upload.js';

const secretKey = "Argynbek-aqai-is-best-teacher";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/upload', uploadRouter);
app.use(
    cors({
        // origin: 'https://media-front-sandy.vercel.app',
        origin: 'https://media-eta-orpin.vercel.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send({ message: 'Token is invalid' });
        req.userId = user.userId;
        next();
    });
}


app.post('/login', async (req, res) => {
    const reqUser = req.body
    const user = await User.findOne({ email: reqUser.email, password: reqUser.password });

    if(user){
        const token = jwt.sign({userId: user._id, email: user.email, role: user.role, city: user.city, ava: user.ava}, secretKey, {expiresIn: 3600});
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token,
            city: user.city,
            ava: user.ava
        });}else{
        res.status(401).json({message: "Wrong username or password!"});
    }
});

app.post('/register', async (request, response) => {
    try {
        const { email, name, password, city, imageUrl } = request.body;

        if (!name || !email || !password || !city) {
            return response.status(400).send({
                message: 'Send all required fields!'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).json({ message: "User with this email already exists!" });
        }

        const users = await User.find({});
        const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

        const newUser = new User({
            id: newId,
            username: name,
            email,
            password,
            city,
            ava: imageUrl,
            role: "user"
        });

        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


app.post("/create_post", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { post_text, imageUrl, username, user_ava } = req.body;

        if (!imageUrl || !post_text) {
            return res.status(400).send({ message: "Send all required fields!" });
        }

        const newPost = new Post({
            post_text,
            img_src: imageUrl,
            user_id: userId,
            username,
            user_ava,
            createdAt: new Date(),
            like: 0,
            likedBy: []
        });

        const savedPost = await newPost.save();
        return res.status(201).send(savedPost);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


app.get('/write_messega', async (req, res) => {
    try {
        const users = await Message.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const users = await Message.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

app.get('/ping', (req, res) => {
    res.send('pong');
});


app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        if (!posts) return res.status(404).send("Post not found");

        res.set("Content-Type", posts.image.contentType);
        res.send(posts.image.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to db");
        const server = app.listen(PORT, () => {
            console.log(`App is listening on PORT: ${PORT}`);
        });

        const wss = new WebSocketServer({ server });

        let clients = new Map();

        wss.on('connection', (ws) => {
            console.log('New WebSocket connection established');

            ws.on('message', async (data) => {
                const messageData = JSON.parse(data);

                if (messageData.type === "auth") {
                    clients.set(messageData.userId, ws);
                    console.log(`User ${messageData.userId} connected to WebSocket`);
                    return;
                }

                if (messageData.type === "message") {
                    const { sender_id, getter_id, text, sender_ava, sender_name } = messageData;

                    const newMessage = new Message({
                        sender_id,
                        getter_id,
                        message: text,
                        createdAt: new Date().toISOString(),
                        sender_ava,
                        sender_name,
                    });

                    await newMessage.save();

                    if (clients.has(getter_id)) {
                        clients.get(getter_id).send(JSON.stringify(messageData));
                    }
                }
            });

            ws.on('close', () => {
                for (let [userId, client] of clients) {
                    if (client === ws) {
                        clients.delete(userId);
                        console.log(`User ${userId} disconnected`);
                    }
                }
            });
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });



/*
тая  15 500
алиш
ангелина
мира
стажер 1500
техничка
мен
повар
 */