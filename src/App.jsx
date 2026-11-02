import { useEffect, useMemo, useRef, useState } from "react";
import BinaryOrbits from "./components/BinaryOrbits";
import GradientASCII from "./components/GradientASCII";
import useSiteMotion from "./motion/useSiteMotion";

const posterModules = import.meta.glob("./assets/posters/*", {
  eager: true,
  import: "default",
  query: "?url",
});

const posters = Object.entries(posterModules)
  .filter(([path]) => !path.includes("poster-test"))
  .sort(([left], [right]) => left.localeCompare(right, "zh-CN", { numeric: true }))
  .map(([path, image], index) => {
    const filename = path.split("/").pop();
    const rawTitle = filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    const title = rawTitle.replace(/^[a-z]/, (letter) => letter.toUpperCase());

    return {
      index: String(index + 1).padStart(2, "0"),
      title,
      english: "动画摄影合成",
      role: "摄影合成 / 后期制作",
      description: "",
      image,
      tags: [],
      note: "作品海报 / 精选",
    };
  });

const skills = [
  "After Effects",
  "Photoshop",
  "Blender",
  "3ds Max",
  "Houdini",
];

const comparisons = [
  {
    index: "01",
    title: "角色处理",
    description: "拖动中线，查看角色处理前后的色彩、光影与细节变化。",
    // 按画面内容标注：左侧为处理后，右侧为处理前
    before: "处理后",
    after: "处理前",
    beforeImage: "/assets/comparisons/role-before.webp",
    afterImage: "/assets/comparisons/role-after.webp",
    featured: true,
    color: true,
  },
  {
    index: "02",
    title: "三渲二材质前后",
    description: "基础渲染与对比度、高光和二维化处理后的画面差异。",
    // 左侧为二维化完成，右侧为基础渲染
    before: "二维化完成",
    after: "基础渲染",
    beforeImage: "/assets/comparisons/cel-after.webp",
    afterImage: "/assets/comparisons/cel-before.webp",
    color: true,
  },
];

function Arrow({ diagonal = false }) {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-diagonal={diagonal ? "true" : "false"}
    >
      <path d="M3 12h17M14 5l7 7-7 7" />
    </svg>
  );
}

function SectionHeading({ index, eyebrow, title, display }) {
  return (
    <header className="section-heading reveal">
      <div className="section-marker">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div className="section-heading__content">
        {display && (
          <p className="section-heading__display" aria-hidden="true">
            {display}
          </p>
        )}
        <h2>{title}</h2>
      </div>
    </header>
  );
}

