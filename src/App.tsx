import { ChangeEvent, useEffect, useRef, useState } from "react"

type MemoryKind = "image" | "video"

interface Memory {
  id: string
  kind: MemoryKind
  src: string
  location: string
  date: string
  isUpload?: boolean
}

const SEED_MEMORIES: Memory[] = [
  {
    id: "hongya",
    kind: "image",
    src: "https://images.unsplash.com/photo-1790413887568-7c86b0f57988?auto=format&fit=crop&w=1200&q=88",
    location: "洪崖洞 · 嘉陵江畔",
    date: "2025.05.20",
  },
  {
    id: "bridge",
    kind: "image",
    src: "https://images.unsplash.com/photo-1770648296175-c4622ebab01d?auto=format&fit=crop&w=1200&q=88",
    location: "千厮门大桥 · 夜游",
    date: "2025.05.21",
  },
  {
    id: "skyline",
    kind: "image",
    src: "https://images.unsplash.com/photo-1783767849715-3de45b60b94a?auto=format&fit=crop&w=1200&q=88",
    location: "两江交汇 · 山城夜色",
    date: "2025.05.22",
  },
]

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5h3l1.4-2h7.2l1.4 2h3a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13.2" r="4.2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 9 6-9 6V6Z" />
    </svg>
  )
}

function MountainMark() {
  return (
    <svg className="mountain-mark" viewBox="0 0 112 46" aria-hidden="true">
      <path d="M7 37 33 10l12 15L57 7l20 30M39 37l17-18 10 10 9-9 30 17" />
      <path d="M2 40h108" />
    </svg>
  )
}

