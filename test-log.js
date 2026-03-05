fetch('http://localhost:3000/api/log-action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ actionType: 'water' })
}).then(r=>r.text()).then(console.log).catch(console.error)
