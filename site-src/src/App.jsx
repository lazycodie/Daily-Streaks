import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring,
  useMotionValue, useInView, animate, useMotionValueEvent, useReducedMotion,
} from 'motion/react'
import Lenis from 'lenis'

const APK = './DailyStreaks-1.3.0.apk'
const SHA = '6ac28884941074cbeccdc6b41493749f134ce781648a1d62d9e26b7c3edbcdaa'
const ease = [0.22, 1, 0.36, 1]

/* ---------- smooth scrolling (Lenis), off for reduced motion ---------- */
function useLenis(off) {
  useEffect(() => {
    if (off) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let id
    const raf = t => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    const onClick = e => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const el = document.querySelector(a.getAttribute('href'))
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70 }) }
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(id); lenis.destroy(); document.removeEventListener('click', onClick) }
  }, [off])
}

/* ---------- small building blocks ---------- */
function Words({ text, className, delay = 0, now = false }) {
  // Word-by-word rise. The whole phrase is watched for visibility (the words themselves start
  // clipped out of view, so they could never trigger it); children follow via variants.
  const show = { y: '0%' }, hidden = { y: '110%' }
  const trigger = now ? { initial: 'hidden', animate: 'show' } : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } }
  return (
    <motion.span className={className} aria-label={text} {...trigger}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i} aria-hidden="true">
          <motion.span variants={{ hidden, show: { ...show, transition: { duration: 0.9, ease, delay: delay + i * 0.06 } } }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </motion.span>
  )
}

function Reveal({ children, delay = 0, y = 28, className }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease, delay }}>
      {children}
    </motion.div>
  )
}

function Magnetic({ children, className, href, ...rest }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 220, damping: 18 }), y = useSpring(0, { stiffness: 220, damping: 18 })
  const move = e => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25); y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  return (
    <motion.a ref={ref} href={href} className={className} style={{ x, y }} onMouseMove={move}
      onMouseLeave={() => { x.set(0); y.set(0) }} whileTap={{ scale: 0.96 }} {...rest}>
      {children}
    </motion.a>
  )
}

const DownloadButton = ({ big }) => (
  <Magnetic href={APK} download className={big ? 'dl dl-big' : 'dl'}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
    <span><small>Free · 448 KB</small><b>Download for Android</b></span>
  </Magnetic>
)

function Phone({ src, alt, className }) {
  return <div className={'phone ' + (className || '')}><img src={src} alt={alt} draggable="false" /></div>
}

/* ---------- nav: hides on scroll down, returns on scroll up ---------- */
function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', v => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(v > prev && v > 400); setSolid(v > 40)
  })
  return (
    <motion.nav className={'nav' + (solid ? ' solid' : '')} animate={{ y: hidden ? -90 : 0 }} transition={{ duration: 0.35, ease }} aria-label="Main">
      <a className="brand" href="#top"><img src="./img/logo-small.webp" alt="" />Daily Streaks</a>
      <div className="links">
        <a href="#story">Tour</a><a href="#privacy">Privacy</a><a href="#install">Install</a><a href="#faq">FAQ</a>
        <a className="pill" href={APK} download>Download</a>
      </div>
    </motion.nav>
  )
}

/* ---------- hero: giant word behind the floating logo (Aural / Halden), headline rises in ---------- */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const giantY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const giantScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 15 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 15 })
  const tx = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 80, damping: 15 })
  const onMove = e => { mx.set(e.clientX / window.innerWidth * 2 - 1); my.set(e.clientY / window.innerHeight * 2 - 1) }
  return (
    <section className="hero" id="top" ref={ref} onMouseMove={onMove}>
      <motion.div className="hero-glow" style={{ opacity: fade }} aria-hidden="true" />
      <motion.h1 className="giant" style={{ y: giantY, scale: giantScale }}
        initial={{ opacity: 0, letterSpacing: '0.08em' }} animate={{ opacity: 1, letterSpacing: '-0.06em' }}
        transition={{ duration: 1.6, ease }} aria-label="Daily Streaks">streaks</motion.h1>
      <motion.div className="hero-logo" style={{ y: logoY, rotateX: rx, rotateY: ry, x: tx }}
        initial={{ opacity: 0, scale: 0.7, y: 60 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.4, ease, delay: 0.3 }}>
        <motion.img src="./img/logo-float.webp" alt="Daily Streaks logo: two leaves and a rising sun"
          animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div className="hero-foot" style={{ opacity: fade }}>
        <div className="hero-copy">
          <motion.span className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>HABIT TRACKER — ANDROID — V1.3.0</motion.span>
          <h2 className="hero-title">
            <Words text="Small steps," delay={0.7} now /><br />
            <Words text="every day." className="serif-i accent" delay={0.85} now />
          </h2>
        </div>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease }}>
          <p>A calm habit tracker that lives only on your phone. No account. No ads. Nothing sent anywhere.</p>
          <DownloadButton />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------- marquee strip (Otto) ---------- */
