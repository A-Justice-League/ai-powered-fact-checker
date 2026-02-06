# Contributing to AI-Powered Fact Checker

We're excited that you want to contribute! To maintain code quality and project organization during the hackathon, please follow these guidelines.

## 🌿 Branching Strategy

We use a feature-branch workflow. **Do not commit directly to the `main` branch.**

- `main`: The stable, production-ready branch.
- `feature/[feature-name]`: New features or enhancements.
- `bugfix/[bug-name]`: Fixes for identified issues.
- `refactor/[refactor-name]`: Code improvements without functional changes.

### Naming Guidelines
- Use lowercase and hyphens (e.g., `feature/gemini-integration`).
- Keep names descriptive but concise.

## 🚀 How to Contribute

1.  **Select a Task**: Check the issues or the "Day-by-Day Plan" in the root README.
2.  **Create a Branch**:
    ```bash
    git checkout -b feature/your-awesome-feature
    ```
3.  **Make Your Changes**: Write clean, documented code.
4.  **Local Testing**: Ensure your changes don't break existing functionality.
5.  **Commit Your Changes**:
    ```bash
    git add .
    git commit -m "feat: add Google Search Grounding to backend"
    ```
    *Use [Conventional Commits](https://www.conventionalcommits.org/) if possible.*

## 🔃 Pull Requests (PRs)

All changes must be submitted via Pull Requests.

- **Title**: Clearly describe the change (e.g., `feat: Add image upload form`).
- **Description**: Explain *what* was changed and *why*.
- **Review**: At least one other team member should review the PR before it is merged into `main`.
- **Merge Style**: We prefer "Squash and Merge" to keep the main history clean.

## 🛠️ Development Standards

- **Backend**: Python 3.12+, FastAPI, follow PEP 8.
- **Frontend**: Next.js, React, Tailwind CSS.
- **Documentation**: Update the relevant README if you add new features or change setup steps.

## 💬 Communication

For quick discussions, use our primary chat channel (e.g., WhatsApp/Slack). For technical decisions, leave comments on the Pull Request.

Happy Coding! 🚀
