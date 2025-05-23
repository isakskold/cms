"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CustomField } from "@/types/data/project";
import Image from "next/image";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import {
  getPanelClasses,
  getHeadingClasses,
  getTextClasses,
  getSecondaryBgClasses,
} from "@/utils/darkModeClasses";

interface Props {
  fields: CustomField[];
  onUpdate: (fields: CustomField[]) => void;
}

// Define templates for common field configurations
const templates = [
  {
    name: "Basic Project",
    fields: [
      {
        id: "field-logo",
        name: "Logo",
        type: "input" as const,
        value: "",
      },
      {
        id: "field-website",
        name: "Website",
        type: "input" as const,
        value: "",
      },
      {
        id: "field-github",
        name: "Github",
        type: "input" as const,
        value: "",
      },
    ],
  },
  {
    name: "Technical Project",
    fields: [
      {
        id: "field-logo",
        name: "Logo",
        type: "input" as const,
        value: "",
      },
      {
        id: "field-skills",
        name: "Skills",
        type: "multiselect" as const,
        value: [],
      },
      {
        id: "field-website",
        name: "Website",
        type: "input" as const,
        value: "",
      },
      {
        id: "field-github",
        name: "Github",
        type: "input" as const,
        value: "",
      },
    ],
  },
  {
    name: "Creative Project",
    fields: [
      {
        id: "field-logo",
        name: "Logo",
        type: "input" as const,
        value: "",
      },
      {
        id: "field-longDescription",
        name: "Long Description",
        type: "textarea" as const,
        value: "",
      },
      {
        id: "field-images",
        name: "Images",
        type: "image" as const,
        value: [],
      },
    ],
  },
];

