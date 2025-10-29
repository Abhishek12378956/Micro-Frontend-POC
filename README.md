# Micro-Frontend Architecture with Module Federation

A Proof of Concept demonstrating a modular micro-frontend architecture built with React and Vite's Module Federation, featuring isolated applications that can be developed and deployed independently while sharing a common design system and communicating through an event bus.

##  Architecture Overview

This project implements a micro-frontend architecture using Vite's Module Federation, consisting of:

###  Main Application (Host)
- Serves as the wrapper for all micro-applications
- Manages the global design system and shared components
- Provides navigation and routing infrastructure
- Handles cross-application communication via event bus
- Responsive design that works on both desktop and mobile devices

###  Chat Application (Micro-Frontend)
- Standalone application for messaging functionality
- Independent development and deployment
- Features contact list, message threads, and real-time status
- Responsive design with collapsible sidebar for mobile
- Real-time message notifications

###  Email Application (Micro-Frontend)
- Standalone application for email management
- Inbox view with email listing and reading
- Email composition with rich text support
- Reply and forward functionality
- Email notifications with sender information
- Responsive design for all screen sizes

##  Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Basic understanding of React and TypeScript

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd micro-frontend-poc/Abhishek Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server with a single command:

```bash
npm run dev
```

This will start the application and make it available at:
`http://localhost:8080`



### Available Scripts

- `npm run dev` - Start all applications in parallel (host, chat, and email)
- `npm run build` - Build all applications for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

##  Technologies Used

### Core
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Zod** - Runtime type validation

### UI Components & Styling
- **Shadcn/UI** - Reusable UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set
- **class-variance-authority** - Component variant management
- **clsx** - Conditional class name utility
- **tailwind-merge** - Merge Tailwind classes

### State Management & Data
- **Zustand** - Lightweight state management
- **date-fns** - Date formatting utilities
- **lodash.debounce** - Debounce function for search

### Module Federation
- **@originjs/vite-plugin-federation** - Module Federation for Vite
- **vite-plugin-static-copy** - For static asset handling
- **npm-run-all** - Run multiple npm-scripts in parallel

### Development Tools
- **ESLint** - JavaScript/TypeScript linter
- **Prettier** - Code formatter
- **Husky** - Git hooks
- **lint-staged** - Run linters on git staged files
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework with responsive design
- **shadcn/ui** - High-quality React component library
- **date-fns** - Date formatting utilities
- **Lucide React** - Beautiful icon set
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

##  Key Features

- **Responsive Design**
  - Mobile-first approach with responsive breakpoints
  - Collapsible navigation for smaller screens
  - Optimized layouts for all device sizes

- **Email System**
  - Compose, reply, and forward emails
  - Email notifications with sender details
  - Star and archive functionality

- **Chat System**
  - Real-time messaging
  - Online/offline status
  - Message notifications

- **Shared State**
  - Global notifications system
  - Consistent theming and styling
  - Shared UI components

##  Project Structure

```
src/
├── host/                    # Main host application
│   └── components/
│       ├── Header.tsx       # Global header with notifications
│       └── Navigation.tsx   # App navigation sidebar
│
├── micro-apps/              # Micro-frontend applications
│   ├── chat/
│   │   ├── ChatApp.tsx      # Chat micro-frontend entry
│   │   ├── components/      # Chat-specific components
│   │   └── data/            # Mock data for chat
│   │
│   └── email/
│       ├── EmailApp.tsx     # Email micro-frontend entry
│       ├── components/      # Email-specific components
│       └── data/            # Mock data for email
│
├── shared/                  # Shared resources
│   ├── components/          # Reusable UI components
│   └── types.ts             # Shared TypeScript types
│
├── lib/
│   ├── event-bus.ts         # Event-based communication system
│   └── utils.ts             # Utility functions
│
├── components/ui/           # Design system components (shadcn/ui)
├── pages/                   # Route pages
└── index.css                # Global styles & design tokens

```

##  Getting Started

### Prerequisites
- Node.js 16+ and npm installed ([Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

##  Key Features

### 1. Modular Architecture
- Each micro-frontend is independently developed
- Clear separation of concerns
- Easy to add new micro-applications

### 2. Design System
- Centralized design tokens in `src/index.css`
- Consistent theming across all applications
- HSL-based color system for light/dark mode support
- Reusable UI components via shadcn/ui

### 3. Event-Based Communication
- Loose coupling between micro-frontends
- Event bus for inter-application messaging
- Type-safe event definitions

### 4. Scalability
- Architecture supports addition of new micro-frontends
- Shared components prevent code duplication
- Independent deployment capability (in production setup)

##  Architectural Decisions

### Why Module Federation Alternative?
In a production environment, we would use Webpack Module Federation or similar technology. For this POC, we simulate the architecture using:
- Separate folders for each micro-app
- Lazy loading of components
- Event-based communication
- Shared design system

### Communication Pattern
**Event Bus** was chosen over other patterns because:
- Loose coupling between applications
- Easy to debug and test
- Simple to extend with new events
- No direct dependencies between micro-frontends

### Design System Management
The host application manages the design system because:
- Ensures consistency across all micro-frontends
- Single source of truth for styling
- Easy to update globally
- Prevents style conflicts

##  Trade-offs

### Advantages
 Independent development of features  
 Technology flexibility per micro-frontend  
 Easier testing and maintenance  
 Scalable team structure  
 Incremental updates possible  

### Challenges
 Initial setup complexity  
 Requires careful communication design  
 Potential for duplicate dependencies  
 Cross-cutting concerns need coordination  

##  Future Enhancements

- **Module Federation**: Implement true runtime integration with Webpack Module Federation
- **Authentication**: Add shared authentication context
- **State Management**: Implement shared state solution (Redux, Zustand)
- **Backend Integration**: Connect to real APIs
- **CI/CD Pipeline**: Separate deployment pipelines per micro-frontend
- **Performance Monitoring**: Add application performance tracking
- **Error Boundaries**: Implement per-micro-frontend error handling

##  Development Guidelines

### Adding a New Micro-Frontend

1. Create new folder in `src/micro-apps/[app-name]`
2. Build the application entry component
3. Add route in `src/App.tsx`
4. Add navigation item in `src/host/components/Navigation.tsx`
5. Define any new events in `src/lib/event-bus.ts`
6. Add shared types to `src/shared/types.ts` if needed

### Shared Component Best Practices

- Place truly shared components in `src/shared/components/`
- Keep micro-app-specific components within their folders
- Use design tokens from `src/index.css`
- Follow TypeScript strict mode

##  Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

##  Links

- **Live Demo**: [Your Deployment URL]
- **Documentation**: See inline code comments for detailed explanations
- **Design System**: View `src/index.css` for design tokens

##  License

This is a POC project for evaluation purposes.

---

**Built with  using React and modern web technologies**
