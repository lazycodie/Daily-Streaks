import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring,
  useMotionValue, useInView, animate, useMotionValueEvent, useReducedMotion, useVelocity,
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

/* ---------- 3D: tilt toward the cursor ---------- */
function useTilt(max = 8) {
  const rx = useSpring(0, { stiffness: 150, damping: 15 }), ry = useSpring(0, { stiffness: 150, damping: 15 })
  return {
    style: { rotateX: rx, rotateY: ry, transformPerspective: 1100 },
    onMouseMove: e => {
      const r = e.currentTarget.getBoundingClientRect()
      ry.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max)
    },
    onMouseLeave: () => { rx.set(0); ry.set(0) },
  }
}
function Tilt({ children, className, max }) {
  const t = useTilt(max)
  return <motion.div className={className} {...t}>{children}</motion.div>
}

/* ---------- phone mockups (CSS only) ---------- */
const StatusIcons = () => (
  <svg viewBox="0 0 54 12" aria-hidden="true"><path d="M1 9h2v2H1zM5 7h2v4H5zM9 5h2v6H9zM13 3h2v8h-2z" /><path d="M22 4.5a7 7 0 019 0l-1.2 1.3a5.2 5.2 0 00-6.6 0zM24.4 7a3.6 3.6 0 014.2 0L26.5 9.3z" /><rect x="36" y="2" width="15" height="8" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x="37.6" y="3.6" width="10" height="4.8" rx="1" /><path d="M52.4 5v2.2" stroke="currentColor" strokeWidth="1.2" /></svg>
)
function Device({ kind, src, alt, tag }) {
  return (
    <div className={'device device-' + kind}>
      <span className="btn-a" /><span className="btn-b" />
      <div className="screen">
        <div className="statusbar"><span>{kind === 'ios' ? '9:41' : '12:30'}</span><StatusIcons /></div>
        <img src={src} alt={alt} draggable="false" />
      </div>
      {tag && <span className="device-tag mono">{tag}</span>}
    </div>
  )
}

