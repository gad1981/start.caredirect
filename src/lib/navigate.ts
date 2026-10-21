/** Instantly jump the window to the top, bypassing smooth-scroll CSS. */
export function jumpTop() {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = prev;
}

/** Jump now and again after paint — soft navigations often restore scroll once. */
export function jumpTopSoon() {
  jumpTop();
  if (typeof window === "undefined") return;
  requestAnimationFrame(jumpTop);
  window.setTimeout(jumpTop, 0);
  window.setTimeout(jumpTop, 50);
  window.setTimeout(jumpTop, 150);
  window.setTimeout(jumpTop, 300);
}
