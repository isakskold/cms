# Project Store Documentation

## Overview

This Zustand store manages project data and handles temporary edits. Currently, it initializes with mock data, but it will later be integrated with async CRUD operations to interact with a backend database.

## Store Structure

- **projects**: An array of project objects (persisted in local storage). This state should reflect the data in the cloud.
- **inputProject**: A temporary state for staging changes to be saved during editing. When user edits input field, it saves it to the inputProject state. Clicking on save will then store the inputProject state as the

## Actions

- **setProjects(projects: Project[])**: Sets the list of projects.
- **addProject(project: Project)**: Adds a new project.
- **updateProject(updatedProject: Project)**: Updates an existing project.
- **removeProject(id: number)**: Removes a project.
- **setInputProject(project: Project | null)**: Sets or clears the temporary editing state.

## Future Integration: Async CRUD Operations

In upcoming versions, the following changes will be implemented:

- **Fetch Projects**: Load project data from a database.
- **Add Project**: Create new projects via asynchronous API calls.
- **Update Project**: Persist changes by sending updates to a backend.
- **Remove Project**: Delete projects using async operations.

These async operations will replace the mock data initialization, ensuring real-time data persistence and retrieval.