const EditFields: React.FC<Props> = ({ fields, onUpdate }) => {
  const { isDarkMode } = useThemeStore();
  const [newField, setNewField] = useState<Partial<CustomField>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Define default fields using useMemo
  const defaultFields = useMemo<CustomField[]>(
    () => [
      {
        id: "field-name",
        name: "Name",
        type: "input" as const,
        value: "",
      },
      {
        id: "field-description",
        name: "Description",
        type: "input" as const,
        value: "",
      },
    ],
    []
  );

  // Initialize fields with defaults if empty
  useEffect(() => {
    if (fields.length === 0) {
      onUpdate(defaultFields);
    }
  }, [fields.length, onUpdate, defaultFields]);

  const fieldTypes = [
    { label: "Text Input", value: "input" },
    { label: "Text Area", value: "textarea" },
    { label: "Multiple Selection", value: "multiselect" },
    { label: "Image Gallery", value: "image" },
  ];

  // Simple URL validation for image URLs
  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  };

  const handleAddField = () => {
    if (!newField.name || !newField.type) return;

    const field: CustomField = {
      id: crypto.randomUUID(),
      name: newField.name,
      type: newField.type as CustomField["type"],
      value:
        newField.type === "multiselect" || newField.type === "image" ? [] : "",
    };

    onUpdate([...fields, field]);
    setNewField({});
  };

  const handleUpdateField = (id: string, value: string | string[]) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        // For image and multiselect fields, ensure the value is always an array
        if (field.type === "image" || field.type === "multiselect") {
          const arrayValue = Array.isArray(value) ? value : [value];
          return { ...field, value: arrayValue };
        }
        return { ...field, value };
      }
      return field;
    });
    onUpdate(updated);
  };

  const handleRemoveField = (id: string) => {
    onUpdate(fields.filter((field) => field.id !== id));
    // Clean up the input value for this field
    setInputValues((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleAddMultiselectValue = (fieldId: string) => {
    const inputValue = inputValues[fieldId]?.trim();
    if (!inputValue) return;

    const field = fields.find((f) => f.id === fieldId);
    if (!field || (field.type !== "multiselect" && field.type !== "image"))
      return;

    // For Images field, validate URL
    if (field.type === "image" && !isValidImageUrl(inputValue)) {
      alert(
        "Please enter a valid image URL (must start with http:// or https://)"
      );
      return;
    }

    // Get current values as array and add new value
    const currentValues = Array.isArray(field.value) ? field.value : [];
    const updatedValue = [...currentValues, inputValue];
    handleUpdateField(fieldId, updatedValue);

    // Clear only this field's input
    setInputValues((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  };

  const handleRemoveMultiselectValue = (
    fieldId: string,
    valueToRemove: string
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || (field.type !== "multiselect" && field.type !== "image"))
      return;

    // Get current values as array and remove the specified value
    const currentValues = Array.isArray(field.value) ? field.value : [];
    const updatedValue = currentValues.filter((v) => v !== valueToRemove);
    handleUpdateField(fieldId, updatedValue);
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;

    const template = templates.find((t) => t.name === selectedTemplate);
    if (!template) return;

    // Get current name and description values
    const currentName = fields.find((f) => f.id === "field-name")?.value || "";
    const currentDescription =
      fields.find((f) => f.id === "field-description")?.value || "";

    // Apply template while preserving name and description values
    const newFields = [
      {
        id: "field-name",
        name: "Name",
        type: "input" as const,
        value: currentName,
      },
      {
        id: "field-description",
        name: "Description",
        type: "input" as const,
        value: currentDescription,
      },
      ...template.fields,
    ];

    onUpdate(newFields);
    setSelectedTemplate("");
  };

  const handleClearAllFields = () => {
    // Get current name and description values
    const currentName = fields.find((f) => f.id === "field-name")?.value || "";
    const currentDescription =
      fields.find((f) => f.id === "field-description")?.value || "";

    // Clear all fields except name and description, preserving their values
    onUpdate([
      {
        id: "field-name",
        name: "Name",
        type: "input" as const,
        value: currentName,
      },
      {
        id: "field-description",
        name: "Description",
        type: "input" as const,
        value: currentDescription,
      },
    ]);
    setInputValues({});
  };

  return (
    <div className="space-y-8">
      {/* Template and New Field sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Apply Template section */}
        <div
          className={`${getPanelClasses(isDarkMode)} p-6 rounded-lg shadow-sm`}
        >
          <h3
            className={`${getHeadingClasses(
              isDarkMode
            )} text-lg font-semibold mb-4`}
          >
            Apply a Template
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className={`${getTextClasses(
                  isDarkMode
                )} block text-sm font-medium`}
              >
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className={`${getSecondaryBgClasses(
                  isDarkMode
                )} ${getTextClasses(
                  isDarkMode
                )} mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.25vw,1rem)] focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:shadow-[0_4px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleApplyTemplate}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Apply Template
            </button>
          </div>
        </div>

        {/* Create New Field section */}
        <div
          className={`${getPanelClasses(isDarkMode)} p-6 rounded-lg shadow-sm`}
        >
          <h3
            className={`${getHeadingClasses(
              isDarkMode
            )} text-lg font-semibold mb-4`}
          >
            Create New Field
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className={`${getTextClasses(
                  isDarkMode
                )} block text-sm font-medium`}
              >
                Field Name
              </label>
              <input
                type="text"
                value={newField.name || ""}
                onChange={(e) =>
                  setNewField({ ...newField, name: e.target.value })
                }
                placeholder="Enter field name"
                className={`${getSecondaryBgClasses(
                  isDarkMode
                )} ${getTextClasses(
                  isDarkMode
                )} mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.25vw,1rem)] focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:shadow-[0_4px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out`}
              />
            </div>
            <div>
              <label
                className={`${getTextClasses(
                  isDarkMode
                )} block text-sm font-medium`}
              >
                Field Type
              </label>
              <select
                value={newField.type || ""}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    type: e.target.value as CustomField["type"],
                  })
                }
                className={`${getSecondaryBgClasses(
                  isDarkMode
                )} ${getTextClasses(
                  isDarkMode
                )} mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.25vw,1rem)] focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:shadow-[0_4px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
              >
                <option value="">Select type...</option>
                {fieldTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddField}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Add Field
            </button>
          </div>
        </div>
      </div>

      {/* Fields Display section */}
      <div
        className={`${getPanelClasses(isDarkMode)} p-6 rounded-lg shadow-sm`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`${getHeadingClasses(isDarkMode)} text-lg font-semibold`}
          >
            Project Fields ({fields.length})
          </h3>
          <button
            onClick={handleClearAllFields}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
          >
            Clear All Fields
          </button>
        </div>

        {fields.length === 0 ? (
          <p className={`${getTextClasses(isDarkMode)} italic`}>
            No fields added yet. Add fields by applying a template or creating
            fields manually.
          </p>
        ) : (
          <div className="space-y-6">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`${getSecondaryBgClasses(
                  isDarkMode
                )} p-4 rounded-lg space-y-2 relative z-0`}
              >
                <div className="flex justify-between items-start">
                  <label
                    className={`${getTextClasses(
                      isDarkMode
                    )} block text-sm font-medium`}
                  >
                    {field.name}
                    {(field.id === "field-name" ||
                      field.id === "field-description") && (
                      <span
                        className="text-red-500 ml-1"
                        title="Required field"
                      >
                        *
                      </span>
                    )}
                  </label>
                  {field.id !== "field-name" &&
                    field.id !== "field-description" && (
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                </div>

                {field.type === "input" && (
                  <input
                    type="text"
                    value={field.value as string}
                    onChange={(e) =>
                      handleUpdateField(field.id, e.target.value)
                    }
                    placeholder={`Enter ${field.name.toLowerCase()} value`}
                    className={`${getSecondaryBgClasses(
                      isDarkMode
                    )} ${getTextClasses(
                      isDarkMode
                    )} mt-1 block w-full max-w-full rounded-md border border-gray-200 dark:border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.25vw,1rem)] focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:shadow-[0_4px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out`}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={field.value as string}
                    onChange={(e) =>
                      handleUpdateField(field.id, e.target.value)
                    }
                    placeholder={`Enter ${field.name.toLowerCase()} value`}
                    rows={3}
                    className={`${getSecondaryBgClasses(
                      isDarkMode
                    )} ${getTextClasses(
                      isDarkMode
                    )} mt-1 block w-full max-w-full rounded-md border border-gray-200 dark:border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.25vw,1rem)] focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:shadow-[0_4px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out`}
                  />
                )}

                {(field.type === "multiselect" || field.type === "image") && (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 min-w-0 relative">
                        <input
                          type="text"
                          value={inputValues[field.id] || ""}
                          onChange={(e) =>
                            handleInputChange(field.id, e.target.value)
                          }
                          placeholder={
                            field.type === "image"
                              ? "Enter image URL (http:// or https://)"
                              : "Enter value"
                          }
                          className={`${getSecondaryBgClasses(
                            isDarkMode
                          )} ${getTextClasses(
                            isDarkMode
                          )} w-full max-w-full pr-24 rounded-md border border-gray-200 dark:border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.25vw,1rem)] focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:shadow-[0_4px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-[0_4px_8px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddMultiselectValue(field.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddMultiselectValue(field.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                    {field.type === "image" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {(field.value as string[]).map((value) => (
                          <div
                            key={value}
                            className="group relative rounded-lg overflow-hidden bg-gray-100 aspect-video"
                          >
                            <Image
                              src={value}
                              alt="Preview"
                              width={300}
                              height={200}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M4 5h16v14H4V5zm2 2v10h12V7H6zm5 2h2v6h-2V9zm-3 2h2v4H8v-4zm6 0h2v4h-2v-4z'/%3E%3C/svg%3E";
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                            <button
                              onClick={() =>
                                handleRemoveMultiselectValue(field.id, value)
                              }
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                            <div className="absolute bottom-2 left-2 right-2 text-xs text-white truncate px-2 py-1 rounded bg-black bg-opacity-50">
                              {new URL(value).pathname.split("/").pop()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(field.value as string[]).map((value) => (
                          <div
                            key={value}
                            className="group relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            <span>{value}</span>
                            <button
                              onClick={() =>
                                handleRemoveMultiselectValue(field.id, value)
                              }
                              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditFields;
