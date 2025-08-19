import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Application state
let appState = {
  participants: [],
  selectedParticipants: [],
  isAnimating: false,
  currentAnimation: null
};

// Broadcast to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send current state to new client
  ws.send(JSON.stringify({
    type: 'STATE_UPDATE',
    data: appState
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'UPDATE_PARTICIPANTS':
          appState.participants = data.participants;
          broadcast({
            type: 'STATE_UPDATE',
            data: appState
          });
          break;
          
        case 'START_ANIMATION':
          if (appState.participants.length > 0 && !appState.isAnimating) {
            appState.isAnimating = true;
            
            // Simulate animation duration (3 seconds)
            setTimeout(() => {
              const availableParticipants = appState.participants.filter(
                p => !appState.selectedParticipants.find(s => s.name === p)
              );
              
              if (availableParticipants.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableParticipants.length);
                const selectedName = availableParticipants[randomIndex];
                
                appState.selectedParticipants.push({
                  name: selectedName,
                  timestamp: new Date().toLocaleString('id-ID')
                });
              }
              
              appState.isAnimating = false;
              appState.currentAnimation = null;
              
              broadcast({
                type: 'STATE_UPDATE',
                data: appState
              });
            }, 3000);
            
            broadcast({
              type: 'ANIMATION_START',
              data: appState
            });
          }
          break;
          
        case 'RESET_DATA':
          appState = {
            participants: [],
            selectedParticipants: [],
            isAnimating: false,
            currentAnimation: null
          };
          broadcast({
            type: 'STATE_UPDATE',
            data: appState
          });
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// CSV upload endpoint
app.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Simple CSV parsing (assuming single column with names)
    const fs = await import('fs');
    const csvContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Parse CSV properly - handle quotes, commas, and different formats
    const lines = csvContent
      .split(/\r?\n/) // Handle different line endings
      .map(line => {
        // Remove quotes if present and trim whitespace
        let cleanLine = line.trim();
        if (cleanLine.startsWith('"') && cleanLine.endsWith('"')) {
          cleanLine = cleanLine.slice(1, -1);
        }
        // If line contains comma, take only the first part (first column)
        if (cleanLine.includes(',')) {
          cleanLine = cleanLine.split(',')[0].trim();
          // Remove quotes from first column if present
          if (cleanLine.startsWith('"') && cleanLine.endsWith('"')) {
            cleanLine = cleanLine.slice(1, -1);
          }
        }
        return cleanLine;
      })
      .filter(line => line.length > 0 && line !== 'Nama' && line !== 'Name'); // Filter out empty lines and headers
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ participants: lines });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});

// Export CSV endpoint
app.get('/export-csv', (req, res) => {
  const csvContent = generateCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="participants-data.csv"');
  res.send(csvContent);
});

function generateCSV() {
  let csv = 'Nama,Status,Tanggal Terpilih\n';
  
  // Add selected participants
  appState.selectedParticipants.forEach(p => {
    csv += `"${p.name}","Terpilih","${p.timestamp}"\n`;
  });
  
  // Add unselected participants
  const unselected = appState.participants.filter(
    name => !appState.selectedParticipants.find(s => s.name === name)
  );
  unselected.forEach(name => {
    csv += `"${name}","Belum Terpilih",""\n`;
  });
  
  return csv;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});