import { useState, useEffect, useRef } from "react";
import Footer from "./footer";

import imgE01 from "./assets/exhibits/E01.jpg";
import imgE02 from "./assets/exhibits/E02.jpg";
import imgE03 from "./assets/exhibits/E03.jpg";
import imgE04 from "./assets/exhibits/E04.jpg";
import imgE05 from "./assets/exhibits/E05.jpg";
import imgE06 from "./assets/exhibits/E06.jpg";

/* ── Types ────────────────────────────────────────────────────────── */
interface Exhibit {
  id: string;
  nfcTag: string;
  name: string;
  hall: string;
  dynasty: string;
  category: string;
  imageUrl: string;   // ← 把 imageId 改成 imageUrl
  // imageId: string;
  stampColor: string;
  stampSymbol: string;
  challenge: string;
  challengeOptions: string[];
  challengeAnswer: number;
  funFact: string;
}

interface StampRecord {
  exhibitId: string;
  time: string;
  answeredCorrect: boolean;
}

/* ── Data ─────────────────────────────────────────────────────────── */
const EXHIBITS: Exhibit[] = [
  {
    id: "E01",
    nfcTag: "NFC-E01",
    name: "金代铜坐龙",
    hall: "黑龙江历史文物馆",
    dynasty: "金·大定",
    category: "铜器",
    // imageId: "photo-1578662996442-48f60103fc96",
    imageUrl: imgE01,
    stampColor: "#7a8f6a",
    stampSymbol: "龙",
    challenge: "金代铜坐龙的造型融合了哪些动物的特征？",
    challengeOptions: ["龙、麒麟、狮、犬", "龙、凤、虎、龟", "龙、马、牛、羊", "龙、蛇、鹰、鹿"],
    challengeAnswer: 0,
    funFact: "铜坐龙出土于金上京会宁府遗址，集龙、麒麟、狮、犬特征于一身，是金代皇家御用器物，也是黑龙江省博物馆的镇馆之宝之一。",
  },
  {
    id: "E02",
    nfcTag: "NFC-E02",
    name: "金代齐国王墓丝织品服饰",
    hall: "黑龙江历史文物馆",
    dynasty: "金·大定",
    category: "丝织品",
    // imageId: "photo-1545126131-11e5df3fbcb3",
    imageUrl: imgE02,
    stampColor:  "#a8506a",   // 丝织品可用绛红/织锦色调
    stampSymbol: "织",
    challenge: "金代齐国王墓出土的丝织品服饰，主要反映了当时哪一阶层的服饰制度？",
    challengeOptions: ["平民百姓", "皇室贵族", "僧侣阶层", "商贾富户"],
    challengeAnswer: 1,
    funFact: "金代齐国王墓被誉为「塞北马王堆」，出土丝织品服饰种类繁多、保存完好，是研究金代服饰制度与纺织工艺的珍贵实物。",
  },
  {
    id: "E03",
    nfcTag: "NFC-E03",
    name: "南宋《蚕织图》卷轴",
    hall: "书画艺术馆",
    dynasty: "南宋",
    category: "书画",
    // imageId: "photo-1608037521277-154cd1b89191",
    imageUrl: imgE03,
    stampColor: "#8a6a3a",
    stampSymbol: "蚕",
    challenge: "《蚕织图》描绘的主要内容是？",
    challengeOptions: ["宫廷宴乐", "蚕桑与丝织生产", "山水风光", "佛教经变"],
    challengeAnswer: 1,
    funFact: "《蚕织图》以长卷形式细致描绘了从浴蚕、养蚕到织帛的全过程，是研究南宋蚕桑丝织技术与民俗生活的珍贵图像资料。",
  },
  {
    id: "E04",
    nfcTag: "NFC-E04",
    name: "唐代渤海天门军之印",
    hall: "黑龙江历史文物馆",
    dynasty: "唐·渤海国",
    category: "印章",
    // imageId: "photo-1586190848861-99aa4a171e90",
    imageUrl: imgE04,
    stampColor: "#8b5a3a",// 铜印褐锈色，可保留
    stampSymbol: "印",
    challenge: "「天门军之印」中的「天门军」最可能是指？",
    challengeOptions: ["渤海国的一支军队", "唐代宫廷禁军", "地方行政机构", "民间武装"],
    challengeAnswer: 0,
    funFact: "天门军之印出土于渤海国上京龙泉府遗址，是渤海国仿唐官制的实物证据，说明渤海国在军政制度上深受唐朝影响。",
  },
  {
    id: "E05",
    nfcTag: "NFC-E05",
    name: "披毛犀化石骨架",
    hall: "古生物馆",
    dynasty: "更新世",
    category: "化石",
    // imageId: "photo-1565193566173-7a0ee3dbe261",
    imageUrl: imgE05,
    stampColor: "#7a8f6a",
    stampSymbol: "犀",
    challenge: "披毛犀属于哪一类动物？",
    challengeOptions: ["食肉动物", "大型植食性哺乳动物", "鸟类", "爬行动物"],
    challengeAnswer: 1,
    funFact: "披毛犀是更新世冰期代表性动物，全身披长毛以适应寒冷气候，化石在东北地区多有发现。",
    },
  {
    id: "E06",
    nfcTag: "NFC-E06",
    name: "南宋《兰亭序》图卷",
    hall: "书画艺术馆",
    dynasty: "南宋",
    category: "书画",
    // imageId: "photo-1551009175-8a68da93d5f9",
    imageUrl: imgE06,
    stampColor: "#6a7a9a",   // 文人书画的青墨调
    stampSymbol: "书",
    challenge: "《兰亭序》原是东晋王羲之在什么场合写下的？",
    challengeOptions: ["宫廷宴饮", "兰亭修禊雅集", "出征饯行", "佛寺讲经"],
    challengeAnswer: 1,
    funFact: "《兰亭序》被誉为「天下第一行书」，南宋摹本图卷虽非真迹，却保留了王羲之书风与兰亭雅集的历史场景，是研究书法与文人文化的重要资料。",
  },
];

