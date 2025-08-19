import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/participant', (req, res) => {
  res.sendFile(path.join(__dirname, 'participant.html'));
});

// Game state
let gameState = {
  participants: [],
  selected: [],
  isRandomizing: false,
  currentAnimation: null
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current state to new connection
  socket.emit('gameState', gameState);

  // Handle participant list update
  socket.on('updateParticipants', (participants) => {
    gameState.participants = participants;
    gameState.selected = [];
    io.emit('participantsUpdated', gameState);
  });

  // Handle randomization start
  socket.on('startRandomization', () => {
    if (gameState.participants.length === 0) {
      socket.emit('error', 'No participants available');
      return;
    }

    const availableParticipants = gameState.participants.filter(
      p => !gameState.selected.find(s => s.name === p)
    );

    if (availableParticipants.length === 0) {
      socket.emit('error', 'All participants have been selected');
      return;
    }

    gameState.isRandomizing = true;
    io.emit('randomizationStarted');

    // Simulate randomization animation for 3 seconds
    setTimeout(() => {
      const selectedName = availableParticipants[
        Math.floor(Math.random() * availableParticipants.length)
      ];
      
      const selectedData = {
        name: selectedName,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      gameState.selected.push(selectedData);
      gameState.isRandomizing = false;
      gameState.currentAnimation = selectedName;

      io.emit('participantSelected', {
        selected: selectedData,
        gameState: gameState
      });

      // Clear animation after 2 seconds
      setTimeout(() => {
        gameState.currentAnimation = null;
        io.emit('animationComplete');
      }, 2000);

    }, 3000);
  });

  // Handle reset
  socket.on('reset', () => {
    gameState = {
      participants: [],
      selected: [],
      isRandomizing: false,
      currentAnimation: null
    };
    io.emit('gameState', gameState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});