require("dotenv").config(); 
const exp = require("express");
const app = exp();
const mongoose = require("mongoose");
const cors = require("cors");

const userApp = require("./Apis/userApi");
const authorApp = require("./Apis/authorApi");
const adminApp = require("./Apis/adminApi");

// ✅ Use PORT from env or fallback to 3000
const port = process.env.PORT || 3000;
console.log("Using port:", port);

// ✅ CORS
app.use(cors({
  origin: 'https://bloghive-gules.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(exp.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send("Welcome to BlogHive");
});

// ✅ Routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Error handled by Express async handler:", err);
  res.status(500).json({ message: err.message });
});

// ✅ DB Connection and Server Start
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}...`));
    console.log("DB connection successful");
  })
  .catch((err) => console.log("Error in DB connection", err));
