const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

const router = express.Router();

function protect(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

router.post("/", protect, async (req, res) => {
    try {
        const { title, description, status, project } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            project
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:projectId", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.json(task);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/comments", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        task.comments.push({
            text: req.body.text
        });

        await task.save();

        res.json(task);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;