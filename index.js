const express = require("express");

// constant to save projects
const projects = [];

// Request counter
let requestCount = 0;

// Server settings
const server = express();
server.use(express.json());
server.listen(8080);

/**
 * Middleware
 * Print log with the request ID number
 */
server.use((__request, __response, __next) => {
  requestCount++;
  console.log(`Request ID: ${requestCount}`);
  return __next();
});

/**
 * Middleware
 * Before change one project, the system check if it exist.
 */
function checkBeforeChange(__request, __response, __next) {
  const { id } = __request.params;
  if (projectExist(id) == false) {
    return __response.status(406).json({
      error: "Project does not exists!"
    });
  }
  return __next();
}

/**
 * Middleware
 * Before create a new project, the system check if it exist.
 */
function checkBeforeCreate(__request, __response, __next) {
  const { id } = __request.body;
  if (projectExist(id) == true) {
    return __response.status(406).json({
      error: "This projects exist, you can not create a new one!"
    });
  }
  return __next();
}

/**
 * Check is project exist
 *
 * @param __id
 *
 * @return boolean
 */
function projectExist(__id) {
  const project = projects.find(index => index.id == __id);
  if (project) {
    return true;
  } else return false;
}

// ##Core system

/**
 * Router /projects
 * Lista all projects saved.
 */
server.get("/projects", (__request, __response) => {
  return __response.json(projects);
});

/**
 * Router /projects
 * Create a new project, with standard empty task.
 */
server.post("/projects", checkBeforeCreate, (__request, __response) => {
  const { id, title } = __request.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return __response.json(projects);
});

/**
 * Router /projects/:id/tasks
 * Add a new task inside a project.
 */
server.post(
  "/projects/:id/tasks",
  checkBeforeChange,
  (__request, __response) => {
    const { id } = __request.params;
    const { title } = __request.body;
    const project = projects.find(index => index.id == id);
    project.tasks.push(title);
    return __response.json(projects);
  }
);

/**
 * Router /projects/:id
 * Change title of a project.
 */
server.put("/projects/:id", checkBeforeChange, (__request, __response) => {
  const { id } = __request.params;
  const { title } = __request.body;
  const project = projects.find(index => index.id == id);
  project.title = title;
  return __response.json(projects);
});

/**
 * Router /projects/:id
 * Delete a project.
 */
server.delete("/projects/:id", checkBeforeChange, (__request, __response) => {
  const { id } = __request.params;
  const projectIndex = projects.findIndex(index => index.id == id);
  projects.splice(projectIndex, 1);
  return __response.json(projects);
});
