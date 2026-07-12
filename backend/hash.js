const bcrypt = require("bcrypt");

bcrypt.hash("admin123", 10).then((hash) => {
  console.log(hash);
});

//$2b$10$6pYNsGkSmf/A31O9pbIna.odcHmYkazzt57h9EkQONnj1xUSOuWby