function Marquee() {
  const items = ['Less scrolling', 'More doing', 'Streaks that stick', 'No account', 'No ads', 'Yours, offline', 'Small steps, every day']
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, ease: 'linear', repeat: Infinity }}>
        {row.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}
      </motion.div>
    </div>
  )
}

/* ---------- pinned story: one phone, five chapters, colour-blocked backgrounds (Otto / Honey) ---------- */
const CHAPTERS = [
  { n: '01', img: './img/theme-dusk.webp', title: ['Your day,', 'in one timeline.'], body: 'Morning, afternoon, evening. Tap a circle and it is done, with Undo if you slip. A daily focus card keeps your longest streak in view.', bg: '#1C0F09', fg: '#FBEDE3', ac: '#F2A65A' },
  { n: '02', img: './img/progress.webp', title: ['A trail', 'that climbs.'], body: 'Every check-in moves you up the mountain, toward the next landmark and the next badge.', bg: '#0E1F18', fg: '#EEF5EF', ac: '#F08FA6' },
  { n: '03', img: './img/year.webp', title: ['Every month.', 'Every year.'], body: 'Step back to any week, month or year. Goal rate, perfect days and your best streak, all in one place.', bg: '#07101F', fg: '#EAF0FA', ac: '#3CC8D8' },
  { n: '04', img: './img/streaks.webp', title: ['Streaks,', 'remembered.'], body: 'Your longest runs with their dates, and a full-year calendar for every habit.', bg: '#130B08', fg: '#F4EEE8', ac: '#E5653A' },
  { n: '05', img: './img/settings.webp', title: ['Your data,', 'your way.'], body: 'Export everything to Excel, or copy a backup to move to a new phone. It never leaves unless you take it.', bg: '#0A1712', fg: '#EAF5EE', ac: '#7EE3A8' },
]
function Story() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [i, setI] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', v => setI(Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(v * CHAPTERS.length)))))
  const stops = CHAPTERS.map((_, k) => k / (CHAPTERS.length - 1))
  const bg = useTransform(scrollYProgress, stops, CHAPTERS.map(c => c.bg))
  const fg = useTransform(scrollYProgress, stops, CHAPTERS.map(c => c.fg))
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const tilt = useTransform(scrollYProgress, [0, 1], [-4, 4])
  const c = CHAPTERS[i]
  return (
    <section id="story" className="story" ref={ref} style={{ height: `${CHAPTERS.length * 100}vh` }}>
      <motion.div className="story-pin" style={{ background: bg, color: fg }}>
        <div className="story-grid">
          <div className="story-text">
            <span className="mono story-count">{c.n} / 05</span>
            <div className="swap">
            <AnimatePresence initial={false}>
              <motion.div key={c.n} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24, transition: { duration: 0.25 } }} transition={{ duration: 0.5, ease }}>
                <h2 className="story-title">{c.title[0]}<br /><span className="serif-i" style={{ color: c.ac }}>{c.title[1]}</span></h2>
                <p className="story-body">{c.body}</p>
              </motion.div>
            </AnimatePresence>
            </div>
          </div>
          <motion.div className="story-phone" style={{ rotate: tilt }}>
            <AnimatePresence initial={false}>
              <motion.img key={c.img} src={c.img} alt={c.title.join(' ')} initial={{ opacity: 0, scale: 0.94, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.03, y: -24, transition: { duration: 0.3 } }} transition={{ duration: 0.55, ease }} />
            </AnimatePresence>
            <motion.div className="phone-glow" animate={{ backgroundColor: c.ac }} transition={{ duration: 0.8 }} aria-hidden="true" />
          </motion.div>
          <div className="story-rail" aria-hidden="true">
            {CHAPTERS.map((ch, k) => <span key={ch.n} className={k === i ? 'on' : ''} style={k === i ? { background: c.ac } : null} />)}
          </div>
        </div>
        <motion.div className="story-bar" style={{ width: bar, background: c.ac }} aria-hidden="true" />
      </motion.div>
    </section>
  )
}

