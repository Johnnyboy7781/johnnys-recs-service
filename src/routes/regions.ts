import express from "express";

import { prisma } from "../utils/prisma-entry";

export const regionRouter = express.Router();

regionRouter.get('/', async (req, res) => {
    const result = await prisma.tbl_region.findMany();
    res.json(result);
})