const ACHIEVEMENTS = [
  { id: "first", name: "初探珍宝", desc: "完成第一次打卡", icon: "🌟", need: 1 },
  { id: "half", name: "半程探索者", desc: "打卡超过一半展品", icon: "🔍", need: 3 },
  { id: "scholar", name: "文物学者", desc: "答题全部正确", icon: "📜", need: 0, special: "allCorrect" },
  { id: "complete", name: "馆藏通", desc: "集齐全部印章", icon: "🏆", need: 6 },
];

type Screen = "home" | "tap" | "tapping" | "challenge" | "stamp" | "collection" | "achievement";

/* ── App ──────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [stamps, setStamps] = useState<StampRecord[]>([]);
  const [current, setCurrent] = useState<Exhibit>(EXHIBITS[0]);
  const [tapping, setTapping] = useState(false);
  const [tapProgress, setTapProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [newStamp, setNewStamp] = useState(false);
  const [activeNav, setActiveNav] = useState<"home" | "collection">("home");

  const tapTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const alreadyStamped = (id: string) => stamps.some((s) => s.exhibitId === id);
  const correctCount = stamps.filter((s) => s.answeredCorrect).length;

  const handleSimulateTap = (exhibit: Exhibit) => {
    setCurrent(exhibit);
    setScreen("tap");
    setTapProgress(0);
    setTapping(false);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  // const startTap = () => {
  //   setTapping(true);
  //   setTapProgress(0);
  //   let p = 0;
  //   tapTimer.current = setInterval(() => {
  //     p += 4;
  //     setTapProgress(p);
  //     if (p >= 100) {
  //       clearInterval(tapTimer.current!);
  //       setScreen("tapping");
  //       setTimeout(() => {
  //         setScreen(alreadyStamped(current.id) ? "stamp" : "challenge");
  //       }, 1800);
  //     }
  //   }, 60);
  // };
  const startTap = () => {
    // 防止重复触发（iOS 触摸会同时触发 touchstart + mousedown）
    if (tapTimer.current || transitionTimer.current) return;
    if (tapping) return;
  
    setTapping(true);
    setTapProgress(0);
    let p = 0;
  
    tapTimer.current = setInterval(() => {
      p += 4;
      setTapProgress(p);
  
      if (p >= 100) {
        // 先清理 interval
        if (tapTimer.current) {
          clearInterval(tapTimer.current);
          tapTimer.current = null;
        }
  
        setScreen("tapping");
  
        // 存下 timeout 引用，方便取消
        transitionTimer.current = setTimeout(() => {
          transitionTimer.current = null;
          setTapping(false);
          setScreen(alreadyStamped(current.id) ? "stamp" : "challenge");
        }, 1800);
      }
    }, 60);
  };
  
  useEffect(() => {
    // 只要不在 tap / tapping 页面，就清掉所有定时器
    if (screen !== "tap" && screen !== "tapping") {
      if (tapTimer.current) {
        clearInterval(tapTimer.current);
        tapTimer.current = null;
      }
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
      setTapping(false);
    }
  }, [screen]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    setTimeout(() => {
      const correct = idx === current.challengeAnswer;
      const record: StampRecord = {
        exhibitId: current.id,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        answeredCorrect: correct,
      };
      setStamps((prev) => [...prev.filter((s) => s.exhibitId !== current.id), record]);
      setNewStamp(true);
      setScreen("stamp");
      setTimeout(() => setNewStamp(false), 3000);
    }, 900);
  };

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => {
    if (a.special === "allCorrect") return correctCount > 0 && correctCount === stamps.length;
    return stamps.length >= a.need;
  });

  if (screen === "collection" || activeNav === "collection") {
    return (
      <Shell>
        <CollectionScreen
          exhibits={EXHIBITS}
          stamps={stamps}
          achievements={unlockedAchievements}
          onBack={() => { setActiveNav("home"); setScreen("home"); }}
          onTap={handleSimulateTap}
        />
        <NavBar active="collection" onChange={(v) => { setActiveNav(v); if (v === "home") setScreen("home"); }} />
      </Shell>
    );
  }

  if (screen === "home") {
    return (
      <Shell>
        <HomeScreen
          exhibits={EXHIBITS}
          stamps={stamps}
          onSimulate={handleSimulateTap}
        />
        <NavBar active="home" onChange={(v) => { setActiveNav(v); if (v === "collection") setScreen("collection"); }} />
      </Shell>
    );
  }

  if (screen === "tap") {
    return (
      <Shell>
        <TapScreen
          exhibit={current}
          tapping={tapping}
          progress={tapProgress}
          alreadyStamped={alreadyStamped(current.id)}
          onStart={startTap}
          // onCancel={() => setScreen("home")}
          onCancel={() => {
            if (tapTimer.current) {
              clearInterval(tapTimer.current);
              tapTimer.current = null;
            }
            if (transitionTimer.current) {
              clearTimeout(transitionTimer.current);
              transitionTimer.current = null;
            }
            setTapping(false);
            setScreen("home");
          }}
        />
      </Shell>
    );
  }

  if (screen === "tapping") {
    return (
      <Shell>
        <TappingScreen exhibit={current} />
      </Shell>
    );
  }

  if (screen === "challenge") {
    return (
      <Shell>
        <ChallengeScreen
          exhibit={current}
          selectedAnswer={selectedAnswer}
          answered={answered}
          onAnswer={handleAnswer}
        />
      </Shell>
    );
  }

  if (screen === "stamp") {
    const record = stamps.find((s) => s.exhibitId === current.id);
    return (
      <Shell>
        <StampScreen
          exhibit={current}
          record={record!}
          totalStamps={stamps.length}
          totalExhibits={EXHIBITS.length}
          isNew={newStamp}
          onNext={() => setScreen("home")}
          onCollection={() => { setActiveNav("collection"); setScreen("collection"); }}
        />
      </Shell>
    );
  }

  return null;
}

/* ── Shell ────────────────────────────────────────────────────────── */
function Shell({ children,footer }: { children: React.ReactNode ; footer?: React.ReactNode }) {
  return (
    <div className="size-full flex items-center justify-center bg-[#0f0e0c]">
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100dvh)",
          background: "#16140f",
          borderRadius: "min(44px, 5vw)",
          boxShadow: "0 48px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,169,110,0.08)",
        }}
      >
        {children}
        {footer}
      </div>
    </div>
  );
}

