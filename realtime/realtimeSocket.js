import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors:{
        origin:"https://finance-and-expense-tracker.netlify.app",
        methods:["GET","POST"],
        credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    socket.on('joinRoom', (userId) => {
        console.log(`User with ID: ${userId} is joining a room`);
        socket.join(userId); 
        socket.emit("message", "Welcome to real-time transactions update!");
      });
  
    

    socket.on("disconnect", () => {
    console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });
};

export const notifyClientsAboutTransaction = (userId, transactionData) => {
  if (io) {
    io.to(userId).emit('transaction-update', transactionData);

  }
};
