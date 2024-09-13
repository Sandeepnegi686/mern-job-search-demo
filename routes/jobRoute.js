import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controller/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/create", createJob);
jobRouter.get("/getalljobs", getAllJobs);

jobRouter.patch("/:id", updateJob);
jobRouter.delete("/:id", deleteJob);

jobRouter.get("/stats", showStats);

export default jobRouter;
