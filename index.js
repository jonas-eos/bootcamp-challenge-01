/**
 * Dependencies
 */
const express = require("express");

/**
 * Consts
 */
const projects = [];

// Counter
let requestCount = 0;

/**
 * Server settings
 */
const server = express();
server.use(express.json());

/**
 * Middlewares
 */

/**
 * Middleware
 * Print log with request ID
 * @param __request
 * @param __response
 * @param __next
 *
 * @return console with request ID.
 */
server.use((__request, __response, __next) => {
  requestCount++;
  console.log(`Request ID: ${requestCount}`);
  return __next();
});

/**
 * Middleware
 * Check if exist a project by ID params
 * @param __request
 * @param __response
 * @param __next
 *
 * @return next call
 */
function checkProjectExists(__request, __response, __next) {
  const { id } = __request.params;
  const project = projects.find(index => index.id == id);
  if (!project) {
    return __response.status(400).json({
      error: "Project does not exists!"
    });
  }
  return __next();
}

/**
 * Core system
 */

/**
 * Router /projects
 * Lista all projects saved
 * @param __request
 * @param __response
 *
 * @return projects array
 */
server.get("/projects", (__request, __response) => {
  return __response.json(projects);
});

/**
 * Router /projects
 * Lista all projects saved
 * @param {body} __request
 * @param __response
 *
 * @return new projects array
 */
server.post("/projects", (__request, __response) => {
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
 * Add a new task to a project id
 * @param {param, body} __request
 * @param __response
 *
 * @return projects updated
 */
server.post(
  "/projects/:id/tasks",
  checkProjectExists,
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
 * Change title of a project from id
 * @param {body, param} __request
 * @param __response
 *
 * @return projects updated
 */
server.put("/projects/:id", checkProjectExists, (__request, __response) => {
  const { id } = __request.params;
  const { title } = __request.body;
  const project = projects.find(index => index.id == id);
  project.title = title;
  return __response.json(projects);
});

/**
 * Router /projects/:id
 * Delete a project with id value
 * @param {param} __request
 * @param __response
 *
 * @return projects updated
 */
server.delete("/projects/:id", checkProjectExists, (__request, __response) => {
  const { id } = __request.params;
  const projectIndex = projects.findIndex(index => index.id == id);
  projects.splice(projectIndex, 1);
  return __response.json(projects);
});

/**
 * Server listen
 */
server.listen(8080);
