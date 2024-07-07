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

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

api.get('/test', async (req, res) => {
  const result = await prisma.tbl_place.findMany()
  res.json(result);
})

// Version the api
app.use('/api/v1', api);
