# Warp Power 🚀

Full-stack application featuring an Angular frontend and .NET 8 Web API backend with dual cloud deployment.

## Architecture

- **Frontend**: Angular (latest) → Deployed to Netlify
- **Backend**: .NET 8 Web API → Deployed to Azure App Service
- **CI/CD**: GitHub Actions for automated deployments

## Project Structure

```
warp-powers/
├── client/          # Angular application
├── server/          # .NET 8 Web API
├── .github/
│   └── workflows/   # GitHub Actions CI/CD
└── README.md
```

## Features

- 🎯 Angular standalone components with HTTP client
- ⚡ .NET 8 Web API with CORS configuration
- 🌐 Dual cloud deployment (Netlify + Azure)
- 🔄 Automated CI/CD pipeline with GitHub Actions
- 🎨 Modern responsive UI with CSS Grid
- 📡 RESTful API for managing "Warp Powers"

## Getting Started

### Prerequisites

- Node.js (for Angular)
- .NET 8 SDK
- Azure CLI
- Netlify CLI

### Local Development

1. **Start the API server:**
   ```bash
   cd server
   dotnet run
   # API runs on https://localhost:7136
   ```

2. **Start the Angular client:**
   ```bash
   cd client
   npm install
   ng serve
   # Client runs on http://localhost:4200
   ```

## Deployment

This project features automated deployment through GitHub Actions:

- **Push to main** → Triggers both deployments
- **Frontend** → Builds Angular app and deploys to Netlify
- **Backend** → Builds .NET API and deploys to Azure App Service

## Live Demo

- Frontend: [Netlify URL]
- API: [Azure App Service URL]

## API Endpoints

- `GET /api/powers` - Get all warp powers
- `GET /api/powers/{id}` - Get specific power
- `POST /api/powers` - Create new power

---

Built with ❤️ using Angular, .NET, and the power of dual cloud deployment!
