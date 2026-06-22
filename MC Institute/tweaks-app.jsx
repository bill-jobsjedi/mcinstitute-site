/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "skin": "original",
  "ctaShape": "pill",
  "scrollAnim": true
}/*EDITMODE-END*/;

const LOGO_NORMAL = (window.__resources && window.__resources.logoSerif) || "assets/img/mc-serif.png";
const LOGO_WHITE  = (window.__resources && window.__resources.logoSerifWhite) || "assets/img/mc-serif-white.png";

function applyLogos(skin){
  const dark = (skin === "dark");
  // Header is a white bar in every skin → original (navy-text) logo
  document.querySelectorAll(".logo img").forEach((im)=>{
    if(im.getAttribute("src") !== LOGO_NORMAL) im.setAttribute("src", LOGO_NORMAL);
  });
  // Footer: dark footer (dark skin) → white logo; white footer otherwise → normal logo
  const footSrc = dark ? LOGO_WHITE : LOGO_NORMAL;
  document.querySelectorAll(".foot-logo img").forEach((im)=>{
    if(im.getAttribute("src") !== footSrc) im.setAttribute("src", footSrc);
  });
}
function applySkin(skin){
  const el = document.documentElement;
  if(skin && skin !== "original") el.dataset.skin = skin;
  else el.removeAttribute("data-skin");
  applyLogos(skin);
}
function applyCtaShape(shape){ document.documentElement.dataset.cta = shape || "pill"; }
function applyScrollAnim(on){ document.documentElement.classList.toggle("no-anim", !on); }

// Apply persisted defaults synchronously (minimise flash before React mounts)
applySkin(TWEAK_DEFAULTS.skin);
applyCtaShape(TWEAK_DEFAULTS.ctaShape);
applyScrollAnim(TWEAK_DEFAULTS.scrollAnim);
// Enable colour transitions only after first paint (prevents load flash)
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  document.documentElement.classList.add("skin-ready");
}));

const SKIN_OPTS = [
  { value: "original", label: "Original" },
  { value: "mc",       label: "Bordô+Navy" },
  { value: "dark",     label: "Dark" }
];
const SHAPE_OPTS = [
  { value: "pill",  label: "Arredondado" },
  { value: "sharp", label: "Reto" }
];

function TweaksApp(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(()=>{ applySkin(t.skin); }, [t.skin]);
  useEffect(()=>{ applyCtaShape(t.ctaShape); }, [t.ctaShape]);
  useEffect(()=>{ applyScrollAnim(t.scrollAnim); }, [t.scrollAnim]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Tema" />
      <TweakRadio label="Cores" value={t.skin} options={SKIN_OPTS}
                  onChange={(v)=>setTweak("skin", v)} />
      <TweakSection label="Botões" />
      <TweakRadio label="Cantos" value={t.ctaShape} options={SHAPE_OPTS}
                  onChange={(v)=>setTweak("ctaShape", v)} />
      <TweakSection label="Movimento" />
      <TweakToggle label="Animar ao rolar" value={t.scrollAnim}
                   onChange={(v)=>setTweak("scrollAnim", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
