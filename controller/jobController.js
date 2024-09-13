import UserModel from "../model/User.js";
import JobModel from "../model/JobModel.js";
import BadRequestError from "../error/badRequest.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../error/notFound.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment/moment.js";

async function createJob(req, res) {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all fields");
  }

  const { jobStatus, jobLocation, jobType } = req.body;

  const createdBy = req.user.userId;
  const job = await JobModel.create({
    company,
    position,
    createdBy,
    jobStatus,
    jobLocation,
    jobType,
  });

  res.status(StatusCodes.CREATED).json({ msg: "Job Created", job });
}

async function getAllJobs(req, res) {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = { createdBy: req.user.userId };

  if (jobStatus && jobStatus !== "all") queryObject.jobStatus = jobStatus;
  if (jobType && jobType !== "all") queryObject.jobType = jobType;
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  // NO AWAIT
  let result = JobModel.find(queryObject);

  // chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await JobModel.countDocuments(queryObject);

  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    jobs,
    totalJobs,
    numOfPages,
  });
}

async function updateJob(req, res) {
  const { id: jobId } = req.params;

  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Please provide all fields");
  }
  const job = await JobModel.findOne({ _id: jobId });

  checkPermissions(req.user.userId, job.createdBy.toString());

  if (!job) {
    throw new NotFoundError("Job not found");
  }
  const updatedJob = await JobModel.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json(updatedJob);
}

async function deleteJob(req, res) {
  const { id } = req.params;
  try {
    const job = await JobModel.findOne({ _id: id });
    if (!job) throw new NotFoundError("Job not found");
    checkPermissions(req.user.userId, job.createdBy.toString());
    await job.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "Job deleted" });
  } catch (error) {
    console.log(error);
  }
}

async function showStats(req, res) {
  // console.log(req.user.userId);
  try {
    let stats = await JobModel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
    ]);
    stats = stats.reduce((acc, curr) => {
      const { _id, count } = curr;
      acc[_id] = count;
      return acc;
    }, {});

    const defaultStats = {
      declined: stats.declined || 0,
      pending: stats.pending || 0,
      interview: stats.interview || 0,
    };

    let monthlyApplications = await JobModel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
      { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
      .map((app) => {
        const {
          _id: { year, month },
          count,
        } = app;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM Y");
        return { date, count };
      })
      .reverse();

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  } catch (error) {
    console.log(error);
  }
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
