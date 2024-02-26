// pages/api/search.js

import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk";
import { config } from "dotenv";

config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { fid } = req.body;
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "API key is missing in the environment variables." });
  }

  const client = new NeynarAPIClient(apiKey);

  try {
    const user = await client.lookupUserByFid(fid);
    res.status(200).json(user);
  } catch (error) {
    if (isApiErrorResponse(error)) {
      res.status(error.response.status).json({ message: "API Error", details: error.response.data });
    } else {
      res.status(500).json({ message: "Generic Error", details: error.message });
    }
  }
}
