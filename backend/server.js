const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/mentors',  require('./routes/mentors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/upload',   require('./routes/upload'));
app.use('/api/cs',       require('./routes/cs'));
app.use('/api/auth',     require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Alhamdulillah ada http://localhost:${PORT}`);
});
