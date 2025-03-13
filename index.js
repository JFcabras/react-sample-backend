const app = require('./app'); // Correct import

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
