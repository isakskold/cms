import { Code, Terminal, Database, ExternalLink } from "lucide-react";
import { GuideProps } from "./types";

export const customGuide: GuideProps = {
  title: "API Integration Guide",
  description: "Learn how to fetch your portfolio data using our API",
  steps: [
    {
      title: "Generate API Key",
      description:
        "First, go to your dashboard settings to generate a new API key that you'll use for authentication.",
      code: `// Once generated, store your API key securely
// Create a .env.local file in your Next.js project root and add:
API_KEY=your-generated-api-key
USER_EMAIL=your-email@example.com`,
      language: "bash",
      icon: Code,
    },
    {
      title: "Set Up API Call",
      description:
        "Create a function to fetch your projects using your API key and email.",
      code: `// app/api/projects/route.ts or any component file
async function fetchProjects() {
  try {
    const response = await fetch('https://2upf63jpgg.execute-api.eu-north-1.amazonaws.com/public', {
      headers: {
        'x-api-key': process.env.API_KEY,
        'x-user-email': process.env.USER_EMAIL,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Fetched projects:', data);
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}`,
      language: "typescript",
      icon: Terminal,
    },
    {
      title: "Test Your Integration",
      description:
        "You can now call this function wherever you need to fetch your projects. Here's a basic example:",
      code: `// Example usage in a Next.js component
'use client';

import { useEffect } from 'react';
// Don't forget to import the fetchProjects function from where you defined it
import { fetchProjects } from '@/app/api/projects/route';

export default function ProjectsPage() {
  useEffect(() => {
    fetchProjects()
      .then(data => {
        // Your projects are in data.projects
        console.log('Your projects:', data.projects);
      })
      .catch(error => console.error(error));
  }, []);

  return <div>Check your console to see the fetched data!</div>;
}`,
      language: "tsx",
      icon: Database,
    },
  ],
};

export const boilerplateGuide: GuideProps = {
  title: "Boilerplate Components Guide (NOT IMPLEMENTED YET)",
  description:
    "Quick start with our pre-built components (currently unavailable)",
  steps: [
    {
      title: "Install Package",
      description: "Add our component library to your project.",
      code: `npm install @example/portfolio-components

# or with yarn
yarn add @example/portfolio-components`,
      language: "bash",
      icon: Terminal,
    },
    {
      title: "Import Components",
      description: "Import and use our pre-built components.",
      code: `import { Portfolio, ProjectCard } from '@example/portfolio-components';

function App() {
  return (
    <Portfolio 
      apiKey={process.env.NEXT_PUBLIC_API_KEY}
      theme="dark"
      layout="grid"
    />
  );
}`,
      language: "jsx",
      icon: Code,
    },
    {
      title: "Customize Components",
      description: "Customize the appearance and behavior of components.",
      code: `// Custom theme configuration
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#1f2937',
    accent: '#f59e0b',
  },
  layout: {
    spacing: '1.5rem',
    borderRadius: '0.5rem',
  }
};

<Portfolio theme={theme} />`,
      language: "javascript",
      icon: ExternalLink,
    },
  ],
};
