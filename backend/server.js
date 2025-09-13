const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});