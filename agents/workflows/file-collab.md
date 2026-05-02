---
description: Workflow for multi-agent collaboration via the File Agent
---

# Agent Collaboration Workflow

This workflow ensures that specialized agents (Product Manager, UX Designer, Software Developer) can collaborate seamlessly by using the **File Agent** as a central coordinator.

## Hand-off Procedure

### 1. Identify the Dependency
When a specialized agent finishes a task (e.g., the PM completes the `product_strategy.md`), they must identify which agent needs this information next.

### 2. Prepare the Hand-off Artifact
The "sending agent" creates or updates a file in the project directory that clearly defines the requirements for the "receiving agent."

### 3. Notify the File Agent
The specialized agent should "call" the File Agent with the following information:
- **Source File:** Path to the completed artifact.
- **Target Agent:** The persona that should take over next (e.g., "UX Designer").
- **Task Summary:** A brief explanation of what needs to be done with the source file.

### 4. File Agent Validation
// turbo
1.  Verify the source file exists and is complete.
2.  Update the `project_map.md` with the new file status.
3.  Move or copy files if necessary into specialized "draft" or "work-in-progress" directories.
4.  Output a "Ready for [Agent Name]" status in the project logs.

### 5. Task Acceptance
The "receiving agent" reads the File Agent's latest project map update and begins their specialized task.

## Conflict Resolution
If a "receiving agent" finds gaps in the hand-off artifact, they must document the missing requirements in a `FEEDBACK.md` file and request the File Agent to "hand back" the task to the original agent.
