import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Studio tayang di https://mana-social-cafe.sanity.studio
  studioHost: "mana-social-cafe",
  deployment: { appId: "ka331xcm7z2kmdl7fgped88i" },
});
