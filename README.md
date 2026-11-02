# 邱睿哲 · 动画摄影合成作品集

基于 React 19 + Vite 6 的暗色单页作品集，面向 PC 展示，内容宽度最大约 1700px，同时保留手机端可用的降级排版。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 Vite 输出的本地地址（默认 `http://127.0.0.1:5173`）。生产构建：

```bash
npm run build
npm run preview
```

## 视觉基调

- 背景为暗灰近黑（`--bg: #090909`，区块使用 `#0c0c0c` 至 `#111` 的渐变）。
- 红色（`--red: #e43d43`）在界面文字中只用于大号、实心的展示标题与关键数字；正文、导航、说明和辅助信息使用白色或灰色。
- 大标题采用「实心红 + 白色描边」的叠压排版：加载页与首屏为红色实心句 + 白色描边句，联系方式收尾页整体使用红色实心大字。
- 加载页背景使用 React Bits 的 `GradientASCII`（WebGL2）生成暖色 ASCII 光场，使用示例中的红 / 米 / 橙配色作为氛围层，不参与文字层级；参数集中在 `src/App.jsx` 的 `GradientASCII` 调用处。
- 整页背景使用本地实现的 `BinaryOrbits`（Canvas 2D）双星轨道与暖色星场，固定在内容之后；各区块使用半透明暗色底让轨道若隐若现。
- 动效使用 GSAP + ScrollTrigger：开场负责加载页遮罩退出、首屏视频缩放揭开与标题压缩归位；滚动进入各区块时，英文大标题先以遮罩 / 位移方式进场，随后中文标题、说明与卡片分组 stagger，图片以遮罩和轻微缩放揭开。
- 字体：中文使用系统黑体栈，西文与数字使用自托管的 Bricolage Grotesque 变量字体。

## 页面结构

整页固定背景：`BinaryOrbits` 双星轨道，参数为 `starSize=1.25`、`twist=3.7`、`core=1.2`、`speed=0.5`、`twinkle=0.45`。

1. 加载页：GradientASCII 暖色光场背景 + 居中的红色平滑进度条（约 1.65 秒），进度与百分比同步。
2. 开场：加载页裁切上移退出，首屏视频缩放 / 揭开，标题以遮罩、位移、横向压缩后归位，顶部导航与简介依次进场。
3. 首屏：`cover2-2026.mp4` 静音、自动、循环播放的满屏视频，叠加红色主标题、右侧与简介横线等宽的姓名、导航与联系按钮。
4. 个人经历（01）：英文大字 `PROFILE` 进场后，人物画像、自我介绍、作品数量 / 经验数据、常用工具与工作经历分组出现。
5. 滚动字带：摄影合成、光影塑造、色彩设计、动态节奏。
6. 制作对比（02）：`PROCESS` 标题与两组彩色前后对比依次揭开，整行 16:9，可左右拖动中线查看；两个对比模块下方是同宽的 58 秒作品集视频，点击后播放并开启声音。
7. 作品海报（03）：`WORKS` 标题后海报卡片 stagger 进场；`src/assets/posters` 中的 9 张纵向海报自动向左循环，周期 66 秒，鼠标移入暂停，位于联系方式上方。
8. 联系方式（04）：红色大标题遮罩揭开，邮箱、链接与底部信息依次出现。

## 替换正式素材

- 作品海报：把 PNG、JPG、WEBP 或 AVIF 直接放进 `src/assets/posters` 即可自动加入滑动区。标题取文件名（去掉扩展名，下划线/连字符转空格，英文首字母自动大写），按文件名自然排序。热更新未捕捉到新文件时重启 `npm run dev`。
- 制作前后对比图：替换 `public/assets/comparisons/` 下的 `role-before.webp`、`role-after.webp`、`cel-before.webp`、`cel-after.webp`；如需增删对比组，编辑 `src/App.jsx` 中的 `comparisons` 数组。
- 个人画像：`public/assets/portrait-2026.webp`（源文件为桌面「参考/头像/头像.png」，已转为 WebP）；如需替换，保持文件名即可。
- 首屏视频：替换 `public/media/cover2-2026.mp4`；视频封面替换 `public/media/cover2-poster.webp`（已做灰度、对比度和亮度处理，与视频一致）。
- 作品集视频：`public/media/showreel-2026-web.mp4`（58 秒、1920×1080、H.264/AAC，约 12MB；源文件为桌面「参考/作品集/邱睿哲作品集2026.mp4」，原文件 69MB）；封面为 `public/media/showreel-poster-2026.webp`。替换视频时同步更新封面和 `src/App.jsx` 里的时长文字。
- 个人资料、工具与经历：编辑 `src/App.jsx` 中的 `Profile` 组件。
- 站点标题与描述：编辑 `index.html`。
- 主题色、红色、最大宽度与动效时长：编辑 `src/styles.css` 顶部的 `:root` 变量及对应规则。

