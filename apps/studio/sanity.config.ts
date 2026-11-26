import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { allowedActions } from "./access/documentActions";
import { isSiteAdmin, parseSiteAdminIds } from "./access/siteAdmin";
import { dataset, projectId, siteAdminIdsRaw } from "./env";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

const adminIds = parseSiteAdminIds(siteAdminIdsRaw);

export default defineConfig({
  name: "mana",
  title: "ManA Social Cafe",
  projectId,
  dataset,
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
});
