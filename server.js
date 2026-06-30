const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Serve all static files from your public folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to load your game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Success! Your game server is running at: http://localhost:${PORT}`);
});