## 目录说明

- `src/assets/posters`：作品海报，构建时由 `import.meta.glob` 自动收集。
- `src/components`：`GradientASCII`（加载页 ASCII 光场）与 `BinaryOrbits`（整页双星轨道）及其样式。
- `src/motion`：`useSiteMotion`，集中管理开场时间线与 ScrollTrigger 滚动动效。
- `public/assets`：人物图与对比图等静态素材。
- `public/media`：首屏视频、作品集视频及封面。
- `work/`：本地截图、量取脚本和浏览器临时目录，不参与构建。
- `outputs/`：历史截图与打包压缩包，不参与构建；不要直接改动其中的压缩包。

## 维护备注

- `vite.config.js` 中把依赖扫描入口限定为 `index.html`，避免把 `work/` 下的临时 HTML 当成页面入口。
- `GradientASCII` 需要 WebGL2；不支持时加载页会退回 CSS 径向渐变底色。加载结束后组件会卸载，避免后台持续渲染。
- `BinaryOrbits` 是为本项目编写的等效实现（React Bits Pro 的同名组件需要付费授权），不依赖外部库；参数在 `src/App.jsx` 中传入，组件在加载结束后挂载。若需要更明显或更克制，调整各区块 `background` 的透明度或组件内部的星体亮度。
- 动效依赖 `gsap` 与 `ScrollTrigger`；开场会短暂锁定页面滚动，结束后解锁并刷新 ScrollTrigger。`prefers-reduced-motion` 下会跳过所有入场动画并直接显示内容。
- 作品集视频使用 `preload="none"` + 封面 + 点击播放，首次进入不会请求视频文件；当前文件约 12MB（CRF 23 + AAC 128k + faststart），如需更小可再降到 CRF 25。
- 性能处理：首屏视频已压到约 5.3MB，并把灰度、对比度、亮度直接烘焙进画面，去掉全屏 CSS filter；对比图与海报已转 WebP；`BinaryOrbits` 将星云/星野/轨道缓存为静态层、限制 30fps 并按像素预算降 DPR；首屏视频离开视口后暂停；滚动进度直接写 DOM，不再逐帧触发 React 更新。
- 入场元素不再依赖 `.reveal` 的 CSS 过渡，由 `src/motion/useSiteMotion.js` 统一设置初始状态和触发时机；新增模块时在该文件里补对应时间线即可。
- 大字号文字做遮罩 reveal 时，最终值使用负 inset 的 overscan，并在结束时 `clearProps: "clipPath"`。否则 line-height 小于字号时，字形上下溢出会被 `inset(0)` 裁掉，表现为大字显示不全。
- 旧的「项目大卡片 / 项目详情弹窗」已由作品海报区取代，相关组件与样式已移除。
- 首屏视频为现有素材；个人画像已替换为 `portrait-2026.webp`，如需更换保持文件名即可。

## 在线部署

- 线上地址：https://kyuueizei2018-ux.github.io/
- 源码仓库：https://github.com/kyuueizei2018-ux/kyuueizei2018-ux.github.io
- `main` 保存源码，`gh-pages` 保存 `dist` 构建产物；GitHub Pages 从 `gh-pages` 分支发布。
- 更新线上：修改源码并提交 `main`，然后 `npm run build`，把 `dist/` 内容更新到 `gh-pages` 分支。

