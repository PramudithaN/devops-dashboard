import { ObjectId } from "mongodb";

export interface Repo {
  _id?: ObjectId;
  name: string;
  url: string;
  lastBuildStatus: string;
  lastBuildTime: Date;
}

export interface Build {
  _id?: ObjectId;
  repoId: ObjectId;
  status: "success" | "failed";
  commitHash: string;
  duration: number;
  timestamp: Date;
}
