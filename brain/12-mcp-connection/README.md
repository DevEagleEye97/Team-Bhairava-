# Pillar 12: MCP (Model Context Protocol) Connection

**Domain:** Model Context Protocol Tools, Server Schemas & IDE Automation  

---

## 1. Configured MCP Servers

HackForge integrates with MCP servers to assist development, UI design, and database auditing:

1. **`StitchMCP`**:
   - Capabilities: `create_project`, `get_project`, `list_screens`, `generate_screen_from_text`, `edit_screens`, `create_design_system`.
   - Used for Rapid UI generation, visual prototyping, and design system synchronization.
2. **Supabase MCP Server (Planned / Pre-configured):**
   - Direct PostgreSQL schema inspection, migration execution, and RLS policy verification.

---

## 2. Invocation Patterns

In Antigravity IDE, MCP tools are called dynamically using `call_mcp_tool` with explicit arguments:
```json
{
  "ServerName": "StitchMCP",
  "ToolName": "get_project",
  "Arguments": { "project_id": "hackforge-desk" }
}
```
Tool definitions and schemas are maintained in the Antigravity IDE configuration directory for reproducible automated workflows.