function Header({ scrolled }) {
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="shell site-header__inner">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand__mark">邱</span>
          <span className="brand__copy">
            邱睿哲
            <small>动画摄影合成师</small>
          </span>
        </a>

        <nav className="nav" aria-label="页面导航">
          <a href="#profile">
            <span>01</span> 个人经历
          </a>
          <a href="#comparisons">
            <span>02</span> 制作对比
          </a>
          <a href="#works">
            <span>03</span> 作品海报
          </a>
          <a href="#contact">
            <span>04</span> 联系方式
          </a>
        </nav>

        <a className="header-contact" href="mailto:kyuueizei@qq.com">
          联系我
          <Arrow />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <video
        key="cover2"
        className="hero__video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/media/cover2-poster.webp"
        aria-hidden="true"
      >
        <source src="/media/cover2-2026.mp4" type="video/mp4" />
      </video>
      <div className="hero__shade" />

      <div className="shell hero__inner">
        <div className="hero__corner-label">
          <span className="status-dot" />
          个人作品循环演示 / 2026
        </div>

        <div className="hero__title-block">
          <p className="hero-kicker">
            <span>日式二维动画摄影合成</span>
            <span className="hero-kicker__rule" />
            <span>三渲二风格计算机图形</span>
          </p>
          <h1 className="hero-title">
            <span className="hero-title__line hero-title__line--primary">
              <span>每一帧</span>
            </span>
            <span className="hero-title__line hero-title__line--offset">
              <span>都有呼吸</span>
            </span>
          </h1>
        </div>

        <div className="hero__aside">
          <div className="hero__intro">
            <p className="hero__name">邱睿哲</p>
            <p className="hero__intro-role">动画摄影合成师 / 二维与三维</p>
            <p className="hero__intro-copy">
              用光影、色彩与节奏完成画面的最后呼吸。
              <br />
              从手绘原画到三维渲染，再到最终合成。
            </p>
          </div>
          <a className="round-link" href="mailto:kyuueizei@qq.com" aria-label="发送邮件">
            联系
            <Arrow diagonal />
          </a>
        </div>

        <div className="hero__foot">
          <div className="hero__index">个人作品集 / 2026</div>
          <div className="hero__skills">
            <span>二维摄影合成</span>
            <span>三维 × 二维</span>
            <span>光影与色彩</span>
          </div>
          <a className="scroll-cue" href="#profile">
            <span>向下浏览</span>
            <span className="scroll-cue__line" />
          </a>
        </div>
      </div>

      <div className="hero__side-index" aria-hidden="true">
        <span>001</span>
        <span>24 帧/秒</span>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section className="profile section" id="profile">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="个人档案 / 关于"
          display="PROFILE"
          title={
            <>
              把零散图层，
              <br />
              变成同一束光。
            </>
          }
        />

        <div className="profile__layout">
          <figure className="portrait-card reveal">
            <div className="portrait-card__image">
              <img src="/assets/portrait-2026.webp" alt="邱睿哲个人画像" loading="lazy" decoding="async" fetchPriority="low" />
            </div>
            <figcaption>
              <span>邱睿哲</span>
              <span>成都 / 中国</span>
            </figcaption>
          </figure>

          <div className="profile__content">
            <div className="profile__lead reveal">
              <p className="profile__eyebrow">多年经验 / 二维与三维</p>
              <div className="profile__statement">
                <p>
                  拥有多年动画摄影与三维<span className="keep">后期</span>经验，<span className="keep">参与</span>动画<span className="keep">后期</span>合成，三维模型创建与<span className="keep">视频</span>节奏优化。
                </p>
                <p>
                  熟悉逐帧动画制作流程，关注每个<span className="keep">镜头</span>最终<span className="keep">呈现的质感与情绪。</span>
                </p>
              </div>
              <p className="profile__quote">
                “镜头不是素材的终点，
                <br />
                而是观众感受画面的起点。”
              </p>
            </div>

            <div className="profile__data reveal">
              <div className="stat">
                <strong>二维×三维</strong>
                <div className="stat__meta">
                  <span>混合制作思路</span>
                  <small>混合制作流程</small>
                </div>
              </div>
            </div>

            <div className="profile__details reveal">
              <div className="profile__skills">
                <p className="micro-label">常用工具 / 软件能力</p>
                <div className="skill-list">
                  {skills.map((skill, index) => (
                    <span key={skill}>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile__timeline">
                <p className="micro-label">工作经历 / 教育背景</p>
                <div className="timeline-item">
                  <span className="timeline-item__dot" />
                  <div>
                    <h3>厦门绘梦想动漫有限公司</h3>
                    <p>后期设计师 · 动画摄影 / 三维整合 / 视频优化</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <span className="timeline-item__dot" />
                  <div>
                    <h3>有限会社　ダンガンピクチャーズ</h3>
                    <p>动画合成　3DCG</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <span className="timeline-item__dot" />
                  <div>
                    <h3>东京设计师学院</h3>
                    <p>动画原理 / 计算机图形建模 / 数字合成 / 视觉特效 / 色彩</p>
                  </div>
                </div>
              </div>
            </div>

            <a className="text-link reveal" href="mailto:kyuueizei@qq.com">
              一起完成下一帧
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span>摄影合成</span>
        <i>✦</i>
        <span>光影塑造</span>
        <i>✦</i>
        <span>色彩设计</span>
        <i>✦</i>
        <span>动态节奏</span>
        <i>✦</i>
        <span>摄影合成</span>
        <i>✦</i>
        <span>光影塑造</span>
        <i>✦</i>
        <span>色彩设计</span>
        <i>✦</i>
        <span>动态节奏</span>
        <i>✦</i>
      </div>
    </div>
  );
}

function PosterCard({ poster, duplicate }) {
  return (
    <figure className="poster-card" aria-hidden={duplicate ? "true" : undefined}>
      <div className="poster-card__image">
        <img src={poster.image} alt={`${poster.title}作品海报`} loading="lazy" />
        <div className="poster-card__shade" />
      </div>
      <figcaption>
        <h3>{poster.title}</h3>
        <p>{poster.role}</p>
      </figcaption>
    </figure>
  );
}

function SelectedWorks() {
  return (
    <section className="works section" id="works">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="作品 / 海报"
          display="WORKS"
          title={
            <>
              作品海报
            </>
          }
        />

        <div className="poster-marquee reveal" aria-label="作品海报，自动向左循环滑动">
          <div className="poster-track">
            {[0, 1].map((group) => (
              <div className="poster-group" key={group}>
                {posters.map((poster) => (
                  <PosterCard poster={poster} duplicate={group === 1} key={`${group}-${poster.index}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="poster-marquee__meta reveal">
          <span>横向循环 / 自动向左</span>
          <span>鼠标移入暂停</span>
        </div>
      </div>
    </section>
  );
}

function ComparisonSlider({ item }) {
  const [position, setPosition] = useState(50);

  return (
    <article
      className={`comparison-item reveal ${item.featured ? "comparison-item--featured" : ""} ${item.color ? "comparison-item--color" : ""}`}
    >
      <div className="comparison-item__heading">
        <span>{item.index}</span>
        <div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>

      <div className="comparison-card" style={{ "--split": `${position}%` }}>
        <div className="comparison-card__layer comparison-card__layer--after">
          <img src={item.afterImage} alt={`${item.title} ${item.after}`} loading="lazy" />
        </div>
        <div className="comparison-card__layer comparison-card__layer--before">
          <img src={item.beforeImage} alt={`${item.title} ${item.before}`} loading="lazy" />
        </div>

        <span className="comparison-card__side comparison-card__side--before">{item.before}</span>
        <span className="comparison-card__side comparison-card__side--after">{item.after}</span>
        <span className="comparison-card__corner comparison-card__corner--one" />
        <span className="comparison-card__corner comparison-card__corner--two" />

        <div className="comparison-card__handle" aria-hidden="true">
          <span>
            <i>‹</i>
            <em>{position}%</em>
            <i>›</i>
          </span>
        </div>

        <input
          className="comparison-card__range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`滑动查看${item.title}`}
          aria-valuetext={`${position}%${item.before}，${100 - position}%${item.after}`}
        />
      </div>
    </article>
  );
}

function Showreel() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    if (ended || (Number.isFinite(video.duration) && video.currentTime >= video.duration - 0.2)) {
      video.currentTime = 0;
    }
    video.muted = false;
    video.volume = 1;
    setStarted(true);
    setEnded(false);
    const attempt = video.play();
    if (attempt?.catch) {
      attempt.catch(() => setStarted(false));
    }
  };

  const handleEnded = () => {
    setStarted(false);
    setEnded(true);
  };

  return (
    <figure className="showreel reveal">
      <div className="showreel__meta">
        <span>作品集视频 / SHOWREEL</span>
        <span>2026 · 00:58</span>
      </div>
      <div className={`showreel__frame${started ? " is-playing" : ""}`}>
        <video
          ref={videoRef}
          className="showreel__video"
          src="/media/showreel-2026-web.mp4"
          poster="/media/showreel-poster-2026.webp"
          preload="none"
          playsInline
          controls={started}
          onEnded={handleEnded}
          aria-label="邱睿哲 2026 作品集视频"
        />
        {!started && (
          <button
            type="button"
            className="showreel__play"
            onClick={play}
            aria-label={ended ? "重新播放作品集视频" : "播放作品集视频"}
          >
            <span className="showreel__play-icon" aria-hidden="true" />
            <span>{ended ? "REPLAY SHOWREEL" : "PLAY SHOWREEL"}</span>
          </button>
        )}
      </div>
    </figure>
  );
}

function Comparisons() {
  return (
    <section className="comparisons section" id="comparisons">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="制作 / 对比"
          display="PROCESS"
          title={
            <>
              制作前后
            </>
          }
        />

        <div className="comparison-grid">
          {comparisons.map((item) => (
            <ComparisonSlider key={item.index} item={item} />
          ))}
        </div>

        <Showreel />
      </div>
    </section>
  );
}

function Contact({ shanghaiTime }) {
  return (
    <section className="contact" id="contact">
      <div className="contact__grid" aria-hidden="true" />
      <div className="contact__orb contact__orb--one" aria-hidden="true" />
      <div className="contact__orb contact__orb--two" aria-hidden="true" />
      <div className="shell contact__inner">
        <div className="contact__meta">
          <p>
            <span className="status-dot" />
            期待交流与合作
          </p>
          <p>成都 / 中国 — {shanghaiTime}</p>
        </div>

        <div className="contact__main">
          <p className="contact__kicker">下一幕 / 一起做点好看的</p>
          <h2>
            一起完成
            <br />
            下一个镜头。
          </h2>
          <a className="contact__email" href="mailto:kyuueizei@qq.com">
            <span>kyuueizei@qq.com</span>
            <Arrow diagonal />
          </a>
        </div>

        <div className="contact__bottom">
          <div className="contact__links">
            <a href="tel:13458593473">+86 134 5859 3473</a>
            <a href="mailto:kyuueizei@qq.com">发送邮件</a>
            <a href="#top">返回顶部 ↑</a>
          </div>
          <div className="contact__signature">
            <span>邱睿哲</span>
            <small>二维动画摄影合成 / 三维计算机图形</small>
          </div>
        </div>
      </div>
      <footer className="footer-strip">
        <span>© 2026 邱睿哲</span>
        <span>个人作品集 0.1 版</span>
        <span>围绕每一帧设计</span>
      </footer>
    </section>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaderArt, setLoaderArt] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [shanghaiTime, setShanghaiTime] = useState("");
  const rootRef = useRef(null);
  const progressRef = useRef(null);

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [],
  );

  useSiteMotion({ loaded, rootRef });

  useEffect(() => {
    const loadDuration = 1650;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;
    let animationFrame;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduceMotion) {
      document.body.style.overflow = previousOverflow;
      setLoadProgress(100);
      setLoaded(true);
      return undefined;
    }

    document.body.style.overflow = "hidden";
    const bar = document.querySelector(".preloader__bar span");
    const barAnimation = bar?.getAnimations?.()[0];

    if (barAnimation) {
      barAnimation.currentTime = 0;
      barAnimation.play();
    } else {
      bar?.style.setProperty("animation-play-state", "running");
    }

    const updateLoader = (now) => {
      const animationTime = Number(barAnimation?.currentTime);
      const elapsed = Number.isFinite(animationTime) ? animationTime : now - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / loadDuration) * 100));
      setLoadProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrame = window.requestAnimationFrame(updateLoader);
        return;
      }

      setLoaded(true);
      document.body.style.overflow = previousOverflow;
    };

    animationFrame = window.requestAnimationFrame(updateLoader);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return undefined;
    const timer = window.setTimeout(() => setLoaderArt(false), 1700);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  useEffect(() => {
    const updateClock = () => setShanghaiTime(formattedTime.format(new Date()));
    updateClock();
    const interval = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(interval);
  }, [formattedTime]);

  useEffect(() => {
    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
      }
      const nextScrolled = scrollY > 40;
      setScrolled((previous) => (previous === nextScrolled ? previous : nextScrolled));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div ref={rootRef} className={`site ${loaded ? "is-ready" : ""}`}>
      {loaded && (
        <div className="site-bg" aria-hidden="true">
          <BinaryOrbits
            starSize={1.25}
            twist={3.7}
            core={1.2000000000000002}
            speed={0.5}
            twinkle={0.45}
          />
        </div>
      )}
      <div className="grain" aria-hidden="true" />
      <div className="preloader" aria-hidden={loaded ? "true" : undefined} role="status" aria-live="polite">
        {loaderArt && (
          <div className="preloader__art" aria-hidden="true">
            <GradientASCII
              colors={["#8e3434", "#ead9b4", "#b9683d", "#c74a52"]}
              shape="horizon"
              characters=" .:-=+*#%@"
              cellSize={20}
              density={0.72}
              glyphOpacity={0.8}
              gradientOpacity={0.62}
              glow={0.22}
              softness={0.65}
              scale={1.3}
              flow={0.5}
              speed={0.55}
              grain={0.05}
              flicker={0.12}
              mouseInteraction={false}
              clickEffect="none"
              intro={false}
              dpr={1.25}
            />
          </div>
        )}
        <div className="preloader__top">
          <span>邱睿哲</span>
          <span>作品集 / 2026</span>
        </div>
        <div className="preloader__title">
          <span>每一帧</span>
          <span>都有呼吸</span>
        </div>
        <div className="preloader__bottom">
          <div className="preloader__status">
            <span>正在载入作品集</span>
            <strong>{String(loadProgress).padStart(3, "0")}%</strong>
          </div>
          <div className="preloader__bar">
            <span />
          </div>
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <Header scrolled={scrolled} />
      <main>
        <Hero />
        <Profile />
        <Marquee />
        <Comparisons />
        <SelectedWorks />
        <Contact shanghaiTime={shanghaiTime} />
      </main>
    </div>
  );
}

export default App;