/* ── NavBar ───────────────────────────────────────────────────────── */
function NavBar({ active, onChange }: { active: "home" | "collection"; onChange: (v: "home" | "collection") => void }) {
  return (
    <div className="flex-none flex justify-around items-center py-4 pb-8" style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}>
      {[
        { key: "home" as const, icon: "🏛️", label: "打卡" },
        { key: "collection" as const, icon: "📜", label: "我的藏章" },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className="flex flex-col items-center gap-1"
          style={{ color: active === item.key ? "#c9a96e" : "#4a4030", fontFamily: "var(--font-mono)", fontSize: 11 }}
        >
          <span className="text-xl">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── Home Screen ──────────────────────────────────────────────────── */
function HomeScreen({ exhibits, stamps, onSimulate }: { exhibits: Exhibit[]; stamps: StampRecord[]; onSimulate: (e: Exhibit) => void }) {
  const done = stamps.length;
  const pct = Math.round((done / exhibits.length) * 100);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none px-6 pt-14 pb-5">
        <div className="text-xs tracking-[0.2em] mb-3" style={{ color: "#c9a96e", fontFamily: "var(--font-mono)" }}>
          黑龙江省博物馆 · NFC 打卡集章
        </div>
        <h1 className="text-[26px] leading-snug mb-4" style={{ fontFamily: "var(--font-display)", color: "#e8dfc8" }}>
          探馆集章，<em style={{ color: "#c9a96e" }}>解锁历史</em>
        </h1>

        {/* Progress bar */}
        <div className="rounded-xl p-4" style={{ background: "#1c1a15", border: "1px solid rgba(201,169,110,0.12)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "#8a7a60", fontFamily: "var(--font-mono)" }}>打卡进度</span>
            <span className="text-xs font-medium" style={{ color: "#c9a96e", fontFamily: "var(--font-mono)" }}>
              {done} / {exhibits.length} 件
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "rgba(201,169,110,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8a6a30, #c9a96e)" }}
            />
          </div>
          <div className="text-xs mt-2" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
            {pct === 0 ? "碰触展柜 NFC 标签开始打卡" : pct === 100 ? "🎉 全部集齐！" : `还差 ${exhibits.length - done} 件即可集齐全套印章`}
          </div>
        </div>
      </div>

      {/* Exhibit list */}
      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="text-xs tracking-[0.12em] mb-3" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
          展品列表 · 点击模拟 NFC 碰触
        </div>
        <div className="flex flex-col gap-3">
          {exhibits.map((ex) => {
            const stamped = stamps.some((s) => s.exhibitId === ex.id);
            const rec = stamps.find((s) => s.exhibitId === ex.id);
            return (
              <ExhibitRow
                key={ex.id}
                exhibit={ex}
                stamped={stamped}
                correct={rec?.answeredCorrect}
                time={rec?.time}
                onTap={() => onSimulate(ex)}
              />
            );
          })}
        </div>
        <Footer />
      </div>
      
    </div>
  );
}

function ExhibitRow({ exhibit, stamped, correct, time, onTap }: {
  exhibit: Exhibit; stamped: boolean; correct?: boolean; time?: string; onTap: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-3 text-left w-full rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: hover ? "#201d18" : "#1a1814",
        border: `1px solid ${stamped ? "rgba(201,169,110,0.2)" : hover ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.05)"}`,
        padding: "10px 12px",
        transform: hover ? "translateY(-1px)" : "none",
      }}
    >
      {/* Stamp circle */}
      <div
        className="flex-none flex items-center justify-center rounded-full text-base font-bold transition-all duration-300"
        style={{
          width: 44,
          height: 44,
          background: stamped ? `${exhibit.stampColor}22` : "#1e1c17",
          border: `2px solid ${stamped ? exhibit.stampColor : "rgba(255,255,255,0.06)"}`,
          color: stamped ? exhibit.stampColor : "#3a3528",
          fontFamily: "var(--font-display)",
          boxShadow: stamped ? `0 0 12px ${exhibit.stampColor}40` : "none",
        }}
      >
        {stamped ? exhibit.stampSymbol : "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug" style={{ color: stamped ? "#e8dfc8" : "#7a6e5c", fontFamily: "var(--font-body)" }}>
          {exhibit.name}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs" style={{ color: "#4a4030", fontFamily: "var(--font-mono)" }}>
            {exhibit.hall} · {exhibit.dynasty}
          </span>
          {stamped && time && (
            <span className="text-xs" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>· {time}</span>
          )}
        </div>
      </div>

      <div className="flex-none flex items-center gap-1.5">
        {stamped && (
          <div
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              background: correct ? "rgba(80,160,80,0.15)" : "rgba(160,80,80,0.15)",
              color: correct ? "#6aaa6a" : "#aa6a6a",
              fontFamily: "var(--font-mono)",
              border: `1px solid ${correct ? "rgba(80,160,80,0.25)" : "rgba(160,80,80,0.25)"}`,
              fontSize: 10,
            }}
          >
            {correct ? "答对" : "答错"}
          </div>
        )}
        <div style={{ color: stamped ? "#c9a96e" : "#3a3528" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6 4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </button>
  );
}

/* ── Tap Screen ───────────────────────────────────────────────────── */
function TapScreen({ exhibit, tapping, progress, alreadyStamped, onStart, onCancel }: {
  exhibit: Exhibit; tapping: boolean; progress: number; alreadyStamped: boolean;
  onStart: () => void; onCancel: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-8 py-16">
      <div className="text-center">
        <div className="text-xs tracking-[0.2em] mb-2" style={{ color: "#c9a96e", fontFamily: "var(--font-mono)" }}>
          {exhibit.hall}
        </div>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "#e8dfc8" }}>
          {exhibit.name}
        </h2>
        <div className="text-xs mt-1" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
          {exhibit.dynasty} · {exhibit.category}
        </div>
      </div>

      {/* NFC tap area */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          {/* Outer rings */}
          {!tapping && [1, 2].map((i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
              border: `1px solid rgba(201,169,110,${0.2 / i})`,
              animation: `pring ${1.5 + i * 0.4}s ease-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
          {/* Progress ring */}
          {tapping && (
            <svg width="160" height="160" viewBox="0 0 160 160" className="absolute">
              <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(201,169,110,0.1)" strokeWidth="3" />
              <circle
                cx="80" cy="80" r="72" fill="none" stroke="#c9a96e" strokeWidth="3"
                strokeDasharray={`${(progress / 100) * 452} 452`}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray 0.06s linear" }}
              />
            </svg>
          )}
          {/* Center button */}
          <button
            // onMouseDown={onStart}
            onPointerDown={onStart}
            onTouchStart={onStart}
            className="relative flex flex-col items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: 110,
              height: 110,
              background: tapping
                ? `radial-gradient(circle, ${exhibit.stampColor}33 0%, #1c1914 70%)`
                : "radial-gradient(circle, #242018 0%, #1a1714 70%)",
              border: `2px solid ${tapping ? exhibit.stampColor : "rgba(201,169,110,0.25)"}`,
              boxShadow: tapping ? `0 0 32px ${exhibit.stampColor}50` : "0 0 16px rgba(201,169,110,0.08)",
              cursor: "pointer",
            }}
          >
            <div className="text-3xl" style={{ color: tapping ? exhibit.stampColor : "#3a3020", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              {alreadyStamped ? exhibit.stampSymbol : "碰"}
            </div>
            <div className="text-xs mt-1" style={{ color: tapping ? "#c9a96e" : "#4a4030", fontFamily: "var(--font-mono)" }}>
              {tapping ? `${progress}%` : "长按打卡"}
            </div>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm" style={{ color: "#6a5e4c" }}>
            {alreadyStamped ? "已打卡 · 再次碰触查看详情" : "将手机靠近展柜 NFC 标签"}
          </p>
          <p className="text-xs mt-1" style={{ color: "#4a4030", fontFamily: "var(--font-mono)" }}>
            演示模式：按住中央按钮
          </p>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="text-sm transition-opacity hover:opacity-60"
        style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}
      >
        取消
      </button>

      {/* <style>{`
        @keyframes pring {
          0% { opacity: 0.8; transform: scale(0.85); }
          100% { opacity: 0; transform: scale(1.2); }
        }
      `}</style> */}
    </div>
  );
}

/* ── Tapping Screen ───────────────────────────────────────────────── */
function TappingScreen({ exhibit }: { exhibit: Exhibit }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-10">
      <div className="relative" style={{ width: 90, height: 90 }}>
        <svg width="90" height="90" viewBox="0 0 90 90" className="absolute" style={{ animation: "spin 1.5s linear infinite" }}>
          <circle cx="45" cy="45" r="40" fill="none" stroke={`${exhibit.stampColor}22`} strokeWidth="3" />
          <circle cx="45" cy="45" r="40" fill="none" stroke={exhibit.stampColor} strokeWidth="3"
            strokeDasharray="48 204" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          style={{ color: exhibit.stampColor, fontFamily: "var(--font-display)" }}>
          {exhibit.stampSymbol}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm mb-1" style={{ color: "#e8dfc8", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
          {exhibit.name}
        </div>
        <div className="text-xs" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
          NFC 识别成功 · 准备盖章…
        </div>
      </div>
      {/* <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style> */}
    </div>
  );
}

/* ── Challenge Screen ─────────────────────────────────────────────── */
function ChallengeScreen({ exhibit, selectedAnswer, answered, onAnswer }: {
  exhibit: Exhibit; selectedAnswer: number | null; answered: boolean; onAnswer: (i: number) => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-14 pb-8">
      <div className="text-xs tracking-[0.15em] mb-2" style={{ color: "#c9a96e", fontFamily: "var(--font-mono)" }}>
        答题解锁印章
      </div>
      <h2 className="text-lg leading-snug mb-1" style={{ fontFamily: "var(--font-display)", color: "#e8dfc8" }}>
        {exhibit.name}
      </h2>
      <div className="text-xs mb-6" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
        {exhibit.hall} · {exhibit.dynasty}
      </div>

      {/* Exhibit image strip */}
      <div className="rounded-xl overflow-hidden mb-6" style={{ height: 200, flexShrink: 0, background: "#1c1a15" }}>
        <img
          src={exhibit.imageUrl}
          alt={exhibit.name}
          className="w-full h-full object-cover"
          // style={{ filter: "brightness(0.55) saturate(0.7)" }}
          // style={{
          //   objectFit: "contain",                          // ← 等比完整显示
          //   filter: "brightness(0.55) saturate(0.7)",

          // }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            filter: "brightness(0.55) saturate(0.7)",
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl p-4 mb-5" style={{ background: "#1c1a15", border: "1px solid rgba(201,169,110,0.14)" }}>
        <div className="text-xs mb-2" style={{ color: "#8a7a60", fontFamily: "var(--font-mono)" }}>趣味一题</div>
        <p className="text-sm leading-relaxed" style={{ color: "#e8dfc8" }}>{exhibit.challenge}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 flex-1">
        {exhibit.challengeOptions.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = i === exhibit.challengeAnswer;
          let bg = "#1a1814";
          let border = "rgba(255,255,255,0.06)";
          let color = "#8a7a60";
          if (answered && isCorrect) { bg = "rgba(80,160,80,0.12)"; border = "rgba(80,160,80,0.4)"; color = "#6aaa6a"; }
          else if (answered && isSelected && !isCorrect) { bg = "rgba(160,80,80,0.12)"; border = "rgba(160,80,80,0.4)"; color = "#aa6a6a"; }
          else if (!answered) { border = "rgba(201,169,110,0.12)"; color = "#b0a080"; }

          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              disabled={answered}
              className="flex items-center gap-3 text-left rounded-xl px-4 py-3 transition-all duration-300"
              style={{ background: bg, border: `1px solid ${border}`, color }}
            >
              <div
                className="flex-none flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 24,
                  height: 24,
                  background: answered && isCorrect ? "rgba(80,160,80,0.25)" : answered && isSelected ? "rgba(160,80,80,0.25)" : "rgba(201,169,110,0.08)",
                  color: "inherit",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-sm">{opt}</span>
              {answered && isCorrect && <span className="ml-auto">✓</span>}
              {answered && isSelected && !isCorrect && <span className="ml-auto">✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Stamp Screen ─────────────────────────────────────────────────── */
function StampScreen({ exhibit, record, totalStamps, totalExhibits, isNew, onNext, onCollection }: {
  exhibit: Exhibit; record: StampRecord; totalStamps: number; totalExhibits: number;
  isNew: boolean; onNext: () => void; onCollection: () => void;
}) {
  const [inkDrop, setInkDrop] = useState(isNew);
  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setInkDrop(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-8 pt-16 pb-10">
      {/* Stamp visual */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex items-center justify-center rounded-full transition-all duration-500"
          style={{
            width: 120,
            height: 120,
            background: `${exhibit.stampColor}18`,
            border: `3px solid ${exhibit.stampColor}`,
            boxShadow: `0 0 40px ${exhibit.stampColor}50, inset 0 0 20px ${exhibit.stampColor}10`,
            transform: inkDrop ? "scale(1.15)" : "scale(1)",
            animation: inkDrop ? "stampIn 0.5s cubic-bezier(0.22,1,0.36,1)" : "none",
          }}
        >
          <span className="text-5xl font-bold" style={{ color: exhibit.stampColor, fontFamily: "var(--font-display)" }}>
            {exhibit.stampSymbol}
          </span>
        </div>

        <div>
          {isNew
            ? <div className="text-base font-medium mb-1" style={{ color: "#c9a96e", fontFamily: "var(--font-display)" }}>印章获得！</div>
            : <div className="text-base font-medium mb-1" style={{ color: "#8a7a60", fontFamily: "var(--font-display)" }}>已打卡</div>
          }
          <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "#e8dfc8" }}>{exhibit.name}</h3>
          <div className="text-xs mt-1" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
            {exhibit.hall} · {record.time}
          </div>
        </div>

        {/* Result */}
        <div
          className="rounded-xl px-5 py-3 text-center"
          style={{
            background: record.answeredCorrect ? "rgba(80,160,80,0.1)" : "rgba(160,80,80,0.1)",
            border: `1px solid ${record.answeredCorrect ? "rgba(80,160,80,0.25)" : "rgba(160,80,80,0.25)"}`,
          }}
        >
          <div className="text-xs mb-1" style={{ color: record.answeredCorrect ? "#6aaa6a" : "#aa6a6a", fontFamily: "var(--font-mono)" }}>
            {record.answeredCorrect ? "✓ 答题正确" : "✗ 答题错误"}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#8a7a60" }}>
            {exhibit.funFact}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from({ length: totalExhibits }, (_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i < totalStamps ? 10 : 8,
                height: i < totalStamps ? 10 : 8,
                background: i < totalStamps ? exhibit.stampColor : "rgba(255,255,255,0.08)",
                boxShadow: i < totalStamps ? `0 0 6px ${exhibit.stampColor}80` : "none",
              }}
            />
          ))}
        </div>
        <div className="text-xs" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
          {totalStamps} / {totalExhibits} 已集章
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onCollection}
          className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            background: `linear-gradient(135deg, ${exhibit.stampColor}33, ${exhibit.stampColor}18)`,
            border: `1px solid ${exhibit.stampColor}60`,
            color: exhibit.stampColor,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
          }}
        >
          查看我的印章册
        </button>
        <button
          onClick={onNext}
          className="w-full py-3 rounded-xl text-sm transition-opacity hover:opacity-70"
          style={{ background: "transparent", border: "1px solid rgba(201,169,110,0.12)", color: "#6a5e4c", fontFamily: "var(--font-mono)" }}
        >
          继续探馆
        </button>
      </div>

      {/* <style>{`
        @keyframes stampIn {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style> */}
    </div>
  );
}

