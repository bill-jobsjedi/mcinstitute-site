/* ===== MC Institute — interactions ===== */
(function(){
  const I18N = window.I18N, LANGS = window.LANGS;
  const STORE = "mc_lang";

  function detectLang(){
    const saved = localStorage.getItem(STORE);
    if(saved && I18N[saved]) return saved;
    const u = new URLSearchParams(location.search).get("lang");
    if(u && I18N[u]) return u;
    return "pt-br";
  }
  let lang = detectLang();

  function applyLang(l){
    lang = l;
    localStorage.setItem(STORE, l);
    const dict = I18N[l];
    document.documentElement.lang = l === "pt-br" ? "pt-BR" : l;
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k = el.getAttribute("data-i18n");
      if(dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el=>{
      const k = el.getAttribute("data-i18n-html");
      if(dict[k] != null) el.innerHTML = dict[k];
    });
    // language button label
    const cur = LANGS.find(x=>x.code===l);
    const lb = document.querySelector(".lang-btn");
    if(lb && cur) lb.querySelector(".fl").textContent = cur.flag, lb.querySelector(".lab").textContent = cur.label;
    document.querySelectorAll(".lang-menu button").forEach(b=>{
      b.classList.toggle("sel", b.dataset.code===l);
    });
  }

  // language menu
  function initLang(){
    const lang_el = document.querySelector(".lang");
    const btn = lang_el.querySelector(".lang-btn");
    btn.addEventListener("click", e=>{ e.stopPropagation(); lang_el.classList.toggle("open"); });
    document.addEventListener("click", ()=> lang_el.classList.remove("open"));
    lang_el.querySelectorAll(".lang-menu button").forEach(b=>{
      b.addEventListener("click", ()=>{ applyLang(b.dataset.code); lang_el.classList.remove("open"); });
    });
  }

  // mobile drawer
  function initDrawer(){
    const burger = document.querySelector(".burger");
    const drawer = document.querySelector(".drawer");
    const scrim  = document.querySelector(".scrim");
    const close  = document.querySelector(".drawer-close");
    const open  = ()=>{ drawer.classList.add("open"); scrim.classList.add("open"); };
    const shut  = ()=>{ drawer.classList.remove("open"); scrim.classList.remove("open"); };
    burger && burger.addEventListener("click", open);
    scrim && scrim.addEventListener("click", shut);
    close && close.addEventListener("click", shut);
    drawer && drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",shut));
  }

  // FAQ accordion
  function initFaq(){
    document.querySelectorAll(".faq-item").forEach(item=>{
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      q.addEventListener("click", ()=>{
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(o=>{
          o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null;
        });
        if(!isOpen){ item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
      });
    });
  }

  // testimonial carousel
  function initCarousel(){
    const slides = [...document.querySelectorAll(".tslide")];
    const dots = [...document.querySelectorAll(".tdot")];
    if(!slides.length) return;
    let i = 0, timer;
    const go = (n)=>{
      i = (n + slides.length) % slides.length;
      slides.forEach((s,k)=>s.classList.toggle("on",k===i));
      dots.forEach((d,k)=>d.classList.toggle("on",k===i));
    };
    dots.forEach((d,k)=>d.addEventListener("click",()=>{ go(k); restart(); }));
    function restart(){ clearInterval(timer); timer = setInterval(()=>go(i+1), 7000); }
    go(0); restart();
  }

  // scroll reveal
  function initReveal(){
    const els = [...document.querySelectorAll(".reveal")];
    if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); obs.unobserve(en.target); } });
    },{threshold:.08, rootMargin:"0px 0px -6% 0px"});
    els.forEach(el=>obs.observe(el));
    // failsafe: never leave content hidden
    setTimeout(()=>els.forEach(e=>e.classList.add("in")), 2600);
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    initLang(); initDrawer(); initFaq(); initCarousel(); initReveal(); initImgFallback();
    applyLang(lang);
  });

  // graceful image fallbacks (originals are hotlink-protected)
  function initImgFallback(){
    function broken(img){
      if(img.dataset.fb) return; img.dataset.fb = "1";
      if(img.closest(".logo") || img.closest(".foot-logo")){
        const dark = !!img.closest(".foot-logo");
        const span = document.createElement("span");
        span.className = "wordmark";
        span.innerHTML = '<b>MC INSTITUTE</b><i>International Student Center</i>';
        img.replaceWith(span);
        return;
      }
      if(img.closest(".badges")){ img.style.display="none"; return; }
      if(img.closest(".about-icon") || img.classList.contains("about-icon")){ img.style.display="none"; return; }
      // generic: hero etc -> branded gradient block
      const ph = document.createElement("div");
      ph.className = "img-ph";
      ph.textContent = img.alt || "";
      if(img.closest(".hero-img")) ph.classList.add("hero-ph");
      img.replaceWith(ph);
    }
    document.querySelectorAll("img").forEach(img=>{
      img.addEventListener("load", ()=>{ img.dataset.ok="1"; });
      img.addEventListener("error", ()=>broken(img));
      // if it already failed before listeners attached
      if(img.complete && img.naturalWidth===0 && img.dataset.ok!=="1") broken(img);
    });
    // background-image placeholders already have a base gradient via CSS
  }
})();
