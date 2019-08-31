const express = require("express");

const projects = [];

// Request counter
let requestCount = 0;

// Server settings
const server = express();
server.use(express.json());
server.listen(3333);

/**
 * Middleware
 * Print log with the request ID number
 */
server.use((_, __, next) => {
  requestCount++;
  console.log(`Request ID: ${requestCount}`);
  return next();
});

/**
 * Set project data
 *
 * @param __id
 * @param __title
 *
 * @return full project data.
 */
function setProjectData(__id, __title) {
  return { id: __id, title: __title, tasks: [] };
}

/**
 * Add a new task to existing project.
 */
function addProjectTask(__id, __title) {
  const project = getProject(__id);
  project.tasks.push(__title);
  return project;
}

/**
 * Update project title.
 */
function updateProjectTitle(__id, __title) {
  const project = getProject(__id);
  project.title = __title;
  return project;
}

/**
 * Project Getter.
 */
function getProject(__id) {
  return projects.find(project => project.id == __id);
}

/**
 * Get project index.
 */
function getProjectIndex(__id) {
  return projects.findIndex(index => index.id == __id);
}

/**
 * Get request attributes.
 */
function getAttributes(req, _, next) {
  req.id = req.body.id;
  req.idParams = req.params.id;
  req.title = req.body.title;
  return next();
}

/**
 * Destroy project from array.
 */
function destroyProject(__id) {
  projects.splice(getProjectIndex(__id), 1);
  return "ok";
}

/**
 * Middleware
 * Before change one project, the system check if it exist.
 */
function checkBeforeChange(req, res, next) {
  if (!projectExist(req.idParams)) {
    return res.status(400).json({
      error: "Project does not exists!"
    });
  }
  return next();
}

/**
 * Middleware
 * Before create a new project, the system check if it exist.
 */
function checkBeforeCreate(req, res, next) {
  if (projectExist(req.id)) {
    return res.status(406).json({
      error: "This projects exist, you can not create a new one!"
    });
  }
  return next();
}

/**
 * Check is project exist
 *
 * @param __id
 *
 * @return boolean
 */
function projectExist(__id) {
  const project = projects.find(key => key.id == __id);
  if (project) {
    return true;
  } else return false;
}

/**
 * Create a new project.
 *
 * @return project informations
 */
function createProject(__id, __title) {
  const project = setProjectData(__id, __title);
  projects.push(project);
  return project;
}

// ##Core system

/**
 * Router /projects
 * Lista all projects saved.
 */
server.get("/projects", (_, res) => {
  return res.json(projects);
});

/**
 * Router /projects
 * Create a new project, with standard empty task.
 */
server.post("/project", getAttributes, checkBeforeCreate, (req, res) => {
  return res.json(createProject(req.id, req.title));
});

/**
 * Router /projects/:id/tasks
 * Add a new task inside a project.
 */
server.post(
  "/projects/:id/tasks",
  getAttributes,
  checkBeforeChange,
  (req, res) => {
    return res.json(addProjectTask(req.idParams, req.title));
  }
);

/**
 * Change existent project title.
 */
server.put("/projects/:id", getAttributes, checkBeforeChange, (req, res) => {
  return res.json(updateProjectTitle(req.idParams, req.title));
});

/**
 * Router /projects/:id
 * Delete a project.
 */
server.delete("/projects/:id", getAttributes, checkBeforeChange, (req, res) => {
  return res.json(destroyProject(req.idParams));
});
