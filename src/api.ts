import express from 'express';
import cors from 'cors';

import { subregionRouter } from './routes/subregion';
import { regionRouter } from './routes/regions';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Logger middleware
app.use((req, res, next) => {
  const startTime = new Date();
  const path = req.path;

  console.log(`[${startTime.toISOString()}] Received ${req.method} request at path ${path}`);

  res.on('finish', () => {
    const endTime = new Date();
    const timeTaken = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime.toISOString()}] Exit ${req.method} request at path ${path} with response ${res.statusCode} - (${timeTaken}ms)`)
  })

  next();
})

// Healthcheck endpoint
app.get(['/health', '/'], (req, res, next) => {
  res.status(200).send({ status: 'up' });
});

// Use routers
app.use('/subregions', subregionRouter);
app.use('/regions', regionRouter);

// Error catch-all route
app.get('*', async (req, res) => {
  console.log(`Received bad request at URL ${req.url}`);
  res.status(404).send("Not found!");
})
