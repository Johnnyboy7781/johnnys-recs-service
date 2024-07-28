import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

import { app } from './api';

const port: number = Number(process.env.PORT) || 3000;

// Start server on IPv6 configured port
app.listen(port, "::", () =>
  console.log(`API available on port [::]${port}`)
);