/* ---------- thin progress bar along the top ---------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
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
        <a href="#try">Try it</a><a href="#story">Tour</a><a href="#privacy">Privacy</a><a href="#install">Install</a><a href="#faq">FAQ</a>
        <a className="pill" href={APK} download>Download</a>
      </div>
    </motion.nav>
  )
}

/* ---------- hero: copy on the left, a 3D tableau of an Android phone and an iPhone on the right ---------- */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const giantY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const spread = useSpring(scrollYProgress, { stiffness: 90, damping: 20 })
  const andX = useTransform(spread, [0, 1], [0, -90]), iosX = useTransform(spread, [0, 1], [0, 90])
  const andR = useTransform(spread, [0, 1], [-14, -34]), iosR = useTransform(spread, [0, 1], [16, 36])
  const lift = useTransform(spread, [0, 1], [0, -60])
  const mx = useMotionValue(0), my = useMotionValue(0)
  const gry = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 70, damping: 16 })
  const grx = useSpring(useTransform(my, [-1, 1], [10, -6]), { stiffness: 70, damping: 16 })
  const onMove = e => { mx.set(e.clientX / window.innerWidth * 2 - 1); my.set(e.clientY / window.innerHeight * 2 - 1) }
  return (
    <section className="hero" id="top" ref={ref} onMouseMove={onMove}>
      <motion.div className="hero-glow" style={{ opacity: fade }} aria-hidden="true" />
      <motion.div className="giant" style={{ y: giantY }} aria-hidden="true"
        initial={{ opacity: 0, letterSpacing: '0.06em' }} animate={{ opacity: 1, letterSpacing: '-0.06em' }} transition={{ duration: 1.6, ease }}>streaks</motion.div>
      <div className="hero-grid">
        <div className="hero-copy">
          <motion.img className="hero-mark" src="./img/logo-small.webp" alt="Daily Streaks logo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} />
          <motion.span className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>HABIT TRACKER — V1.3.0</motion.span>
          <h1 className="hero-title">
            <Words text="Small steps," delay={0.25} now /><br />
            <Words text="every day." className="serif-i accent" delay={0.4} now />
          </h1>
          <motion.p className="hero-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease }}>
            A calm habit tracker that lives only on your phone. No account. No ads. Nothing sent anywhere.
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8, ease }}>
            <DownloadButton />
            <span className="platforms mono"><b>Android</b> available now<br /><span>iOS coming soon</span></span>
          </motion.div>
        </div>
        <motion.div className="tableau" style={{ rotateX: grx, rotateY: gry, opacity: fade }}
          initial={{ opacity: 0, rotateX: 28, y: 90 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: 1.4, ease, delay: 0.2 }}>
          <motion.div className="dev-wrap dev-and" style={{ x: andX, rotateY: andR, y: lift }}>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <Device kind="android" src="./img/theme-dusk.webp" alt="Daily Streaks on an Android phone: the Today screen" tag="Android" />
            </motion.div>
          </motion.div>
          <motion.div className="dev-wrap dev-ios" style={{ x: iosX, rotateY: iosR }}>
            <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
              <Device kind="ios" src="./img/progress.webp" alt="Daily Streaks on an iPhone: the Progress screen" tag="iOS · coming soon" />
            </motion.div>
          </motion.div>
          <motion.span className="float-chip fc-a" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }} transition={{ opacity: { delay: 1.3 }, scale: { delay: 1.3, type: 'spring' }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}>🔥 22-day streak</motion.span>
          <motion.span className="float-chip fc-b" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }} transition={{ opacity: { delay: 1.5 }, scale: { delay: 1.5, type: 'spring' }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}>✓ Meditate · done</motion.span>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- marquee strip (Otto) ---------- */
function Marquee() {
  const items = ['Less scrolling', 'More doing', 'Streaks that stick', 'No account', 'No ads', 'Yours, offline', 'Small steps, every day']
  const row = [...items, ...items]
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 40, stiffness: 300 })
  const skew = useTransform(vel, [-2500, 0, 2500], [6, 0, -6], { clamp: true })
  const boost = useTransform(vel, [-2500, 0, 2500], [-3, 1, 3], { clamp: true })
  const x = useMotionValue(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    let id, last = performance.now()
    const tick = t => {
      const dt = (t - last) / 1000; last = t
      const b = boost.get(); const speed = 3.2 * (Math.abs(b) < 1 ? 1 : Math.abs(b)) // percent of track per second
      let v = x.get() - speed * dt * (b < 0 ? -1 : 1)
      if (v <= -50) v += 50; if (v > 0) v -= 50
      x.set(v); id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [reduce])
  const xPct = useTransform(x, v => `${v}%`)
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="track" style={{ x: xPct, skewX: skew }}>
        {row.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}
      </motion.div>
    </div>
  )
}

