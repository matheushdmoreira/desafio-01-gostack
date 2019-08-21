const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not found." });
  }

  return next();
}

/**
 * Middleware que da log no número de requisições
 */
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de Requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

/**
 * Projects
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

/**
 * Tasks
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
