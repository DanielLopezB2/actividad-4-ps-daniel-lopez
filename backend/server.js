require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('./src/config/database');

const authRoutes = require('./src/routes/auth');
const habitRoutes = require('./src/routes/habits');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HabitFlow API',
      version: '1.0.0',
      description: 'API REST para el seguimiento de microhábitos estudiantiles',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/controllers/*.js'],
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.get('/api/health', (_, res) => res.json({ estado: 'OK', db: 'SQLite', version: '1.0.0' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor HabitFlow corriendo en puerto ${PORT}`));
