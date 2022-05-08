const app = require('./app');

const PORT = 3000;

// listen
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});
