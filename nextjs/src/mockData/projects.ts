import { Project } from "@/types/data/project";

export const mockData: Project[] = [
  {
    id: 1,
    name: "Project 1",
    lastEdited: "2025-02-08 14:30",
    logo: "",
    description: "A web application for managing tasks efficiently.",
    longDescription: [
      "This project is designed to help users track their tasks and increase productivity. It features a simple, intuitive UI with drag-and-drop functionality to manage tasks effortlessly.",
      "The application is built using React and Node.js, ensuring fast and scalable performance. Tailwind CSS is used to provide a responsive design that adapts to different screen sizes.",
      "The app includes integration with popular task management APIs and can be customized for personal or team use.",
    ],
    skills: ["React", "Node.js", "Tailwind CSS"],
    website: "https://project1.example.com",
    github: "https://github.com/user/project1",
    images: [
      "https://example.com/images/project1-1.jpg",
      "https://example.com/images/project1-2.jpg",
      "https://example.com/images/project1-3.jpg",
    ],
  },
  {
    id: 2,
    name: "Project 2",
    lastEdited: "2025-02-09 09:15",
    logo: "",
    description: "An AI-powered chatbot for customer support.",
    longDescription: [
      "This project features an AI chatbot designed to assist customers with their queries and provide personalized support. It uses OpenAI's GPT-3 API to generate intelligent responses.",
      "The chatbot is integrated into a website using FastAPI for the backend, and Python is used for the implementation of logic and AI model handling.",
      "PostgreSQL is used to store customer data and interaction logs, allowing for better insights into customer behavior and support needs.",
    ],
    skills: ["Python", "FastAPI", "OpenAI API", "PostgreSQL"],
    website: "https://project2.example.com",
    github: "https://github.com/user/project2",
    images: [
      "https://example.com/images/project2-1.jpg",
      "https://example.com/images/project2-2.jpg",
    ],
  },
  {
    id: 3,
    name: "Project 3",
    lastEdited: "2025-02-10 18:45",
    logo: "",
    description: "A portfolio website with CMS integration.",
    longDescription: [
      "This project showcases a personal portfolio website built with Next.js. It includes a CMS that allows easy content management without touching the codebase.",
      "The CMS is API-driven and allows for flexible content creation and management. It integrates with a DynamoDB database to store portfolio data in a structured format.",
      "The website is optimized for both desktop and mobile views, ensuring a seamless experience for visitors.",
    ],
    skills: ["Next.js", "TypeScript", "DynamoDB"],
    website: "https://project3.example.com",
    github: "https://github.com/user/project3",
    images: [
      "https://example.com/images/project3-1.jpg",
      "https://example.com/images/project3-2.jpg",
    ],
  },
];
