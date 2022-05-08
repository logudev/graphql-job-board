import { Job, Company } from "./db.js";

export const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: async () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      return Job.create({ title, description, companyId: user.companyId });
    },
    deleteJob: async (_root, { id }, { user }) => {
      // id -> jobId
      // Before deleting, check if user is authenticated and is deleting job of his company
      if (!user) {
        throw new Error("Unauthorized");
      }
      const job = await Job.findById(id);
      if (job.companyId !== user.companyId) {
        throw new Error("You are not allowed to delete this company job");
      }
      return Job.delete(id);
    },
    updateJob: async (_root, { input }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const job = await Job.findById(input.id);
      if (job.companyId !== user.companyId) {
        throw new Error("You are not allowed to update this company job");
      }
      return Job.update({ ...input, companyId: user.companyId });
    },
  },

  Job: {
    company: (parent) => {
      return Company.findById(parent.companyId);
    },
  },

  Company: {
    jobs: async (parent) => {
      const allJobs = await Job.findAll();
      const companyJobs = allJobs.filter((job) => job.companyId === parent.id);
      return companyJobs;
    },
  },
};