/* ---------- numbers and spec sheet (NULLWAVE) ---------- */
function Count({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [v, setV] = useState(to === 0 ? 9 : 0)
  useEffect(() => {
    if (!inView) return
    const ctl = animate(to === 0 ? 9 : 0, to, { duration: 1.4, ease, onUpdate: n => setV(Math.round(n)) })
    return () => ctl.stop()
  }, [inView, to])
  return <b ref={ref}>{v}</b>
}
function Privacy() {
  const facts = [[0, 'Accounts', 'No sign-up, no email, no password.'], [0, 'Ads & trackers', 'No analytics, no ad SDKs, no crash reporters.'], [0, 'Bytes sent', 'No internet permission at all.'], [1, 'Permission', 'Vibrate. A tiny buzz when you check off a habit.']]
  const spec = [['INTERNET ACCESS', 'NONE'], ['PERMISSIONS', 'VIBRATE'], ['ANALYTICS / ADS', 'NONE'], ['YOUR HABITS', 'ON DEVICE ONLY'], ['CLOUD BACKUP', 'OFF'], ['EXPORT', 'EXCEL / COPY BACKUP'], ['SIZE', '448 KB'], ['REQUIRES', 'ANDROID 8.0+']]
  return (
    <section id="privacy" className="privacy">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">PRIVATE BY DESIGN</span>
          <h2 className="big-title"><Words text="It stays on" /><br /><Words text="your phone." className="serif-i accent-dark" delay={0.15} /></h2>
        </div>
        <div className="facts">
          {facts.map(([n, t, d], k) => (
            <Reveal key={t} delay={k * 0.08} className="fact"><Count to={n} /><span>{t}</span><small>{d}</small></Reveal>
          ))}
        </div>
        <Reveal className="spec">
          <div className="spec-head mono"><span>DAILY STREAKS 1.3.0</span><span>SPEC SHEET</span></div>
          {spec.map(([k, v]) => <div className="spec-row mono" key={k}><span>{k}</span><i /><span>{v}</span></div>)}
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- themes: vertical scroll drives a sideways track (Diamond / Emails Actually) ---------- */
const THEMES = [
  { img: './img/theme-dusk.webp', name: 'Dusk', note: 'Warm and calm', c: '#E5653A' },
  { img: './img/theme-cosmos.webp', name: 'Cosmos', note: 'A night sky of stars', c: '#3CC8D8' },
  { img: './img/theme-trail.webp', name: 'Trail', note: 'Mountain air', c: '#F08FA6' },
  { img: './img/theme-paper.webp', name: 'Paper', note: 'Clean and light', c: '#F0352B' },
]
function Themes() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-62%'])
  return (
    <section className="themes" ref={ref}>
      <div className="themes-pin">
        <div className="wrap sec-head">
          <span className="mono">FOUR THEMES</span>
          <h2 className="big-title"><Words text="Made to feel" /> <Words text="yours." className="serif-i accent" delay={0.12} /></h2>
        </div>
        <motion.div className="themes-track" style={{ x }}>
          {THEMES.map(t => (
            <motion.figure key={t.name} className="theme-card" whileHover={{ y: -12, rotate: -1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
              <Phone src={t.img} alt={`Today screen in the ${t.name} theme`} />
              <figcaption><b style={{ color: t.c }}>{t.name}</b><span>{t.note}</span></figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- install ---------- */
function Install() {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard?.writeText(SHA).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) }, () => {}) }
  const steps = [['Download', <>Tap <b>Download for Android</b> on your phone. The file is <b>DailyStreaks-1.3.0.apk</b>.</>],
    ['Allow the install', <>Open it from <b>Files → Downloads</b>. If Android asks, allow installs from that app. If Play Protect warns you, tap <b>More details → Install anyway</b>.</>],
    ['Start a streak', <>Pick a few starter habits and check off your first one today.</>]]
  return (
    <section id="install" className="install">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">INSTALL IN A MINUTE</span>
          <h2 className="big-title"><Words text="Three quick" /> <Words text="steps." className="serif-i accent" delay={0.12} /></h2>
          <p className="lede">Daily Streaks is not on Google Play yet, so you install it directly. It is the same signed app.</p>
        </div>
        <ol className="steps">
          {steps.map(([t, d], k) => (
            <Reveal key={t} delay={k * 0.1} className="step"><span className="mono num">0{k + 1}</span><h3>{t}</h3><p>{d}</p></Reveal>
          ))}
        </ol>
        <Reveal className="sha"><span className="mono">SHA-256</span><code>{SHA}</code><button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></Reveal>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
const FAQS = [
  ['Is it really free?', 'Yes. No subscription, no in-app purchases and no ads.'],
  ['Is it safe to install from outside Google Play?', 'Android warns about any app that is not from the Play Store. Daily Streaks is signed, asks only for the vibrate permission and has no internet access. You can check your download against the fingerprint above.'],
  ['Will my habits be backed up?', 'They stay on your phone. To move to a new phone, use Style → Copy backup and paste it into Restore on the new one. You can also export everything to Excel.'],
  ['How do I update?', 'Download the new version from this page and install it over the old one. Your habits are kept.'],
  ['Is there an iPhone version?', 'Not yet. Daily Streaks is Android only for now.'],
  ['Will it come to Google Play?', 'That is the plan. Then you will get automatic updates from the Play Store.'],
]
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="faq">
      <div className="wrap faq-grid">
        <div className="sec-head">
          <span className="mono">QUESTIONS</span>
          <h2 className="big-title"><Words text="Good to" /> <Words text="know." className="serif-i accent" delay={0.1} /></h2>
        </div>
        <div className="qa">
          {FAQS.map(([q, a], k) => (
            <div className={'q' + (open === k ? ' open' : '')} key={q}>
              <button type="button" aria-expanded={open === k} onClick={() => setOpen(open === k ? -1 : k)}>
                <span>{q}</span><motion.i animate={{ rotate: open === k ? 45 : 0 }}>+</motion.i>
              </button>
              <AnimatePresence initial={false}>
                {open === k && (
                  <motion.div className="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- final call to action over a slow holographic glow (Diamond) ---------- */
function Final() {
  return (
    <section className="final">
      <motion.div className="holo" animate={{ rotate: 360 }} transition={{ duration: 40, ease: 'linear', repeat: Infinity }} aria-hidden="true" />
      <div className="final-inner">
        <Reveal><img className="final-logo" src="./img/logo-small.webp" alt="" /></Reveal>
        <h2 className="final-title"><Words text="Start your" /><br /><Words text="streak today." className="serif-i accent" delay={0.12} /></h2>
        <Reveal delay={0.2}><DownloadButton big /></Reveal>
        <Reveal delay={0.3}><p className="final-meta mono">V1.3.0 · 448 KB · ANDROID 8.0+ · FREE</p></Reveal>
      </div>
    </section>
  )
}

export default function App() {
  const reduce = useReducedMotion()
  useLenis(reduce)
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Privacy />
        <Themes />
        <Install />
        <Faq />
        <Final />
      </main>
      <footer className="foot">
        <span>© 2026 Daily Streaks</span>
        <span className="foot-links"><a href="./privacy.html">Privacy policy</a><a href="https://github.com/lazycodie/Daily-Streaks">Source on GitHub</a></span>
      </footer>
    </MotionConfig>
  )
}
