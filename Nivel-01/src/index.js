const express = require('express');
const { v4: uuidv4 } = require('uuid')
const { isUuid } = require('uuidv4')

const app = express();

app.use(express.json())

const projects = []

function logRequests(req, res, next) {
  const { method, url } = req

  const logLabels = `[${method.toUpperCase()}] ${url}`

  console.time(logLabels)

  next()

  console.timeEnd(logLabels)
}

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid project ID' })
  }

  return next()
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId)

app.get('/projects', (req, res) => {
  const { title } = req.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

  return res.json(results)
});

app.post('/projects', (req, res) => {
  const { title, owner } = req.body

  const project = { id: uuidv4(), title, owner }

  projects.push(project)

  return res.json(project)
})

app.put('/projects/:id', (req, res) => {
  const { id } = req.params
  const { title, owner } = req.body

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Projeto not found' })
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project

  return res.json(project)
})

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Projeto not found' })
  }

  projects.splice(projectIndex, 1)

  return res.status(204).send()
})


app.listen(3333, () => {
  console.log('🚀 Back-end started')
})