#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readdir, readFile } from "fs/promises";
import { join, basename, extname } from "path";
import { z } from "zod";

const STANDARDS_DIR = join(import.meta.dir, "standards");

const server = new McpServer({
  name: "pesona-hub-standards",
  version: "1.0.0",
});

async function loadStandards(): Promise<Record<string, string>> {
  const files = await readdir(STANDARDS_DIR);
  const standards: Record<string, string> = {};
  await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const category = basename(file, extname(file));
        standards[category] = await readFile(join(STANDARDS_DIR, file), "utf-8");
      })
  );
  return standards;
}

server.tool(
  "list_standards",
  "List all available coding standard categories for this project",
  {},
  async () => {
    const standards = await loadStandards();
    const categories = Object.keys(standards);
    return {
      content: [
        {
          type: "text",
          text: `Available standard categories:\n${categories.map((c) => `- ${c}`).join("\n")}`,
        },
      ],
    };
  }
);

server.tool(
  "get_standard",
  "Get coding standards for a specific category (components, styling, tooling)",
  { category: z.string().describe("The category name, e.g. 'components', 'styling', 'tooling'") },
  async ({ category }) => {
    const standards = await loadStandards();
    const content = standards[category];
    if (!content) {
      const available = Object.keys(standards).join(", ");
      return {
        content: [{ type: "text", text: `Category "${category}" not found. Available: ${available}` }],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: content }] };
  }
);

server.tool(
  "get_all_standards",
  "Get all coding standards for this project at once",
  {},
  async () => {
    const standards = await loadStandards();
    const combined = Object.entries(standards)
      .map(([cat, content]) => `## ${cat}\n\n${content}`)
      .join("\n\n---\n\n");
    return { content: [{ type: "text", text: combined }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
