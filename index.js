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
const projects = {};

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
 * Server listen
 */
server.listen(8080);
