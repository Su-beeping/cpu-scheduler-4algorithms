# ▦ CPU.sim — Multi-Algorithm CPU Scheduler

A full-stack web app that simulates **CPU scheduling algorithms** with a live Gantt chart visualization.

Currently supports:
- **First Come First Serve (FCFS)**
- **Priority Scheduling (Non-Preemptive)**
- **Shortest Job First (Non-Preemptive)**
- **Round Robin (with configurable time quantum)**

Built with **React** (frontend) + **Node.js/Express** (backend) connected via REST API.

---

## 🖥️ Preview

> Add a screenshot here after running the app:
> `![App Screenshot](screenshot.png)`

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Axios, CSS |
| Backend | Node.js, Express |
| Architecture | REST API, MVC Pattern |
| Database | None (stateless API) |

---

## ⚙️ How to Run

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/fcfs-simulator.git
cd fcfs-simulator
```

### 2. Start the Backend
```bash
cd backend
npm install
node index.js
```
Backend runs at: `http://localhost:5001`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/simulate` | Run FCFS simulation |
| POST | `/api/simulate-priority` | Run Priority Scheduling simulation |
| POST | `/api/simulate-sjf` | Run Shortest Job First simulation |
| POST | `/api/simulate-rr` | Run Round Robin simulation |
| GET | `/api/health` | Health check |

### FCFS / SJF Request Body
```json
{
  "processes": [
    { "id": 1, "name": "P1", "arrivalTime": 0, "burstTime": 5 },
    { "id": 2, "name": "P2", "arrivalTime": 1, "burstTime": 3 }
  ]
}
```

### Priority Scheduling Request Body
```json
{
  "processes": [
    { "id": 1, "name": "P1", "arrivalTime": 0, "burstTime": 5, "priority": 2 },
    { "id": 2, "name": "P2", "arrivalTime": 1, "burstTime": 3, "priority": 1 }
  ]
}
```

### Round Robin Request Body
```json
{
  "processes": [
    { "id": 1, "name": "P1", "arrivalTime": 0, "burstTime": 5 },
    { "id": 2, "name": "P2", "arrivalTime": 1, "burstTime": 3 }
  ],
  "quantum": 2
}
```

---

## 📁 Project Structure

```
fcfs-simulator/
├── backend/
│   ├── index.js
│   ├── routes/simulate.js
│   ├── controllers/simulateController.js
│   └── services/scheduler.js
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── config.js
    │   └── components/
    │       ├── ProcessTable.js
    │       ├── GanttChart.js
    │       └── ResultsTable.js
    └── public/
```

---

## 👨‍💻 Author

**Sufian Abid Kayani** — BSCS Student, Islamabad
- GitHub: [Su-beeping](https://github.com/Su-beeping)
