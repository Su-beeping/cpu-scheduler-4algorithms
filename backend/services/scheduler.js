// FCFS (First Come First Serve) Scheduling Algorithm
// Processes are executed strictly in the order they arrive/are entered.
function fcfs(processes) {
  const gantt = [];
  const results = [];
  let currentTime = 0;

  processes.forEach((process) => {
    const start = currentTime;
    const end = start + process.burstTime;

    gantt.push({
      process: process.name,
      start,
      end,
    });

    const completionTime = end;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    results.push({
      id: process.id,
      name: process.name,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    currentTime = end;
  });

  const n = results.length;
  const avgWaiting = results.reduce((s, r) => s + r.waitingTime, 0) / n;
  const avgTurnaround = results.reduce((s, r) => s + r.turnaroundTime, 0) / n;

  return { timeline: gantt, results, avgWaiting, avgTurnaround };
}

// Priority Scheduling (Non-Preemptive)
// Lower priority number = higher priority (executed first).
function priorityScheduling(processes) {
  const sorted = [...processes].sort((a, b) => a.priority - b.priority);

  const gantt = [];
  const results = [];
  let currentTime = 0;

  sorted.forEach((process) => {
    const start = currentTime;
    const end = start + process.burstTime;

    gantt.push({
      process: process.name,
      priority: process.priority,
      start,
      end,
    });

    const completionTime = end;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    results.push({
      id: process.id,
      name: process.name,
      priority: process.priority,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    currentTime = end;
  });

  const n = results.length;
  const avgWaiting = results.reduce((s, r) => s + r.waitingTime, 0) / n;
  const avgTurnaround = results.reduce((s, r) => s + r.turnaroundTime, 0) / n;

  return { timeline: gantt, results, avgWaiting, avgTurnaround };
}

// Shortest Job First (Non-Preemptive)
// Among available processes, the one with the smallest burst time runs next.
function sjf(processes) {
  const n = processes.length;
  const remaining = processes.map(p => ({ ...p, done: false }));
  let time = 0;
  let completedCount = 0;

  const gantt = [];
  const results = [];

  while (completedCount < n) {
    // Find available (arrived, not done) processes
    const available = remaining.filter(p => !p.done && p.arrivalTime <= time);

    if (available.length === 0) {
      // CPU idle — jump to next arrival
      const nextArrival = remaining
        .filter(p => !p.done)
        .reduce((min, p) => p.arrivalTime < min ? p.arrivalTime : min, Infinity);
      gantt.push({ process: 'Idle', start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    // Pick the one with smallest burst time (tie-break: earliest arrival)
    available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);
    const next = available[0];

    const start = time;
    const end = start + next.burstTime;
    time = end;
    next.done = true;
    completedCount++;

    gantt.push({ process: next.name, start, end });

    const completionTime = end;
    const turnaroundTime = completionTime - next.arrivalTime;
    const waitingTime = turnaroundTime - next.burstTime;

    results.push({
      id: next.id,
      name: next.name,
      arrivalTime: next.arrivalTime,
      burstTime: next.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });
  }

  // Re-order results to match original process input order (nicer for the table)
  const orderedResults = processes.map(p => results.find(r => r.id === p.id));

  const avgWaiting = orderedResults.reduce((s, r) => s + r.waitingTime, 0) / n;
  const avgTurnaround = orderedResults.reduce((s, r) => s + r.turnaroundTime, 0) / n;

  return { timeline: gantt, results: orderedResults, avgWaiting, avgTurnaround };
}

// Round Robin
// Each process gets a fixed time slice (quantum); if not finished, it goes back in the queue.
function roundRobin(processes, quantum) {
  const n = processes.length;
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

  let time = 0;
  let completed = 0;
  const timeline = [];
  const results = processes.map(p => ({
    id: p.id, name: p.name,
    arrivalTime: p.arrivalTime, burstTime: p.burstTime,
    completionTime: 0, turnaroundTime: 0, waitingTime: 0,
  }));

  const queue = [];
  const inQueue = new Array(n).fill(false);

  remaining.forEach((p, i) => {
    if (p.arrivalTime <= time) { queue.push(i); inQueue[i] = true; }
  });

  while (completed < n) {
    if (queue.length === 0) {
      const nextArrival = remaining
        .filter((p, i) => !inQueue[i] && p.remainingTime > 0)
        .reduce((min, p) => p.arrivalTime < min ? p.arrivalTime : min, Infinity);
      if (nextArrival === Infinity) break;
      timeline.push({ process: 'Idle', start: time, end: nextArrival });
      time = nextArrival;
      remaining.forEach((p, i) => {
        if (!inQueue[i] && p.arrivalTime <= time && p.remainingTime > 0) {
          queue.push(i); inQueue[i] = true;
        }
      });
      continue;
    }

    const idx = queue.shift();
    const execTime = Math.min(quantum, remaining[idx].remainingTime);
    const start = time;
    time += execTime;
    remaining[idx].remainingTime -= execTime;

    timeline.push({ process: remaining[idx].name, pid: remaining[idx].id, start, end: time });

    remaining.forEach((p, i) => {
      if (!inQueue[i] && p.arrivalTime <= time && p.remainingTime > 0) {
        queue.push(i); inQueue[i] = true;
      }
    });

    if (remaining[idx].remainingTime === 0) {
      completed++;
      results[idx].completionTime = time;
      results[idx].turnaroundTime = time - processes[idx].arrivalTime;
      results[idx].waitingTime = results[idx].turnaroundTime - processes[idx].burstTime;
    } else {
      queue.push(idx);
    }
  }

  const avgWaiting = results.reduce((s, r) => s + r.waitingTime, 0) / n;
  const avgTurnaround = results.reduce((s, r) => s + r.turnaroundTime, 0) / n;

  return { timeline, results, avgWaiting, avgTurnaround };
}

module.exports = { fcfs, priorityScheduling, sjf, roundRobin };
