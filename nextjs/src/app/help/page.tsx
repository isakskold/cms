"use client";
import { useState } from "react";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  prism,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  ExternalLink,
  Terminal,
  Database,
  Code,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

// Types
interface GuideStepProps {
  title: string;
  description: string;
  code?: string;
  language?: string;
  icon?: React.ElementType;
}

interface GuideProps {
  title: string;
  description: string;
  steps: GuideStepProps[];
}

// Step Component
const GuideStep: React.FC<GuideStepProps> = ({
  title,
  description,
  code,
  language,
  icon: Icon,
}) => {
  const { isDarkMode } = useThemeStore();
  const codeStyle = isDarkMode ? tomorrow : prism;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        {description}
      </p>

      {code && language && (
        <div className="w-full">
          <div className="flex justify-start mb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    Copy code
                  </span>
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <div className="min-w-max">
              <SyntaxHighlighter
                language={language}
                style={codeStyle}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  padding: "1rem",
                  background: isDarkMode ? "#1f2937" : "#f3f4f6",
                }}
                wrapLongLines={false}
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Guide Component
const Guide: React.FC<GuideProps> = ({ title, description, steps }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <GuideStep key={index} {...step} />
        ))}
      </div>
    </div>
  );
};

// Main Help Page
export default function Help() {
  const [selectedGuide, setSelectedGuide] = useState<
    "custom" | "boilerplate" | null
  >(null);

  // Example code snippets
  const customGuide: GuideProps = {
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

  const boilerplateGuide: GuideProps = {
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

  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Guide Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() =>
              setSelectedGuide(selectedGuide === "custom" ? null : "custom")
            }
            className={`p-6 rounded-lg border transition-all ${
              selectedGuide === "custom"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Custom Integration
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Build your own integration using our API
                </p>
              </div>
              {selectedGuide === "custom" ? (
                <ChevronUp className="w-5 h-5 text-blue-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          <button
            onClick={() =>
              setSelectedGuide(
                selectedGuide === "boilerplate" ? null : "boilerplate"
              )
            }
            className={`p-6 rounded-lg border transition-all ${
              selectedGuide === "boilerplate"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Boilerplate Components
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Use our pre-built components for quick integration
                </p>
              </div>
              {selectedGuide === "boilerplate" ? (
                <ChevronUp className="w-5 h-5 text-blue-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>
        </div>

        {/* Guide Content */}
        <div className="overflow-x-auto">
          {selectedGuide === "custom" && <Guide {...customGuide} />}
          {selectedGuide === "boilerplate" && <Guide {...boilerplateGuide} />}
        </div>
      </div>
    </div>
  );
}
