import { Request, Response } from "express";
import * as PlayerService from "../services/players-service";

export const getPlayer = async (req: Request, res: Response) => {
  const httpResponse = await PlayerService.getPlayerService();
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const getPlayerById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const httpResponse = await PlayerService.getPlayerByIdService(id);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const postPlayer = async (req: Request, res: Response) => {
  const bodyValue = req.body;
  const httpResponse = await PlayerService.createPlayerService(bodyValue);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const deletePlayer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const httpResponse = await PlayerService.deletePlayerService(id);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const updatePlayer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const bodyValue = req.body;
  const httpResponse = await PlayerService.updatePlayerService(id, bodyValue);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};
