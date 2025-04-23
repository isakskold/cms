import { Code, Terminal, Database, ExternalLink } from "lucide-react";
import { GuideProps } from "./types";

export const customGuide: GuideProps = {
  title: "Custom Integration Guide",
  description: "Learn how to integrate our API into your existing projects",
  steps: [
    {
      title: "Generate API Key",
      description: "First, generate an API key from your dashboard settings.",
      code: `// Store your API key securely
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
if (!API_KEY) throw new Error('API key is required');`,
      language: "javascript",
      icon: Code,
    },
    {
      title: "Make API Requests",
      description: "Use your API key to fetch content from our API.",
      code: `// Example API request
const fetchContent = async () => {
  const response = await fetch('https://api.example.com/content', {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};`,
      language: "javascript",
      icon: Terminal,
    },
    {
      title: "Display Content",
      description: "Process the API response and display your content.",
      code: `// React component example
function Portfolio() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    fetchContent()
      .then(data => setProjects(data.projects))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}`,
      language: "jsx",
      icon: Database,
    },
  ],
};

export const boilerplateGuide: GuideProps = {
  title: "Boilerplate Components Guide",
  description: "Quick start with our pre-built components",
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
