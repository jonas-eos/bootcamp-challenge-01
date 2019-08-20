/**
 * Dependencies
 */
const express = require("express");

/**
 * Server settings
 */
const server = express();
server.use(express.json());

/**
 * Consts
 */
const projects = [];

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
 * Router /projects/:id
 * Change title of a project from id
 * @param {body, param} __request
 * @param __response
 *
 * @return projects updated
 */
server.put("/projects/:id", (__request, __response) => {
  const { id } = __request.params;
  const { title } = __request.body;
  const project = projects.find(index => index.id == id);
  project.title = title;
  return __response.json(projects);
});

/**
 * Server listen
 */
server.listen(8080);
