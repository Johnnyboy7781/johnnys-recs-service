import express from "express";
import { ParsedQs } from "qs";
import axios, { AxiosResponse } from "axios";

import { prisma } from "../utils/prisma-entry";

export const placesRouter = express.Router();

const googleApiUrl = "https://places.googleapis.com/v1/places";
const fieldMask = "fields=nationalPhoneNumber,formattedAddress,googleMapsUri,websiteUri,regularOpeningHours.openNow"

type WhereClause = { [k: string]: number | object }

/**
 * Build the where clause that will be used to get a filtered list of places
 * 
 * @param params The parameters passed via query params 
 * @returns An object that will be used to filter places
 */
const buildWhereClause = (params: ParsedQs): WhereClause => {
    const whereClause: WhereClause = {
        region_id: parseInt(params.region_id.toString())
    };
    if (params.subregion_id !== "-1") {
        whereClause.subregion_id = parseInt(params.subregion_id.toString());
    }
    if (params.num_stars !== "-1") {
        whereClause.num_stars = { gte: parseInt(params.num_stars.toString()) };
    }   
    if (params.has_superlative === "true") {
        whereClause.superlative = { not: null };
    }

    return whereClause;
}

// Get all places that match the supplied parameters
placesRouter.get("/", async (req, res) => {
    const whereClause = buildWhereClause(req.query);

    const response = await prisma.tbl_place.findMany(
        {
            where: whereClause,
        }
    );

    res.json(response);
});

// Reach out to the Google Places API for place data such as address, phone number, etc.
placesRouter.get("/:google_uid", async (req, res) => {
    const fullApiUrl = `${googleApiUrl}/${req.params.google_uid}?key=${process.env.GOOGLE_API_KEY}&${fieldMask}`;
    let response: AxiosResponse;

    try {
        response = await axios.get(fullApiUrl);
    } catch (error) {
        console.error(`ERROR: Places API request failed, URL attempted: ${fullApiUrl}`);
        res.status(500).json({ message: "Something went wrong with the Places API request!" });
        return;
    }

    res.json(response.data);
});
