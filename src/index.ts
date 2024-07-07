import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

// call after config() to access the env variables
import { app } from './api';

const port: number = Number(process.env.PORT) || 3000;

app.listen(port, "::", () =>
  console.log(`API available on port [::]${port}`)
);
