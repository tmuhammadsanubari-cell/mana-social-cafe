import { visionTool } from "@sanity/vision";
import { defineConfig, type WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";
import { allowedActions } from "./access/documentActions";
import { isSiteAdmin, parseSiteAdminIds } from "./access/siteAdmin";
import { projectId, siteAdminIdsRaw } from "./env";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

const adminIds = parseSiteAdminIds(siteAdminIdsRaw);

// Dua workspace (PRD 16.1): staf memilih Produksi untuk situs publik, Staging untuk uji dan preview.
const workspaces = [
  { name: "production", title: "ManA Social Cafe", subtitle: "Produksi", dataset: "production" },
  { name: "staging", title: "ManA Social Cafe", subtitle: "Staging (uji coba)", dataset: "staging" },
];

export default defineConfig(
  workspaces.map((workspace): WorkspaceOptions => ({
    ...workspace,
    basePath: `/${workspace.name}`,
    projectId,
    plugins: [structureTool({ structure }), visionTool()],
    schema: {
      types: schemaTypes,
      // Pengaturan Situs hanya satu dokumen, dibuka lewat menu kiri, bukan dibuat baru.
      templates: (templates) => templates.filter((template) => template.schemaType !== "siteSettings"),
    },
    document: {
      actions: (prev, context) =>
        allowedActions(prev, context.schemaType, isSiteAdmin(context.currentUser, adminIds)),
      newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== "siteSettings"),
    },
  })),
);
