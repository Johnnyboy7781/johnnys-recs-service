import express from "express";
import { ParsedQs } from "qs";

import { prisma } from "../utils/prisma-entry";

export const placesRouter = express.Router();

type WhereClause = { [k: string]: number | object }

const buildWhereClause = (params: ParsedQs): WhereClause => {
    const whereClause: WhereClause = {
        region_id: parseInt(params.region_id.toString())
    };

    if (params.subregion_id !== "-1") {
        whereClause.subregion_id = parseInt(params.region_id.toString());
    }

    if (params.num_stars !== "-1") {
        whereClause.num_stars = parseInt(params.num_stars.toString());
    }

    if (params.has_superlative === "true") {
        whereClause.superlative_id = { not: null };
    }

    return whereClause;
}

placesRouter.get("/", async (req, res) => {
    const whereClause = buildWhereClause(req.query);

    const response = await prisma.tbl_place.findMany(
        {
            where: whereClause,
        }
    );

    res.json(response);
});