/* ---------- interactive mini app: try it right here ---------- */
const DEMO = [
  { id: 'm', icon: '🧘', name: 'Meditate', streak: 21, c: '#5B8CFF' },
  { id: 'w', icon: '💧', name: 'Drink 8 glasses of water', streak: 24, c: '#3CC8D8' },
  { id: 'k', icon: '🚶', name: 'Walk 8,000 steps', streak: 6, c: '#5BC98A' },
  { id: 'r', icon: '📖', name: 'Read 20 minutes', streak: 9, c: '#9B7BFF' },
]
function Burst({ color }) {
  const dots = Array.from({ length: 14 }, (_, i) => i)
  return (
    <span className="burst" aria-hidden="true">
      {dots.map(i => {
        const a = (i / dots.length) * Math.PI * 2, d = 34 + (i % 3) * 12
        return <motion.i key={i} style={{ background: i % 3 ? color : '#E2F27A' }} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 0.2, opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
      })}
    </span>
  )
}
function Demo() {
  const [done, setDone] = useState({})
  const [burst, setBurst] = useState(null)
  const count = Object.values(done).filter(Boolean).length
  const all = count === DEMO.length
  const toggle = h => {
    setDone(d => { const v = !d[h.id]; if (v) { setBurst(h.id + Date.now()); try { navigator.vibrate?.(12) } catch (e) {} } return { ...d, [h.id]: v } })
  }
  const R = 34, L = 2 * Math.PI * R
  return (
    <section className="demo" id="try">
      <div className="wrap demo-grid">
        <div className="sec-head demo-copy">
          <span className="mono">TRY IT RIGHT HERE</span>
          <h2 className="big-title"><Words text="Go on," /><br /><Words text="tick one off." className="serif-i accent" delay={0.12} /></h2>
          <p className="lede">This is how every day feels in Daily Streaks. One tap, a little burst, and your streak grows.</p>
        </div>
        <Reveal y={50}><Tilt className="demo-card" max={6}>
          <div className="demo-head">
            <div>
              <span className="demo-day">Thu<i /></span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={all ? 'all' : count} className="demo-sub" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {all ? 'All done today.' : `${DEMO.length - count} ${DEMO.length - count === 1 ? 'habit' : 'habits'} to go.`}
                </motion.p>
              </AnimatePresence>
            </div>
            <svg className="ring" viewBox="0 0 80 80" aria-label={`${count} of ${DEMO.length} done`}>
              <circle cx="40" cy="40" r={R} className="ring-track" />
              <motion.circle cx="40" cy="40" r={R} className="ring-fill" strokeDasharray={L} animate={{ strokeDashoffset: L * (1 - count / DEMO.length) }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
              <text x="40" y="45" textAnchor="middle">{Math.round(count / DEMO.length * 100)}%</text>
            </svg>
          </div>
          <ul className="demo-list">
            {DEMO.map(h => {
              const on = !!done[h.id]
              return (
                <motion.li key={h.id} layout className={on ? 'on' : ''} style={{ '--c': h.c }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  <span className="demo-ic">{h.icon}</span>
                  <span className="demo-name"><b>{h.name}</b>
                    <small>🔥 <AnimatePresence mode="popLayout" initial={false}><motion.span key={on ? 1 : 0} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>{h.streak + (on ? 1 : 0)}</motion.span></AnimatePresence>-day streak</small>
                  </span>
                  <motion.button type="button" className="demo-chk" onClick={() => toggle(h)} whileTap={{ scale: 0.85 }} aria-pressed={on} aria-label={(on ? 'Undo ' : 'Complete ') + h.name}>
                    <svg viewBox="0 0 24 24"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35 }} /></svg>
                    {burst && burst.startsWith(h.id) && on && <Burst key={burst} color={h.c} />}
                  </motion.button>
                </motion.li>
              )
            })}
          </ul>
          <AnimatePresence>
            {all && (
              <motion.div className="demo-done" initial={{ opacity: 0, height: 0, y: 10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease }}>
                <p><span className="serif-i">A perfect day.</span> Keep it going on your phone.</p>
                <div className="demo-actions"><DownloadButton /><button type="button" className="demo-reset" onClick={() => setDone({})}>Start over</button></div>
              </motion.div>
            )}
          </AnimatePresence>
        </Tilt></Reveal>
      </div>
    </section>
  )
}

