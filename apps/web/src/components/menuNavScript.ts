// Perilaku pita kategori: tab, gulir ke kategori (PRD 8.7), penanda aktif (US-04.AC2), dan event PRD 17.
import { trackEvent } from "../lib/analytics";
import { cssDurationMs } from "../lib/menu";

/** Jarak di bawah pita yang masih dianggap "sedang dibaca". */
const SPY_OFFSET = 64;
const HALF = 0.5;
const MANUAL_INPUT = ["wheel", "touchstart", "pointerdown", "keydown"];

interface MenuNav {
  nav: HTMLElement;
  links: HTMLAnchorElement[];
  tabs: HTMLButtonElement[];
  /** true selama pilihan pengunjung berlaku: kategori paling bawah tidak bisa mencapai atas layar. */
  locked: boolean;
}

const analytics = window as Parameters<typeof trackEvent>[0];
const targetOf = (link: HTMLAnchorElement) => document.getElementById(link.hash.slice(1));
const shownLinks = (menu: MenuNav) => menu.links.filter((link) => !link.parentElement?.hidden);

function scrollDuration(): number {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  const styles = getComputedStyle(document.documentElement);
  return cssDurationMs(styles.getPropertyValue("--duration-scroll"));
}

/** Menggulir sampai bagian atas kategori tepat di bawah pita. */
function scrollToCategory(menu: MenuNav, category: HTMLElement): void {
  const start = window.scrollY;
  const end = category.getBoundingClientRect().top + start - menu.nav.offsetHeight;
  const duration = scrollDuration();
  const begin = performance.now();
  const step = (now: number) => {
    const progress = duration === 0 ? 1 : Math.min((now - begin) / duration, 1);
    const eased = progress * (1 + 1 - progress); // melambat menjelang akhir
    window.scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
    if (progress < 1) window.requestAnimationFrame(step);
  };
  step(begin);
}

function activate(menu: MenuNav, active: HTMLAnchorElement): void {
  if (active.getAttribute("aria-current") === "true") return;
  menu.links.forEach((link) => link.removeAttribute("aria-current"));
  active.setAttribute("aria-current", "true");
  const item = active.parentElement;
  const list = item?.parentElement;
  if (item && list) list.scrollLeft = item.offsetLeft - (list.clientWidth - item.offsetWidth) * HALF;
}

function selectSection(menu: MenuNav, section: string): void {
  menu.tabs.forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.tab === section)));
  document.querySelectorAll<HTMLElement>("[data-section]").forEach((element) => {
    element.hidden = element.dataset.section !== section;
  });
}

function spy(menu: MenuNav): void {
  if (menu.locked) return;
  const line = menu.nav.getBoundingClientRect().bottom + SPY_OFFSET;
  const links = shownLinks(menu);
  const passed = links.filter((link) => (targetOf(link)?.getBoundingClientRect().top ?? line) < line);
  const current = passed[passed.length - 1] ?? links[0];
  if (current) activate(menu, current);
}

function openCategory(menu: MenuNav, link: HTMLAnchorElement): void {
  const category = targetOf(link);
  if (!category) return;
  selectSection(menu, link.parentElement?.dataset.section ?? "food");
  menu.locked = true;
  activate(menu, link);
  category.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  scrollToCategory(menu, category);
}

function onLinkClick(menu: MenuNav, link: HTMLAnchorElement, event: MouseEvent): void {
  if (event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  history.replaceState(null, "", link.hash);
  openCategory(menu, link);
  trackEvent(analytics, "select_menu_category", { category: link.dataset.categoryLink ?? "" });
}

function onTabClick(menu: MenuNav, section: string): void {
  selectSection(menu, section);
  menu.locked = false;
  const first = shownLinks(menu)[0];
  const category = first ? targetOf(first) : null;
  // Bila pita sedang menempel, daftar baru dimulai dari atas.
  if (category && menu.nav.getBoundingClientRect().top <= 0) scrollToCategory(menu, category);
  spy(menu);
}

function setUp(nav: HTMLElement): void {
  const menu: MenuNav = {
    nav,
    links: [...nav.querySelectorAll<HTMLAnchorElement>("a[data-category-link]")],
    tabs: [...nav.querySelectorAll<HTMLButtonElement>("[data-tab]")],
    locked: false,
  };
  menu.links.forEach((link) => link.addEventListener("click", (event) => onLinkClick(menu, link, event)));
  menu.tabs.forEach((tab) => {
    tab.addEventListener("click", () => onTabClick(menu, tab.dataset.tab ?? "food"));
  });
  MANUAL_INPUT.forEach((type) => {
    window.addEventListener(type, () => (menu.locked = false), { passive: true });
  });
  window.addEventListener("scroll", () => window.requestAnimationFrame(() => spy(menu)), { passive: true });

  nav.querySelector('[role="group"]')?.removeAttribute("hidden");
  selectSection(menu, "food");
  const linked = menu.links.find((link) => link.hash === window.location.hash);
  if (linked) openCategory(menu, linked);
  else spy(menu);
}

document.querySelectorAll<HTMLElement>("[data-menu-nav]").forEach(setUp);
trackEvent(analytics, "view_menu", { outlet: "buah-batu" });
