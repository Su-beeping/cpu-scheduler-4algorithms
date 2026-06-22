const { fcfs, priorityScheduling, sjf, roundRobin } = require('../services/scheduler');

const simulate = (req, res) => {
  const { processes } = req.body;

  if (!processes || !Array.isArray(processes) || processes.length === 0)
    return res.status(400).json({ error: 'Provide at least one process.' });

  const result = fcfs(processes);
  res.json(result);
};

const simulatePriority = (req, res) => {
  const { processes } = req.body;

  if (!processes || !Array.isArray(processes) || processes.length === 0)
    return res.status(400).json({ error: 'Provide at least one process.' });

  const hasInvalidPriority = processes.some(p => p.priority === undefined || p.priority === null);
  if (hasInvalidPriority)
    return res.status(400).json({ error: 'Every process must have a priority value.' });

  const result = priorityScheduling(processes);
  res.json(result);
};

const simulateSJF = (req, res) => {
  const { processes } = req.body;

  if (!processes || !Array.isArray(processes) || processes.length === 0)
    return res.status(400).json({ error: 'Provide at least one process.' });

  const result = sjf(processes);
  res.json(result);
};

const simulateRoundRobin = (req, res) => {
  const { processes, quantum } = req.body;

  if (!processes || !Array.isArray(processes) || processes.length === 0)
    return res.status(400).json({ error: 'Provide at least one process.' });
  if (!quantum || quantum <= 0)
    return res.status(400).json({ error: 'Quantum must be a positive number.' });

  const result = roundRobin(processes, quantum);
  res.json(result);
};

const healthCheck = (req, res) => res.json({ status: 'ok' });

module.exports = { simulate, simulatePriority, simulateSJF, simulateRoundRobin, healthCheck };
