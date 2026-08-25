export const CURRICULUM: Record<
  string,
  {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
    project: string[];
  }
> = {
  docker: {
    beginner: [
      "Docker installation",
      "Containers vs VMs",
      "Docker CLI basics",
      "Images and containers",
      "Docker Hub",
    ],
    intermediate: [
      "Dockerfile",
      "Build custom image",
      "Volumes and bind mounts",
      "Environment variables",
      "Container networking",
    ],
    advanced: [
      "Docker Compose",
      "Multi-container apps",
      "Docker optimization",
      "Container debugging",
      "Docker security basics",
    ],
    project: [
      "Dockerize Express API",
      "Dockerize MongoDB",
      "Dockerize full MERN app",
      "Create docker-compose.yml",
      "Deploy containerized app locally",
    ],
  },

  aws: {
    beginner: [
      "AWS account setup",
      "AWS global infrastructure",
      "IAM users and roles",
      "AWS billing basics",
      "AWS CLI setup",
    ],
    intermediate: [
      "EC2 instances",
      "Security groups",
      "S3 buckets",
      "CloudWatch basics",
      "Elastic IP",
    ],
    advanced: [
      "Load balancer basics",
      "Auto scaling basics",
      "VPC basics",
      "RDS basics",
      "IAM policy design",
    ],
    project: [
      "Host static website on S3",
      "Deploy Node.js app on EC2",
      "Connect EC2 with MongoDB Atlas",
      "Configure monitoring",
      "Create deployment documentation",
    ],
  },

  typescript: {
    beginner: [
      "TypeScript setup",
      "Basic types",
      "Interfaces",
      "Functions in TypeScript",
      "Arrays and objects",
    ],
    intermediate: [
      "Generics",
      "Type aliases",
      "Classes",
      "Modules",
      "Enums and unions",
    ],
    advanced: [
      "Utility types",
      "Mapped types",
      "Conditional types",
      "Type narrowing",
      "Advanced inference",
    ],
    project: [
      "Convert Express app to TypeScript",
      "Create typed API responses",
      "Add validation types",
      "Create reusable types",
      "Refactor project with strict mode",
    ],
  },

  react: {
    beginner: [
      "JSX",
      "Components",
      "Props",
      "State management basics",
      "Event handling",
    ],
    intermediate: [
      "useEffect",
      "Forms and validation",
      "React Router",
      "API integration",
      "Custom hooks",
    ],
    advanced: [
      "Performance optimization",
      "Code splitting",
      "Context API",
      "Error boundaries",
      "React patterns",
    ],
    project: [
      "Build Todo app",
      "Build dashboard UI",
      "Integrate backend APIs",
      "Add authentication flow",
      "Deploy React app",
    ],
  },

  "node.js": {
    beginner: [
      "Node.js runtime",
      "NPM basics",
      "Modules",
      "File system module",
      "HTTP module",
    ],
    intermediate: [
      "Express routing",
      "Middleware",
      "Error handling",
      "Environment variables",
      "REST API design",
    ],
    advanced: [
      "Authentication with JWT",
      "File uploads",
      "Caching basics",
      "Rate limiting",
      "API security",
    ],
    project: [
      "Build authentication API",
      "Build CRUD API",
      "Connect MongoDB Atlas",
      "Add validation",
      "Deploy backend app",
    ],
  },
};