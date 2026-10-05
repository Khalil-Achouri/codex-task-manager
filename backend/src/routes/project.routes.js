const express = require('express');

const Project = require('../models/Project');
const User = require('../models/User');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

function populateProject(query) {
  return query
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .populate('tasks.assignedTo', 'name email');
}

/*
 * Public: all projects.
 * We expose project information but not private user credentials.
 */
router.get('/', async (req, res) => {
  try {
    const projects = await populateProject(
      Project.find().sort({ createdAt: -1 })
    );

    res.json(projects);
  } catch {
    res.status(500).json({ message: 'Could not load projects' });
  }
});

/*
 * Protected: projects owned by the logged-in user.
 * This must be before /:id so 'user' is not treated as a project id.
 */
router.get('/user/mine/list', authenticate, async (req, res) => {
  try {
    const projects = await populateProject(
      Project.find({ owner: req.user.id }).sort({ createdAt: -1 })
    );

    res.json(projects);
  } catch {
    res.status(500).json({ message: 'Could not load your projects' });
  }
});

/*
 * Public: one project.
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await populateProject(
      Project.findById(req.params.id)
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch {
    res.status(400).json({ message: 'Invalid project id' });
  }
});

/*
 * Protected: create a project.
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description || '',
      status: status || 'In Progress',
      owner: req.user.id,
      members: [req.user.id]
    });

    const result = await populateProject(
      Project.findById(project._id)
    );

    res.status(201).json(result);
  } catch {
    res.status(500).json({ message: 'Could not create project' });
  }
});

/*
 * Protected: update a project owned by the logged-in user.
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not owned by you' });
    }

    if (req.body.title !== undefined) project.title = req.body.title;
    if (req.body.description !== undefined) project.description = req.body.description;
    if (req.body.status !== undefined) project.status = req.body.status;

    await project.save();

    const result = await populateProject(
      Project.findById(project._id)
    );

    res.json(result);
  } catch {
    res.status(400).json({ message: 'Could not update project' });
  }
});

/*
 * Protected: delete a project owned by the logged-in user.
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found or not owned by you' });
    }

    res.json({ message: 'Project deleted' });
  } catch {
    res.status(400).json({ message: 'Could not delete project' });
  }
});

/*
 * Protected: add a task.
 */
router.post('/:id/tasks', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not owned by you' });
    }

    const { title, description, status, assignedTo } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (assignedTo) {
      const isMember = project.members.some(
        memberId => memberId.toString() === assignedTo
      );

      if (!isMember) {
        return res.status(400).json({ message: 'Task must be assigned to a project member' });
      }
    }

    project.tasks.push({
      title: title.trim(),
      description: description || '',
      status: status || 'Pending',
      assignedTo: assignedTo || null
    });

    await project.save();

    const result = await populateProject(
      Project.findById(project._id)
    );

    res.status(201).json(result);
  } catch {
    res.status(400).json({ message: 'Could not create task' });
  }
});

/*
 * Protected: update a task.
 */
router.put('/:projectId/tasks/:taskId', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not owned by you' });
    }

    const task = project.tasks.id(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo || null;

    await project.save();

    const result = await populateProject(
      Project.findById(project._id)
    );

    res.json(result);
  } catch {
    res.status(400).json({ message: 'Could not update task' });
  }
});

/*
 * Protected: delete a task.
 */
router.delete('/:projectId/tasks/:taskId', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not owned by you' });
    }

    const task = project.tasks.id(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.deleteOne();
    await project.save();

    res.json({ message: 'Task deleted' });
  } catch {
    res.status(400).json({ message: 'Could not delete task' });
  }
});

/*
 * Protected: add a registered user to a project.
 * This is a small replacement for the future admin assignment feature.
 */
router.post('/:id/members/:userId', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not owned by you' });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!project.members.some(id => id.toString() === user._id.toString())) {
      project.members.push(user._id);
      await project.save();
    }

    const result = await populateProject(
      Project.findById(project._id)
    );

    res.json(result);
  } catch {
    res.status(400).json({ message: 'Could not add member' });
  }
});

module.exports = router;
