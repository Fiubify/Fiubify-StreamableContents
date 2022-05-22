const app = require("./app");

const PORT = 3000;

// Listen to specific Port
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
