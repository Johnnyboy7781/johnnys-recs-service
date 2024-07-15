import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get(['/health', '/'], (req, res) => {
  res.status(200).send({ status: 'up' });
});

app.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

app.get('/test', async (req, res) => {
  const result = await prisma.tbl_place.findMany()
  res.json(result);
})

app.get('*', async (req, res) => {
  console.log(`Received bad request at URL ${req.url}`);
  res.status(404).send("Not found!");
})
