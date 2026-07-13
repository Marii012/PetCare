const app = require('./src/app');
const http = require('http');

const server = app.listen(3011, () => {
  const req = http.request({
    host: '127.0.0.1',
    port: 3011,
    path: '/api/appointments/1',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log('status', res.statusCode);
      console.log(data);
      server.close();
    });
  });

  req.on('error', (err) => {
    console.error(err);
    server.close();
  });

  req.write(JSON.stringify({ estado: 'Rejeitada', motivo_cancelamento: 'Cancelada pelo utilizador' }));
  req.end();
});
