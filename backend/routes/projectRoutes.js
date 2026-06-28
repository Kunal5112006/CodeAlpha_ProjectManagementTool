const express = require("express");
const jwt = require("jsonwebtoken");
const Project = require("../models/Project");
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
        const { title, description } = req.body;

        const project = await Project.create({
            title,
            description,
            createdBy: req.user.id
        });

        res.status(201).json(project);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        await Task.deleteMany({ project: req.params.id });
        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: "Project deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;