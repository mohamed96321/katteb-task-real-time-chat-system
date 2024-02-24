"use client"
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io();

const ChatPage: React.FC = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);

    const sendMessage = () => {
        // Emit a 'message' event to the server with the message content
        socket.emit("message", {
            sender: "senderUserId",  // Replace with the actual sender user ID
            receiver: "receiverUserId",  // Replace with the actual receiver user ID
            content: message,
        });
        setMessage("");
    };

    useEffect(() => {
        // Retrieve initial messages from MongoDB
        const fetchMessages = async () => {
            try {
                const response = await axios.get("/api/messages");
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Listen for 'message' events from the server
        socket.on("message", (newMessage: any) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            // Clean up the event listener when the component unmounts
            socket.off("message");
        };
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded">
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex items-center p-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
