import { Server } from "socket.io";
import { connect } from "@/dbConfig/dbConfig";
import Message from "@/models/messageModel";

connect();

const io = new Server();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("message", async (data) => {
        const { sender, receiver, content } = data;

        // Save the message to MongoDB
        const newMessage = new Message({
            sender,
            receiver,
            content,
        });

        await newMessage.save();

        // Broadcast the message to the sender and receiver
        io.to(sender).emit("message", newMessage);
        io.to(receiver).emit("message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

export default io;
