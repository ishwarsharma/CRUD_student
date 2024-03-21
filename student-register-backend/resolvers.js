const { Student } = require("./models/Student.js");

// GraphQL Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello from Reflectoring Blog",
    welcome: (_, args) => `Hello ${args.name}`,
    students: async () => await Student.find({}),
    student: async (_, args) => await Student.findById(args.id),
  },
  Mutation: {
    create: async (_, args) => {
      const { firstName, lastName, age } = args;
      const newStudent = new Student({
        firstName,
        lastName,
        age,
      });
      await newStudent.save();
      return newStudent;
    },
    update: async (_, args) => {
      const { id } = args;
      const updatedStudent = await Student.findByIdAndUpdate(id, args);
      if (!updatedStudent) {
        throw new Error(`Student with ID ${id} not found`);
      }
      return updatedStudent;
    },
    delete: async (_, args) => {
      const { id } = args;
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        throw new Error(`Student with ID ${id} not found`);
      }
      return deletedStudent;
    },
  },
};

module.exports = { resolvers };