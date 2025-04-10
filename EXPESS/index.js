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
import {WakeUp} from "./models/WakeUp.js";
import {RequestToFriends} from './models/RequestToFriends.js'

const secretKey = "Argynbek-aqai-is-best-teacher";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/upload', uploadRouter);
app.use(
    cors({
        origin: 'https://media-o38z.vercel.app',
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

app.post('/wake_up', async (request, response) => {
    try {
        const { email } = request.body;

        const newUser = new WakeUp({
            email,
            createdAt: new Date(),
        });

        const savedWakeUp = await newUser.save();
        return response.status(201).send(savedWakeUp);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    const reqUser = req.body
    const user = await User.findOne({ email: reqUser.email, password: reqUser.password });

    if(user){
        const token = jwt.sign({userId: user._id, email: user.email, role: user.role, city: user.city, ava: user.ava, text_about_user:user.text_about_user}, secretKey, {expiresIn: 3600});
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token,
            city: user.city,
            ava: user.ava,
            text_about_user: user.text_about_user
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
            role: "user",
            text_about_user: `Hi! me name is ${name}`
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


app.post('/request_to_friends', authenticateToken, async (request, response) => {
    try {
        const {user_id,UserLocation,userAva,userName,sender_id } = request.body;

        if (!user_id || !userName || !user_id) {
            return response.status(400).send({ message: 'Send all required fields!' });
        }

        const NewRequest = new RequestToFriends({
            user_id,
            UserLocation,
            userAva,
            userName,
            sender_id,
            createdAt: new Date(),
        });

        const savedPost = await NewRequest.save();
        return response.status(201).send(savedPost);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

app.delete('/request_to_friends/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await RequestToFriends.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Post not found' });
        }

        return response.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})





app.get('/check_friend_request', authenticateToken, async (req, res) => {
    try {
        const { user_id, sender_id } = req.query;

        const existingRequest = await RequestToFriends.findOne({ user_id, sender_id });

        res.json({ exists: !!existingRequest });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});



app.delete('/cancel_friend_request', authenticateToken, async (req, res) => {
    try {
        const { user_id, sender_id } = req.query;

        await RequestToFriends.deleteOne({ user_id, sender_id });

        res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
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


