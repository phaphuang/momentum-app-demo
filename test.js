fetch('http://localhost:3000/api/user-data').then(r=>r.text()).then(console.log).catch(console.error)
