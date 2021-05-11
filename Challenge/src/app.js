const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, res, next) {
  const { method, url } = req

  const logLabels = `[${method.toUpperCase()}] ${url}`

  console.time(logLabels)

  next()

  console.timeEnd(logLabels)
}

function validateRepositoriesId(req, res, next) {
  const { id } = req.params

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repositorie ID' })
  }

  return next()
}

app.use(logRequests)
app.use('/repositories/:id', validateRepositoriesId)

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const repositorie = {
    id: uuid(),
    title, 
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return res.json(repositorie)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id = id)

  if (repositorieIndex < 0) {
    return res.status(400).json({ error: 'Repositorie not found' })
  }

  const repositorie = {
    id,
    title,
    url,
    techs
  }

  repositories[repositorieIndex] = repositorie

  return res.json(repositorie)

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id = id)

  if (repositorieIndex < 0) {
    return res.status(400).json({ error: 'Repositorie not found' })
  }

  repositories.splice(repositorieIndex, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) {
    return res.status(400).json({ error: 'Repositorie not found' })
  }

  const { title, url, techs, likes } = repositories[repositorieIndex]

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: likes + 1
  }

  repositories[repositorieIndex] = repositorie

  console.log(repositorie)

  return res.json(repositorie)

});

module.exports = app;
