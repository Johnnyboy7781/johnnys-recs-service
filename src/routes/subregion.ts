import express from "express";

import { prisma } from "../utils/prisma-entry";

export const subregionRouter = express.Router();

// Get subregions by region id
subregionRouter.get('/region/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
        res.sendStatus(400);
        return;
    }

    const result = await prisma.tbl_sub_region.findMany(
        {
            where: {
                region_id: id
            }
        }
    );

    res.json(result);
});
