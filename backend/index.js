require('dotenv').config();
const express = require('express');
const cors = require('cors');
const simulateRoutes = require('./routes/simulate');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', simulateRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`FCFS backend running on http://localhost:${PORT}`));