/* ---------- pinned story: one phone, five chapters, colour-blocked backgrounds (Otto / Honey) ---------- */
const CHAPTERS = [
  { n: '01', chips: ['🔥 7-week streak', '✓ Meditate · done'], img: './img/theme-dusk.webp', title: ['Your day,', 'in one timeline.'], body: 'Morning, afternoon, evening. Tap a circle and it is done, with Undo if you slip. A daily focus card keeps your longest streak in view.', bg: '#1C0F09', fg: '#FBEDE3', ac: '#F2A65A' },
  { n: '02', chips: ['⛰ 1,580 check-ins', 'Next: High Summit'], img: './img/progress.webp', title: ['A trail', 'that climbs.'], body: 'Every check-in moves you up the mountain, toward the next landmark and the next badge.', bg: '#0E1F18', fg: '#EEF5EF', ac: '#F08FA6' },
  { n: '03', chips: ['88% goal hit rate', '145 perfect days'], img: './img/year.webp', title: ['Every month.', 'Every year.'], body: 'Step back to any week, month or year. Goal rate, perfect days and your best streak, all in one place.', bg: '#07101F', fg: '#EAF0FA', ac: '#3CC8D8' },
  { n: '04', chips: ['Best: 53 days', 'Jul 16 – Sep 6'], img: './img/streaks.webp', title: ['Streaks,', 'remembered.'], body: 'Your longest runs with their dates, and a full-year calendar for every habit.', bg: '#130B08', fg: '#F4EEE8', ac: '#E5653A' },
  { n: '05', chips: ['⇣ Export to Excel', '0 bytes sent'], img: './img/settings.webp', title: ['Your data,', 'your way.'], body: 'Export everything to Excel, or copy a backup to move to a new phone. It never leaves unless you take it.', bg: '#0A1712', fg: '#EAF5EE', ac: '#7EE3A8' },
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
  const turn = useTransform(scrollYProgress, [0, 1], [-24, 24])
  const c = CHAPTERS[i]
  return (
    <section id="story" className="story" ref={ref} style={{ height: `${CHAPTERS.length * 70 + 30}vh` }}>
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
          <motion.div className="story-phone" style={{ rotateY: turn, transformPerspective: 1400 }}>
            <AnimatePresence initial={false}>
              <motion.img key={c.img} src={c.img} alt={c.title.join(' ')} initial={{ opacity: 0, rotateY: -80, scale: 0.94 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: 80, scale: 0.94, transition: { duration: 0.3 } }} transition={{ duration: 0.6, ease }} style={{ backfaceVisibility: 'hidden' }} />
            </AnimatePresence>
            <motion.div className="phone-glow" animate={{ backgroundColor: c.ac }} transition={{ duration: 0.8 }} aria-hidden="true" />
            <AnimatePresence initial={false}>
              {c.chips.map((t, k) => (
                <motion.span key={c.n + k} className={'chip chip-' + k} style={{ borderColor: c.ac }}
                  initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 + k * 0.12 }}>{t}</motion.span>
              ))}
            </AnimatePresence>
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
  const band = useRef(null)
  const { scrollYProgress: inP } = useScroll({ target: band, offset: ['start end', 'start 0.25'] })
  const inset = useTransform(inP, [0, 1], [6, 0])
  const radius = useTransform(inP, [0, 1], [48, 0])
  const clip = useTransform([inset, radius], ([i, r]) => `inset(0 ${i}% round ${r}px)`)
  const facts = [[0, 'Accounts', 'No sign-up, no email, no password.'], [0, 'Ads & trackers', 'No analytics, no ad SDKs, no crash reporters.'], [0, 'Bytes sent', 'No internet permission at all.'], [1, 'Permission', 'Vibrate. A tiny buzz when you check off a habit.']]
  const spec = [['INTERNET ACCESS', 'NONE'], ['PERMISSIONS', 'VIBRATE'], ['ANALYTICS / ADS', 'NONE'], ['YOUR HABITS', 'ON DEVICE ONLY'], ['CLOUD BACKUP', 'OFF'], ['EXPORT', 'EXCEL / COPY BACKUP'], ['SIZE', '448 KB'], ['REQUIRES', 'ANDROID 8.0+']]
  return (
    <motion.section id="privacy" className="privacy" ref={band} style={{ clipPath: clip }}>
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
          {spec.map(([k, v], n) => (
            <motion.div className="spec-row mono" key={k} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.4, delay: n * 0.06 }}>
              <span>{k}</span><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 + n * 0.06 }} /><span>{v}</span>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </motion.section>
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
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  useLayoutEffect(() => {
    const m = () => { const t = track.current; if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 40)) }
    m(); window.addEventListener('resize', m); return () => window.removeEventListener('resize', m)
  }, [])
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist])
  const up = useTransform(scrollYProgress, [0, 1], [30, -30]), down = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const spin = useTransform(scrollYProgress, [0, 1], [32, -32])
  return (
    <section className="themes" ref={ref}>
      <div className="themes-pin">
        <div className="wrap">
          <div className="sec-head">
            <span className="mono">FOUR THEMES</span>
            <h2 className="big-title"><Words text="Made to feel" /> <Words text="yours." className="serif-i accent" delay={0.12} /></h2>
          </div>
        </div>
        <motion.div className="themes-track" ref={track} style={{ x }}>
          {THEMES.map((t, k) => (
            <motion.figure key={t.name} className="theme-card" style={{ y: k % 2 ? down : up, rotateY: spin, transformPerspective: 1200 }} whileHover={{ scale: 1.03, rotate: -1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
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
            <Reveal key={t} delay={k * 0.1}><Tilt className="step" max={7}><span className="mono num">0{k + 1}</span><h3>{t}</h3><p>{d}</p></Tilt></Reveal>
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
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Demo />
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
