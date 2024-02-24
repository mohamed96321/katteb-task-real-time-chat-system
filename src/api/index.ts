import { createServer } from "http";
import { Server } from "socket.io";

function socketIo(socketServer: Server) : void {
  const httpServer = createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  httpServer.listen(3001, () => {
    console.log("Socket.io server is running on http://localhost:3001");
  });
}

export default socketIo;