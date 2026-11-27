// Perilaku galeri: tampilan penuh (US-05.AC2) dan foto gagal dimuat (kasus tepi 7.5).
import { slideLabel, slideTarget } from "../lib/gallery";

/** Selisih piksel yang masih dianggap pas di satu foto saat layar diperbesar. */
const SNAP_TOLERANCE = 2;

interface Viewer {
  dialog: HTMLDialogElement;
  track: HTMLElement;
  count: HTMLElement;
  slides: NodeListOf<HTMLElement>;
  steps: NodeListOf<HTMLButtonElement>;
  current: number;
  /** Tujuan gulir yang belum tercapai; posisi di tengah jalan diabaikan. */
  pending: number | null;
}

function watchPhoto(image: HTMLImageElement): void {
  const replace = () => {
    image.hidden = true;
    image.parentElement?.querySelector("[data-fallback]")?.removeAttribute("hidden");
  };
  // Foto bisa sudah gagal sebelum skrip berjalan; yang belum diminta punya currentSrc kosong.
  if (image.complete && image.currentSrc !== "" && image.naturalWidth === 0) replace();
  else image.addEventListener("error", replace, { once: true });
}

function mark(viewer: Viewer, index: number): void {
  viewer.current = index;
  viewer.count.textContent = slideLabel(index, viewer.slides.length);
  viewer.slides.forEach((slide, position) => {
    slide.setAttribute("aria-hidden", String(position !== index));
  });
  viewer.steps.forEach((button) => {
    const next = index + Number(button.dataset.viewerStep);
    button.setAttribute("aria-disabled", String(slideTarget(next, viewer.slides.length) === index));
  });
}

function show(viewer: Viewer, index: number, behavior: ScrollBehavior = "auto"): void {
  const target = slideTarget(index, viewer.slides.length);
  viewer.pending = target === viewer.current ? null : target;
  mark(viewer, target);
  // "auto" mengikuti scroll-behavior CSS, yang dimatikan saat prefers-reduced-motion.
  viewer.track.scrollTo({ left: target * viewer.track.clientWidth, behavior });
}

function syncWithScroll(viewer: Viewer): void {
  const { scrollLeft, clientWidth } = viewer.track;
  if (clientWidth === 0) return;
  const nearest = Math.round(scrollLeft / clientWidth);
  if (Math.abs(scrollLeft - nearest * clientWidth) > SNAP_TOLERANCE) return;
  if (viewer.pending !== null && viewer.pending !== nearest) return;
  viewer.pending = null;
  mark(viewer, nearest);
}

function bindControls(viewer: Viewer): void {
  const { dialog, track, steps } = viewer;
  steps.forEach((button) => {
    button.addEventListener("click", () => show(viewer, viewer.current + Number(button.dataset.viewerStep)));
  });
  dialog.querySelector("[data-viewer-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    show(viewer, viewer.current + step);
  });
  track.addEventListener("scroll", () => syncWithScroll(viewer), { passive: true });
  // Geseran pengunjung membatalkan tujuan dari tombol.
  for (const type of ["pointerdown", "touchstart", "wheel"]) {
    track.addEventListener(type, () => (viewer.pending = null), { passive: true });
  }
}

function bindOpeners(gallery: HTMLElement, viewer: Viewer): void {
  gallery.querySelectorAll<HTMLAnchorElement>("[data-gallery-open]").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      // Ctrl, Cmd, atau Shift tetap membuka file foto seperti tautan biasa.
      if (event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      viewer.dialog.showModal();
      show(viewer, Number(link.dataset.galleryOpen), "instant");
      // Safari tidak memfokuskan tautan yang diklik, jadi fokus dikembalikan secara eksplisit.
      viewer.dialog.addEventListener("close", () => link.focus({ preventScroll: true }), { once: true });
    });
  });
}

function setUp(gallery: HTMLElement): void {
  const dialog = gallery.querySelector<HTMLDialogElement>("[data-viewer]");
  const track = dialog?.querySelector<HTMLElement>("[data-viewer-track]");
  const count = dialog?.querySelector<HTMLElement>("[data-viewer-count]");
  if (!dialog || !track || !count) return;
  const viewer: Viewer = {
    dialog,
    track,
    count,
    slides: dialog.querySelectorAll("[data-viewer-slide]"),
    steps: dialog.querySelectorAll("[data-viewer-step]"),
    current: 0,
    pending: null,
  };
  bindControls(viewer);
  bindOpeners(gallery, viewer);
}

export function setUpGalleries(): void {
  document.querySelectorAll<HTMLImageElement>("[data-gallery-photo]").forEach(watchPhoto);
  document.querySelectorAll<HTMLElement>("[data-gallery]").forEach(setUp);
}
