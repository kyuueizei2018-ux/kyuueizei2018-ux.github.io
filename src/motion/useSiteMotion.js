import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const HERO_LINE_FROM = {
  yPercent: 118,
  scaleX: 1.22,
  skewX: 5,
  transformOrigin: "0% 100%",
  clipPath: "inset(0% 0% 100% 0%)",
};

const HERO_LINE_TO = {
  yPercent: 0,
  scaleX: 1,
  skewX: 0,
  clipPath: "inset(-0.22em -0.06em -0.22em -0.06em)",
  clearProps: "clipPath",
  duration: 1.8,
  stagger: 0.12,
  ease: "expo.out",
};

const HEADING_FROM = {
  clipPath: "inset(0% 0% 100% 0%)",
  yPercent: 34,
  scale: 1.04,
  transformOrigin: "0% 100%",
};

const HEADING_TO = {
  clipPath: "inset(-0.22em -0.06em -0.22em -0.06em)",
  clearProps: "clipPath",
  yPercent: 0,
  scale: 1,
  duration: 1.45,
  ease: "expo.out",
};

export default function useSiteMotion({ loaded, rootRef }) {
  useEffect(() => {
    if (!loaded) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const previousOverflow = document.body.style.overflow;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const preloader = root.querySelector(".preloader");
      if (reduce) {
        if (preloader) preloader.style.display = "none";
        document.body.style.overflow = previousOverflow;
        return;
      }

      const q = gsap.utils.selector(root);
      const heroSpans = q(".hero-title__line > span");
      const heroVideo = root.querySelector(".hero__video");
      const preloaderBits = q(".preloader__top, .preloader__title, .preloader__bottom");
      const headerBits = q(".site-header .brand, .site-header .nav a, .site-header .header-contact");
      const heroKicker = root.querySelector(".hero-kicker");
      const heroCorner = root.querySelector(".hero__corner-label");
      const heroIntro = root.querySelector(".hero__intro");
      const heroRound = root.querySelector(".round-link");
      const heroFoot = root.querySelector(".hero__foot");
      const heroSide = root.querySelector(".hero__side-index");

      gsap.set(preloader, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(heroSpans, HERO_LINE_FROM);
      gsap.set(heroVideo, { scale: 1.12, clipPath: "inset(0% 0% 12% 0%)" });
      gsap.set([heroKicker, heroCorner], { autoAlpha: 0, y: 24 });
      gsap.set([heroIntro, heroRound, heroFoot], { autoAlpha: 0, y: 26 });
      gsap.set(heroSide, { autoAlpha: 0 });
      gsap.set(headerBits, { autoAlpha: 0, y: -16 });

      let heroBreathe;
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          if (preloader) preloader.style.display = "none";
          document.body.style.overflow = previousOverflow;
          ScrollTrigger.refresh();
        },
      });

      intro
        .to(
          preloaderBits,
          { autoAlpha: 0, y: -16, duration: 0.7, stagger: 0.05, ease: "power2.in" },
          0,
        )
        .to(
          preloader,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.35, ease: "power4.inOut" },
          0.12,
        )
        .to(
          heroVideo,
          { scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "power3.out" },
          0.22,
        )
        .to(heroSpans, HERO_LINE_TO, 0.42)
        .to(heroCorner, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.58)
        .to(heroKicker, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.66)
        .to(
          headerBits,
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.05, ease: "power3.out" },
          0.72,
        )
        .to(
          [heroIntro, heroRound, heroFoot],
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out" },
          0.9,
        )
        .to(heroSide, { autoAlpha: 1, duration: 1.2 }, 1.05)
        .add(() => {
          heroBreathe = gsap.to(heroVideo, {
            scale: 1.035,
            duration: 14,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }, 2.4);

      const heroSection = root.querySelector(".hero");
      if (heroSection && heroVideo) {
        ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              heroVideo.play().catch(() => {});
              heroBreathe?.play();
            } else {
              heroVideo.pause();
              heroBreathe?.pause();
            }
          },
        });
      }

      const revealHeading = (sectionSelector) => {
        const section = root.querySelector(sectionSelector);
        const heading = section?.querySelector(".section-heading");
        if (!heading) return;
        const marker = heading.querySelector(".section-marker");
        const display = heading.querySelector(".section-heading__display");
        const title = heading.querySelector("h2");

        gsap.set(marker, { autoAlpha: 0, x: -26 });
        gsap.set(title, { ...HEADING_FROM });
        if (display) {
          gsap.set(display, {
            autoAlpha: 0,
            clipPath: "inset(0% 0% 100% 0%)",
            xPercent: -6,
            skewX: 4,
          });
        }

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: heading, start: "top 82%", once: true },
        });

        tl.to(marker, { autoAlpha: 1, x: 0, duration: 0.9 }, 0);
        if (display) {
          tl.to(
            display,
            {
              autoAlpha: 1,
              clipPath: "inset(-0.2em -0.06em -0.2em -0.06em)",
              clearProps: "clipPath",
              xPercent: 0,
              skewX: 0,
              duration: 1.25,
              ease: "expo.out",
            },
            0.04,
          );
        }
        tl.to(title, { ...HEADING_TO }, 0.38);
      };

      revealHeading("#profile");
      revealHeading("#comparisons");
      revealHeading("#works");

      const revealComparison = (item) => {
        const card = item.querySelector(".comparison-card");
        const images = item.querySelectorAll(".comparison-card__layer img");
        gsap.set(item, { autoAlpha: 0, y: 80 });
        if (card) gsap.set(card, { clipPath: "inset(0% 0% 100% 0%)" });
        if (images.length) gsap.set(images, { scale: 1.06 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: item, start: "top 82%", once: true },
        });
        tl.to(item, { autoAlpha: 1, y: 0, duration: 1.1 });
        if (card) {
          tl.to(card, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath", duration: 1.5 }, 0.08);
        }
        if (images.length) {
          tl.to(images, { scale: 1, duration: 1.8, stagger: 0.04 }, 0.08);
        }
      };

      q(".comparison-item").forEach(revealComparison);

      const showreel = root.querySelector(".showreel");
      if (showreel) {
        const frame = showreel.querySelector(".showreel__frame");
        const video = showreel.querySelector("video");
        gsap.set(showreel, { autoAlpha: 0, y: 60 });
        if (frame) gsap.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });
        if (video) gsap.set(video, { scale: 1.04 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: showreel, start: "top 82%", once: true },
        });
        tl.to(showreel, { autoAlpha: 1, y: 0, duration: 1.15 });
        if (frame) {
          tl.to(
            frame,
            { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath", duration: 1.5 },
            0.05,
          );
        }
        if (video) tl.to(video, { scale: 1, duration: 1.8 }, 0.05);
      }

      const portrait = root.querySelector(".portrait-card");
      if (portrait) {
        const frame = portrait.querySelector(".portrait-card__image");
        const image = frame?.querySelector("img");
        gsap.set(portrait, { autoAlpha: 0, y: 70 });
        if (frame) gsap.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });
        if (image) gsap.set(image, { scale: 1.12 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: portrait, start: "top 82%", once: true },
        });
        tl.to(portrait, { autoAlpha: 1, y: 0, duration: 1.15 });
        if (frame) tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath", duration: 1.45 }, 0);
        if (image) tl.to(image, { scale: 1, duration: 1.8 }, 0);
      }

      const lead = root.querySelector(".profile__lead");
      if (lead) {
        gsap.set(lead, { autoAlpha: 0, y: 50 });
        gsap.to(lead, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: lead, start: "top 84%", once: true },
        });
      }

      const data = root.querySelector(".profile__data");
      if (data) {
        gsap.set(data, { autoAlpha: 0, y: 36 });
        gsap.to(data, {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: { trigger: data, start: "top 88%", once: true },
        });
      }

      const details = root.querySelector(".profile__details");
      if (details) {
        const rows = details.querySelectorAll(".skill-list span, .timeline-item");
        gsap.set(details, { autoAlpha: 0 });
        gsap.set(details.querySelectorAll(".micro-label"), { autoAlpha: 0, y: 16 });
        if (rows.length) gsap.set(rows, { autoAlpha: 0, y: 24 });
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: details, start: "top 86%", once: true },
        });
        tl.to(details, { autoAlpha: 1, duration: 0.5 });
        tl.to(details.querySelectorAll(".micro-label"), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.05);
        if (rows.length) tl.to(rows, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.12);
      }

      const profileLink = root.querySelector(".profile .text-link");
      if (profileLink) {
        gsap.set(profileLink, { autoAlpha: 0, y: 24 });
        gsap.to(profileLink, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: profileLink, start: "top 92%", once: true },
        });
      }

      const marquee = root.querySelector(".poster-marquee");
      const posterCards = root.querySelectorAll(".poster-group:first-child .poster-card");
      const posterImages = root.querySelectorAll(".poster-group:first-child .poster-card__image img");
      if (marquee) {
        gsap.set(marquee, { clipPath: "inset(0% 0% 100% 0%)", y: 46 });
        if (posterCards.length) gsap.set(posterCards, { autoAlpha: 0, y: 60 });
        if (posterImages.length) gsap.set(posterImages, { scale: 1.06 });
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: marquee, start: "top 82%", once: true },
        });
        tl.to(marquee, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath", y: 0, duration: 1.3 });
        if (posterCards.length) {
          tl.to(posterCards, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.075 }, 0.14);
        }
        if (posterImages.length) {
          tl.to(posterImages, { scale: 1, duration: 1.5, stagger: 0.05 }, 0.14);
        }
      }

      const worksMeta = root.querySelector(".poster-marquee__meta");
      if (worksMeta) {
        gsap.set(worksMeta, { autoAlpha: 0, y: 18 });
        gsap.to(worksMeta, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: { trigger: worksMeta, start: "top 94%", once: true },
        });
      }

      const contact = root.querySelector("#contact");
      if (contact) {
        const meta = contact.querySelector(".contact__meta");
        const kicker = contact.querySelector(".contact__kicker");
        const title = contact.querySelector("h2");
        const email = contact.querySelector(".contact__email");
        const links = contact.querySelectorAll(".contact__links a");
        const signature = contact.querySelector(".contact__signature");
        const footer = contact.querySelector(".footer-strip");

        gsap.set(meta, { autoAlpha: 0, y: 18 });
        gsap.set(kicker, { autoAlpha: 0, y: 24 });
        gsap.set(title, { ...HEADING_FROM, yPercent: 18 });
        gsap.set(email, { autoAlpha: 0, y: 44 });
        gsap.set(links, { autoAlpha: 0, y: 18 });
        gsap.set([signature, footer], { autoAlpha: 0, y: 16 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: contact, start: "top 72%", once: true },
        });
        tl.to(meta, { autoAlpha: 1, y: 0, duration: 0.9 }, 0);
        tl.to(kicker, { autoAlpha: 1, y: 0, duration: 1 }, 0.1);
        tl.to(
          title,
          {
            clipPath: "inset(-0.18em -0.06em -0.18em -0.06em)",
            clearProps: "clipPath",
            yPercent: 0,
            scale: 1,
            duration: 1.6,
          },
          0.18,
        );
        tl.to(email, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.62);
        tl.to(links, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.78);
        tl.to([signature, footer], { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.9);
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    }, root);

    return () => {
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [loaded, rootRef]);
}
