const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const serverIP = process.env.SERVER_IP || '127.0.0.1';
const PORT = 8081;

// Configurar Morgan para registrar solicitudes HTTP
//app.use(morgan('combined'));

// Configurar Winston para registrar eventos y errores
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Registrar errores en un archivo error.log
    new winston.transports.File({ filename: 'logs/combined.log' }) // Registrar otros eventos en un archivo combined.log
  ]
});

app.use(express.json());
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permitir los métodos especificados
  allowedHeaders: 'Content-Type,Authorization', // Permitir los encabezados especificados
}));

let cars = [];

app.post('/server', (req, res) => {
  const currentTime = new Date().toLocaleString();
  const newCar = {
    license_plate: req.body.license_plate,
    color: req.body.color,
    entry_time: currentTime,
    carPhoto: req.body.carPhoto,
  };
  cars.push(newCar);
  console.log('Datos del carro:', newCar);
  res.send('Car registered successfully');
});

app.patch('/car', (req, res) => {
  const placa = req.body.license_plate;
  console.log(placa);

  const index = cars.findIndex(car => car.license_plate === placa);
  if (index !== -1) {
    // Elimina el carro de la lista de carros registrados
    cars.splice(index, 1);

    // Envía una respuesta indicando que el carro ha sido retirado con éxito
    res.send(`Car with license plate ${placa} has been successfully removed.`);
  } else {
    // Si el carro no se encuentra, envía una respuesta indicando que no se encontró el carro con esa placa
    res.status(404).send(`Car with license plate ${license_plate} not found.`);
  }

});

app.get('/get/cars', (req, res) => {
  res.json(cars);
});

// Manejar errores
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, serverIP, () => {
  console.log(`El servidor está corriendo en http://${serverIP}:${PORT}/`);
});



