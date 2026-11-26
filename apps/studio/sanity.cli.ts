import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Alamat Studio: https://<studioHost>.sanity.studio. Ganti bila nama ini sudah dipakai orang lain.
  studioHost: "mana-social-cafe",
});
