import { describe, expect, it } from "vitest";
import { allowedActions } from "../access/documentActions";
import { isSiteAdmin, parseSiteAdminIds } from "../access/siteAdmin";

const actions = ["publish", "discardChanges", "unpublish", "duplicate", "delete", "restore"].map(
  (action) => ({
    action,
  }),
);
const names = (list: Array<{ action?: string }>) => list.map((item) => item.action);
const admins = parseSiteAdminIds(" pAdmin1 , ,pAdmin2");

describe("admin situs (ADR 0006)", () => {
  it("membaca daftar ID dari variabel lingkungan dan membuang spasi", () => {
    expect([...admins]).toEqual(["pAdmin1", "pAdmin2"]);
  });

  it("hanya ID di daftar yang dianggap admin situs", () => {
    expect(isSiteAdmin({ id: "pAdmin2" }, admins)).toBe(true);
    expect(isSiteAdmin({ id: "pStaf" }, admins)).toBe(false);
    expect(isSiteAdmin(null, admins)).toBe(false);
  });

  it("daftar kosong berarti tidak ada admin situs", () => {
    expect(isSiteAdmin({ id: "pAdmin1" }, parseSiteAdminIds(""))).toBe(false);
  });
});

describe("aksi dokumen (PRD 12.2)", () => {
  it("US-11.AC3: Editor tidak punya aksi apa pun di Pengaturan Situs", () => {
    expect(allowedActions(actions, "siteSettings", false)).toEqual([]);
  });

  it("admin situs bisa publish dan restore Pengaturan Situs, tetapi tidak bisa menghapusnya", () => {
    expect(names(allowedActions(actions, "siteSettings", true))).toEqual([
      "publish",
      "discardChanges",
      "restore",
    ]);
  });

  it("API-03: Editor tidak bisa menghapus Outlet", () => {
    expect(names(allowedActions(actions, "outlet", false))).not.toContain("delete");
    expect(names(allowedActions(actions, "outlet", true))).toContain("delete");
  });

  it("US-11.AC4: Editor tetap bisa publish dan restore item menu", () => {
    expect(names(allowedActions(actions, "menuItem", false))).toEqual(names(actions));
  });
});
