import dotenv from "dotenv"
import app from "./app";
import { client } from './db/db.connect';

dotenv.config({
  path: '../.env'
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

client.connect(function (err: any) {
  if (err) {
    throw err;
  }
  else {
    console.log("postgress connected !!");

  }
});