/* ── Collection Screen ────────────────────────────────────────────── */
function CollectionScreen({ exhibits, stamps, achievements, onBack, onTap }: {
  exhibits: Exhibit[]; stamps: StampRecord[]; achievements: typeof ACHIEVEMENTS;
  onBack: () => void; onTap: (e: Exhibit) => void;
}) {
  const done = stamps.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-none px-6 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs tracking-[0.15em] mb-1" style={{ color: "#c9a96e", fontFamily: "var(--font-mono)" }}>
              我的印章册
            </div>
            <h2 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "#e8dfc8" }}>
              {done === 0 ? "尚未打卡" : done === exhibits.length ? "集章圆满！" : `已收集 ${done} 枚`}
            </h2>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ color: "rgba(201,169,110,0.15)", fontFamily: "var(--font-display)" }}
          >
            {done}/{exhibits.length}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: "none" }}>
        {/* Stamp grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {exhibits.map((ex) => {
            const rec = stamps.find((s) => s.exhibitId === ex.id);
            const stamped = !!rec;
            return (
              <button
                key={ex.id}
                onClick={() => !stamped && onTap(ex)}
                className="flex flex-col items-center gap-2 rounded-xl py-4 transition-all duration-200"
                style={{
                  background: stamped ? `${ex.stampColor}12` : "#1a1814",
                  border: `1px solid ${stamped ? ex.stampColor + "40" : "rgba(255,255,255,0.05)"}`,
                  boxShadow: stamped ? `0 0 16px ${ex.stampColor}20` : "none",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-lg font-bold"
                  style={{
                    width: 48,
                    height: 48,
                    background: stamped ? `${ex.stampColor}20` : "#1e1c17",
                    border: `2px solid ${stamped ? ex.stampColor : "rgba(255,255,255,0.06)"}`,
                    color: stamped ? ex.stampColor : "#2a2820",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {stamped ? ex.stampSymbol : "?"}
                </div>
                <div className="text-center">
                  <div className="text-xs leading-snug" style={{ color: stamped ? "#c8b88a" : "#3a3528", fontFamily: "var(--font-body)" }}>
                    {stamped ? ex.name.slice(0, 5) + (ex.name.length > 5 ? "…" : "") : "未打卡"}
                  </div>
                  {stamped && (
                    <div className="text-xs mt-0.5" style={{ color: rec.answeredCorrect ? "#6aaa6a" : "#aa6a6a", fontFamily: "var(--font-mono)", fontSize: 9 }}>
                      {rec.answeredCorrect ? "✓" : "✗"} {rec.time}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="text-xs tracking-[0.12em] mb-3" style={{ color: "#5a5040", fontFamily: "var(--font-mono)" }}>
          成就
        </div>
        <div className="flex flex-col gap-2.5">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = achievements.some((a) => a.id === ach.id);
            return (
              <div
                key={ach.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                style={{
                  background: unlocked ? "rgba(201,169,110,0.08)" : "#1a1814",
                  border: `1px solid ${unlocked ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.04)"}`,
                }}
              >
                <div className="text-xl" style={{ filter: unlocked ? "none" : "grayscale(1) opacity(0.3)" }}>
                  {ach.icon}
                </div>
                <div>
                  <div className="text-sm" style={{ color: unlocked ? "#e8dfc8" : "#3a3528", fontFamily: "var(--font-body)" }}>
                    {ach.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: unlocked ? "#8a7a60" : "#2a2820", fontFamily: "var(--font-mono)" }}>
                    {ach.desc}
                  </div>
                </div>
                {unlocked && (
                  <div className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: "rgba(201,169,110,0.15)", color: "#c9a96e", fontFamily: "var(--font-mono)", border: "1px solid rgba(201,169,110,0.25)" }}>
                    已解锁
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
