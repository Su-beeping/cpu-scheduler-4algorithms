import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import API_BASE_URL from './config';
import ProcessTable from './components/ProcessTable';
import PriorityProcessTable from './components/PriorityProcessTable';
import SJFProcessTable from './components/SJFProcessTable';
import RRProcessTable from './components/RRProcessTable';
import GanttChart from './components/GanttChart';
import ResultsTable from './components/ResultsTable';

const COLORS = ['#6C63FF','#FF6584','#43C6AC','#F7971E','#a78bfa','#34d399','#fb923c','#60a5fa'];

const ALGORITHMS = {
  fcfs: {
    label: 'First Come First Serve',
    endpoint: '/simulate',
    defaultProcesses: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 },
      { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3 },
      { id: 3, name: 'P3', arrivalTime: 2, burstTime: 7 },
    ],
  },
  priority: {
    label: 'Priority Scheduling',
    endpoint: '/simulate-priority',
    defaultProcesses: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 3, name: 'P3', arrivalTime: 2, burstTime: 7, priority: 3 },
    ],
  },
  sjf: {
    label: 'Shortest Job First',
    endpoint: '/simulate-sjf',
    defaultProcesses: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 6 },
      { id: 2, name: 'P2', arrivalTime: 1, burstTime: 2 },
      { id: 3, name: 'P3', arrivalTime: 2, burstTime: 4 },
    ],
  },
  rr: {
    label: 'Round Robin',
    endpoint: '/simulate-rr',
    defaultProcesses: [
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 },
      { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3 },
      { id: 3, name: 'P3', arrivalTime: 2, burstTime: 8 },
    ],
  },
};

export default function App() {
  const [algorithm, setAlgorithm] = useState('fcfs');

  const [processesByAlgo, setProcessesByAlgo] = useState({
    fcfs: ALGORITHMS.fcfs.defaultProcesses,
    priority: ALGORITHMS.priority.defaultProcesses,
    sjf: ALGORITHMS.sjf.defaultProcesses,
    rr: ALGORITHMS.rr.defaultProcesses,
  });
  const [quantum, setQuantum] = useState(2);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processes = processesByAlgo[algorithm];

  const setProcesses = (updated) => {
    setProcessesByAlgo(prev => ({ ...prev, [algorithm]: updated }));
  };

  const switchAlgorithm = (algo) => {
    setAlgorithm(algo);
    setResult(null);
    setError('');
  };

  const addProcess = () => {
    const id = processes.length + 1;
    const base = { id, name: `P${id}`, arrivalTime: 0, burstTime: 1 };
    if (algorithm === 'priority') base.priority = 1;
    setProcesses([...processes, base]);
  };

  const removeProcess = (id) => setProcesses(processes.filter(p => p.id !== id));

  const updateProcess = (id, field, value) => {
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, [field]: field === 'name' ? value : Number(value) } : p
    ));
  };

  const simulate = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const endpoint = ALGORITHMS[algorithm].endpoint;
      const payload = algorithm === 'rr'
        ? { processes, quantum: Number(quantum) }
        : { processes };
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Cannot connect to backend. Make sure the server is running on port 5001.');
    }
    setLoading(false);
  };

  const reset = () => {
    setProcessesByAlgo(prev => ({ ...prev, [algorithm]: ALGORITHMS[algorithm].defaultProcesses }));
    setQuantum(2);
    setResult(null);
    setError('');
  };

  const colorMap = {};
  processes.forEach((p, i) => { colorMap[p.name] = COLORS[i % COLORS.length]; });

  const renderInputTable = () => {
    const commonProps = {
      processes, onUpdate: updateProcess, onRemove: removeProcess,
      onAdd: addProcess, onSimulate: simulate, onReset: reset,
      loading, error,
    };

    switch (algorithm) {
      case 'priority':
        return <PriorityProcessTable {...commonProps} />;
      case 'sjf':
        return <SJFProcessTable {...commonProps} />;
      case 'rr':
        return <RRProcessTable {...commonProps} quantum={quantum} onQuantumChange={setQuantum} />;
      default:
        return <ProcessTable {...commonProps} />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">▦</span>
            <span className="logo-text">CPU<span className="logo-accent">.sim</span></span>
          </div>
          <p className="header-sub">CPU Scheduling Visualizer</p>
        </div>
      </header>

      <main className="main">
        <div className="tabs">
          {Object.entries(ALGORITHMS).map(([key, algo]) => (
            <button
              key={key}
              className={`tab-btn ${algorithm === key ? 'tab-active' : ''}`}
              onClick={() => switchAlgorithm(key)}
            >
              {algo.label}
            </button>
          ))}
        </div>

        {renderInputTable()}

        {result && (
          <>
            <GanttChart timeline={result.timeline} colorMap={colorMap} />
            <ResultsTable
              results={result.results}
              avgWaiting={result.avgWaiting}
              avgTurnaround={result.avgTurnaround}
              colorMap={colorMap}
              showPriority={algorithm === 'priority'}
            />
          </>
        )}
      </main>
    </div>
  );
}
