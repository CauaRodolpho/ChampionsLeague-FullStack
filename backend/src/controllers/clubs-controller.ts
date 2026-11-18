import { Request, Response } from "express";
import * as ClubService from "../services/clubs-service";

export const getClubs = async (req: Request, res: Response) => {
  const httpResponse = await ClubService.getClubService();
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const postClub = async (req: Request, res: Response) => {
  const httpResponse = await ClubService.createClubService(req.body);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const deleteClub = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const httpResponse = await ClubService.deleteClubService(id);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};