function App() {
  const [introPhase, setIntroPhase] = useState<"visible" | "exiting" | "hidden">(
    "visible",
  )
  const [memories, setMemories] = useState<Memory[]>(SEED_MEMORIES)
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewer, setViewer] = useState<Memory | null>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [toast, setToast] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const tapCount = useRef(0)
  const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStart = useRef(0)
  const uploadInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const exitTimer = window.setTimeout(
      () =>
        setIntroPhase((current) =>
          current === "visible" ? "exiting" : current,
        ),
      4200,
    )
    const hideTimer = window.setTimeout(() => setIntroPhase("hidden"), 4900)
    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (viewer || manageOpen || isDragging || memories.length < 2) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % memories.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [viewer, manageOpen, isDragging, memories.length])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (activeIndex >= memories.length) {
      setActiveIndex(Math.max(0, memories.length - 1))
    }
  }, [activeIndex, memories.length])

  const moveCarousel = (direction: number) => {
    if (memories.length < 2) return
    setActiveIndex(
      (current) => (current + direction + memories.length) % memories.length,
    )
  }

  const handleSecretTap = () => {
    tapCount.current += 1
    if (tapResetTimer.current) window.clearTimeout(tapResetTimer.current)
    if (tapCount.current >= 5) {
      tapCount.current = 0
      setManageOpen(true)
      setToast("已进入记忆管理")
      return
    }
    tapResetTimer.current = setTimeout(() => {
      tapCount.current = 0
    }, 1800)
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 6)
    const accepted = files.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type === "video/mp4" || file.type === "video/quicktime"
      const withinLimit = isImage
        ? file.size <= 10 * 1024 * 1024
        : file.size <= 100 * 1024 * 1024
      return (isImage || isVideo) && withinLimit
    })

    if (!accepted.length) {
      setToast("请选择符合大小要求的照片或视频")
      event.target.value = ""
      return
    }

    const now = new Date()
    const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`
    const additions: Memory[] = accepted.map((file, index) => ({
      id: `${now.getTime()}-${index}`,
      kind: file.type.startsWith("video/") ? "video" : "image",
      src: URL.createObjectURL(file),
      location: "我的重庆 · 新记忆",
      date,
      isUpload: true,
    }))
    setMemories((current) => [...current, ...additions])
    setActiveIndex(memories.length)
    setToast(`已收藏 ${additions.length} 段新记忆`)
    event.target.value = ""
  }

  const deleteMemory = (memory: Memory) => {
    if (!window.confirm("确定删除这段山城记忆吗？删除后无法恢复。")) return
    if (memory.isUpload) URL.revokeObjectURL(memory.src)
    setMemories((current) => current.filter((item) => item.id !== memory.id))
    setToast("记忆已删除")
  }

  const activeMemory = memories[activeIndex]

  return (
    <main className="app-shell">
      <section className="memory-space" aria-label="NFC 头箍数字记忆空间">
        {introPhase !== "hidden" && (
          <button
            className={`intro-cover ${introPhase}`}
            type="button"
            aria-label="山城拾光封面，点击跳过"
            onClick={() => setIntroPhase("hidden")}
          >
            <span className="intro-backdrop" aria-hidden="true" />
            <span className="intro-grain" aria-hidden="true" />
            <span className="intro-stars" aria-hidden="true" />

            <svg className="memory-orbit-svg" viewBox="0 0 390 780" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="memoryLineGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#78caff" stopOpacity="0.05" />
                  <stop offset="48%" stopColor="#b9e7ff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#e6bd82" stopOpacity="0.2" />
                </linearGradient>
                <filter id="memoryGlow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <path className="memory-line memory-line-a" d="M-30 300 C70 210 115 275 185 220 S310 155 425 205" />
              <path className="memory-line memory-line-b" d="M-20 410 C70 470 115 360 205 415 S315 490 420 390" />
              <path className="memory-line memory-line-c" d="M-20 570 C75 520 130 630 210 585 S325 555 420 620" />
              <circle className="memory-node node-a" cx="80" cy="267" r="3" />
              <circle className="memory-node node-b" cx="304" cy="190" r="3" />
              <circle className="memory-node node-c" cx="112" cy="433" r="3" />
              <circle className="memory-node node-d" cx="300" cy="583" r="3" />
              <circle className="memory-pulse" cx="80" cy="267" r="9" />
              <circle className="memory-pulse pulse-b" cx="300" cy="583" r="9" />
            </svg>

            <span className="intro-nfc"><i /> NFC MEMORY <b>· CQ-028</b></span>
            <span className="intro-coordinate coordinate-left" aria-hidden="true"><i /> 29°33′N <span>/</span> 106°33′E</span>
            <span className="intro-coordinate coordinate-right" aria-hidden="true">MEMORY SYSTEM <i /></span>

            <span className="intro-title">
              <small><i /> CHONGQING · MEMORY AWAKENED <i /></small>
              <strong>山城拾光</strong>
              <em>一枚头箍 · 一段重庆记忆</em>
            </span>
            <span className="intro-mountains" aria-hidden="true"><MountainMark /></span>

            <span className="memory-float-card memory-card-one" aria-hidden="true">
              <i className="memory-card-pin" />
              <span><b>01 / CITY LIGHTS</b><small>洪崖洞 · 嘉陵江畔</small></span>
              <i className="memory-card-signal" />
            </span>
            <span className="memory-float-card memory-card-two" aria-hidden="true">
              <i className="memory-card-pin" />
              <span><b>02 / NIGHT WALK</b><small>千厮门大桥 · 夜游</small></span>
              <i className="memory-card-signal" />
            </span>

            <span className="intro-scan-ring" aria-hidden="true">
              <i className="scan-ring ring-one" /><i className="scan-ring ring-two" />
              <i className="scan-core" /><b>NFC</b>
            </span>
            <span className="intro-progress"><i /></span>
            <span className="intro-skip">轻触进入 <i>↗</i></span>
          </button>
        )}
        <div className="stars" aria-hidden="true" />
        <header className="topbar">
          <div className="nfc-status">
            <span className="signal" />
            NFC MEMORY · CQ 028
          </div>
          <button
            className="secret-menu"
            type="button"
            aria-label="更多选项"
            onClick={handleSecretTap}
          >
            <i />
            <i />
            <i />
          </button>
        </header>

        <div className="title-block">
          <div className="city-eyebrow">
            <span />
            重庆
            <span />
          </div>
          <h1>山城拾光</h1>
          <p>一枚头箍 · 一段重庆记忆</p>
          <div className="skyline-line" aria-hidden="true">
            <span className="tower" />
            <span className="building short" />
            <span className="building tall" />
            <span className="building" />
            <span className="bridge" />
          </div>
        </div>

        <section className="carousel-section" aria-label="重庆旅行记忆轮播">
          {memories.length ? (
            <>
              <div
                className="polaroid-stage"
                onTouchStart={(event) => {
                  touchStart.current = event.touches[0].clientX
                  setIsDragging(true)
                }}
                onTouchEnd={(event) => {
                  const distance =
                    event.changedTouches[0].clientX - touchStart.current
                  if (Math.abs(distance) > 42) moveCarousel(distance > 0 ? -1 : 1)
                  setIsDragging(false)
                }}
              >
                {memories.map((memory, index) => {
                  const offset =
                    (index - activeIndex + memories.length) % memories.length
                  const position =
                    offset === 0
                      ? "active"
                      : offset === 1
                        ? "next"
                        : offset === memories.length - 1
                          ? "previous"
                          : "hidden"
                  return (
                    <button
                      className={`polaroid ${position}`}
                      type="button"
                      key={memory.id}
                      onClick={() => {
                        if (position === "active") setViewer(memory)
                        else if (position === "next") moveCarousel(1)
                        else if (position === "previous") moveCarousel(-1)
                      }}
                      aria-label={`${memory.location}，点击查看`}
                      tabIndex={position === "hidden" ? -1 : 0}
                    >
                      <span className="photo-frame">
                        {memory.kind === "image" ? (
                          <img src={memory.src} alt={memory.location} />
                        ) : (
                          <video src={memory.src} muted playsInline />
                        )}
                        {memory.kind === "video" && (
                          <span className="video-badge">
                            <PlayIcon />
                          </span>
                        )}
                      </span>
                      <span className="photo-caption">
                        <strong>{memory.location}</strong>
                        <small>{memory.date}</small>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="carousel-controls">
                <div className="dots" aria-label="轮播位置">
                  {memories.map((memory, index) => (
                    <button
                      type="button"
                      key={memory.id}
                      className={index === activeIndex ? "current" : ""}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`查看第 ${index + 1} 段记忆`}
                    />
                  ))}
                </div>
                <p>
                  <span>←</span> 左右滑动 · 收藏山城记忆 <span>→</span>
                </p>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <CameraIcon />
              <h2>等待第一段山城记忆</h2>
              <p>上传一张照片，让这枚头箍替你珍藏此刻。</p>
            </div>
          )}
        </section>

        <section className="city-footer">
          <div className="paper-plane" aria-hidden="true">
            <span>重庆 · 记忆留影</span>
          </div>
          <div className="footer-content">
            <p className="memory-count">
              已珍藏 <strong>{String(memories.length).padStart(2, "0")}</strong>{" "}
              段山城记忆
            </p>
            <button
              className="upload-cta"
              type="button"
              onClick={() => uploadInput.current?.click()}
            >
              <CameraIcon />
              <span>
                <strong>留下这一刻</strong>
                <small>照片与视频将收藏进头箍</small>
              </span>
              <b>→</b>
            </button>
            <div className="brand-mark">
              <MountainMark />
              <p>山城有雾 · 记忆有光</p>
            </div>
          </div>
        </section>

        <input
          ref={uploadInput}
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
          multiple
          onChange={handleUpload}
        />

        {viewer && (
          <div
            className="viewer"
            role="dialog"
            aria-modal="true"
            aria-label="查看旅行记忆"
            onClick={() => setViewer(null)}
          >
            <button
              type="button"
              className="close-button"
              aria-label="关闭"
              onClick={() => setViewer(null)}
            >
              <CloseIcon />
            </button>
            <div className="viewer-media" onClick={(event) => event.stopPropagation()}>
              {viewer.kind === "image" ? (
                <img src={viewer.src} alt={viewer.location} />
              ) : (
                <video src={viewer.src} controls autoPlay playsInline />
              )}
              <div>
                <strong>{viewer.location}</strong>
                <span>{viewer.date}</span>
              </div>
            </div>
          </div>
        )}

        {manageOpen && (
          <aside className="manager" aria-label="记忆管理">
            <header>
              <div>
                <span>MEMORY MANAGER</span>
                <h2>管理山城记忆</h2>
              </div>
              <button
                type="button"
                aria-label="关闭管理"
                onClick={() => setManageOpen(false)}
              >
                <CloseIcon />
              </button>
            </header>
            <button
              type="button"
              className="manager-upload"
              onClick={() => uploadInput.current?.click()}
            >
              <CameraIcon />
              <span>
                <strong>上传照片或视频</strong>
                <small>单次最多 6 个文件</small>
              </span>
              <b>＋</b>
            </button>
            <p className="manager-tip">
              照片不超过 10 MB，视频不超过 100 MB
            </p>
            <div className="manager-grid">
              {memories.map((memory) => (
                <article key={memory.id}>
                  {memory.kind === "image" ? (
                    <img src={memory.src} alt={memory.location} />
                  ) : (
                    <video src={memory.src} muted playsInline />
                  )}
                  <button
                    type="button"
                    onClick={() => deleteMemory(memory)}
                    aria-label={`删除${memory.location}`}
                  >
                    删除
                  </button>
                </article>
              ))}
            </div>
          </aside>
        )}

        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  )
}

export default App
