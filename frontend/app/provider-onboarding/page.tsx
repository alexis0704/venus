"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

// ── Types ──────────────────────────────────────────────────────────────────
type Role = "bot" | "user";
interface Msg { role: Role; text: string; }

// ── Phase 1 scripted messages ──────────────────────────────────────────────
const PHASE1_MSGS = [
  "Xin chào! Tôi là trợ lý Volzen 👋 Tôi sẽ hướng dẫn bạn qua quá trình đăng ký trở thành nhà cung cấp trạm sạc EV.",
  "🇻🇳 Tại Việt Nam, hoạt động kinh doanh trạm sạc xe điện thuộc ngành dịch vụ vận tải — được cấp phép theo Luật Doanh nghiệp 2020 và Nghị định 10/2020/NĐ-CP.",
  "📋 Bạn có thể lựa chọn một trong các loại hình doanh nghiệp: Doanh nghiệp tư nhân, Công ty TNHH 1 thành viên, hoặc Công ty TNHH 2+ thành viên. Mỗi loại có mức vốn điều lệ và trách nhiệm pháp lý khác nhau.",
  "💰 Chi phí khởi đầu ước tính: Phí đăng ký doanh nghiệp ~200.000 VNĐ. Thiết bị trạm sạc AC (7–22 kW) từ 8–25 triệu/cổng. Kết nối điện lưới và lắp đặt từ 15–50 triệu tùy quy mô.",
  "⏱️ Thời gian đăng ký doanh nghiệp qua Cổng thông tin quốc gia thường từ 3–5 ngày làm việc. Sau khi có Giấy phép kinh doanh, bạn cần đăng ký mã số thuế và mở tài khoản ngân hàng doanh nghiệp.",
  "📈 Theo dữ liệu thị trường 2025, nhu cầu sạc EV tại Việt Nam tăng trưởng ~180%/năm. Doanh thu trung bình một trạm 5 cổng ở khu vực trung tâm TP.HCM đạt 35–80 triệu/tháng.",
  "✅ Volzen hỗ trợ bạn toàn bộ quy trình: từ tư vấn pháp lý, kết nối đối tác lắp đặt, đến quản lý booking và thanh toán trên nền tảng. Bạn chỉ cần tập trung vào vận hành.",
  "Bạn đã sẵn sàng để tiến hành bước tiếp theo chưa? Nhấn nút bên dưới để bắt đầu thu thập thông tin đăng ký doanh nghiệp của bạn.",
];

// ── Phase 2 MCQ questions ──────────────────────────────────────────────────
const PHASE2_QS = [
  {
    q: "Phạm vi dịch vụ bạn dự định cung cấp là gì?",
    key: "scope",
    opts: ["Chỉ sạc EV", "Sạc EV + Đỗ xe", "Trạm dịch vụ tổng hợp"],
  },
  {
    q: "Tỉnh/thành phố bạn muốn đặt trạm đầu tiên?",
    key: "province",
    opts: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Tỉnh/thành khác"],
  },
  {
    q: "Số cổng sạc dự kiến ban đầu?",
    key: "stations",
    opts: ["1 – 5 cổng", "6 – 20 cổng", "21 – 50 cổng", "Trên 50 cổng"],
  },
  {
    q: "Doanh thu hàng tháng kỳ vọng?",
    key: "revenue",
    opts: ["Dưới 50 triệu", "50 – 200 triệu", "Trên 200 triệu"],
  },
  {
    q: "Loại hình doanh nghiệp bạn muốn đăng ký?",
    key: "legal",
    opts: ["Doanh nghiệp tư nhân", "Công ty TNHH 1 thành viên", "Công ty TNHH 2+ thành viên"],
  },
];

// ── Docx generation ────────────────────────────────────────────────────────
async function downloadForm(answers: Record<string, string>) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");

  const field = (label: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun({ text: value }),
      ],
      spacing: { after: 160 },
    });

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Độc lập – Tự do – Hạnh phúc",
          alignment: AlignmentType.CENTER,
          spacing: { after: 320 },
        }),
        new Paragraph({
          text: "GIẤY ĐỀ NGHỊ ĐĂNG KÝ DOANH NGHIỆP",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        new Paragraph({ text: "I. THÔNG TIN CÁ NHÂN (VUI LÒNG ĐIỀN TAY)", heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 160 } }),
        field("Họ và tên", "[HỌ VÀ TÊN]"),
        field("Ngày sinh", "[NGÀY SINH]"),
        field("Số CMND/CCCD", "[SỐ CMND/CCCD]"),
        field("Địa chỉ thường trú", "[ĐỊA CHỈ THƯỜNG TRÚ]"),
        field("Số điện thoại liên lạc", "[SỐ ĐIỆN THOẠI]"),
        field("Email", "[ĐỊA CHỈ EMAIL]"),

        new Paragraph({ text: "II. THÔNG TIN DOANH NGHIỆP", heading: HeadingLevel.HEADING_3, spacing: { before: 320, after: 160 } }),
        field("Tên doanh nghiệp (tiếng Việt)", "[TÊN DOANH NGHIỆP]"),
        field("Tên doanh nghiệp (tiếng Anh)", "[ENGLISH NAME — nếu có]"),
        field("Loại hình doanh nghiệp", answers.legal ?? ""),
        field("Ngành nghề kinh doanh chính", `Dịch vụ sạc điện xe điện — ${answers.scope ?? ""}`),
        field("Địa chỉ trụ sở chính", `${answers.province ?? ""} — [ĐỊA CHỈ CHI TIẾT]`),
        field("Vốn điều lệ", "[VỐN ĐIỀU LỆ] VNĐ"),

        new Paragraph({ text: "III. QUY MÔ HOẠT ĐỘNG DỰ KIẾN", heading: HeadingLevel.HEADING_3, spacing: { before: 320, after: 160 } }),
        field("Số cổng sạc ban đầu", answers.stations ?? ""),
        field("Doanh thu hàng tháng kỳ vọng", answers.revenue ?? ""),

        new Paragraph({ text: "", spacing: { before: 600 } }),
        new Paragraph({
          children: [new TextRun({ text: "Người đề nghị đăng ký (ký và ghi rõ họ tên)", italics: true })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "___________________________", bold: true })],
          alignment: AlignmentType.RIGHT,
        }),
      ],
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const blob = new Blob([new Uint8Array(buf)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement("a"), { href: url, download: "Giay_dang_ky_doanh_nghiep_Volzen.docx" }).click();
  URL.revokeObjectURL(url);
}

// ── Main component ─────────────────────────────────────────────────────────
function ProviderOnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReturning = searchParams.get("returning") === "true";

  // Chat state
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [p1Done, setP1Done] = useState(false);
  const [p2Step, setP2Step] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [formReady, setFormReady] = useState(false);

  // Returning dialog state
  const [returningStep, setReturningStep] = useState<"ask" | "upload" | "verifying" | "done">("ask");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, generating, formReady]);

  // Stream phase 1 messages
  useEffect(() => {
    if (isReturning) return;
    let cancelled = false;
    (async () => {
      for (const text of PHASE1_MSGS) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, 900));
        if (cancelled) return;
        setMsgs(prev => [...prev, { role: "bot", text }]);
      }
      if (!cancelled) setP1Done(true);
    })();
    return () => { cancelled = true; };
  }, [isReturning]);

  // Phase 2 — ask next question
  useEffect(() => {
    if (phase !== 2) return;
    if (p2Step >= PHASE2_QS.length) return;
    const { q } = PHASE2_QS[p2Step];
    const delay = p2Step === 0 ? 400 : 600;
    const t = setTimeout(() => setMsgs(prev => [...prev, { role: "bot", text: q }]), delay);
    return () => clearTimeout(t);
  }, [phase, p2Step]);

  function startPhase2() {
    setMsgs(prev => [
      ...prev,
      { role: "user", text: "Tôi đã sẵn sàng! →" },
      { role: "bot", text: "Tuyệt vời! Tôi sẽ hỏi bạn một vài câu hỏi nhanh để điền sẵn hồ sơ đăng ký doanh nghiệp. Hãy chọn câu trả lời phù hợp nhất." },
    ]);
    setPhase(2);
  }

  function pickAnswer(opt: string) {
    const q = PHASE2_QS[p2Step];
    const newAnswers = { ...answers, [q.key]: opt };
    setAnswers(newAnswers);
    setMsgs(prev => [...prev, { role: "user", text: opt }]);
    const next = p2Step + 1;
    setP2Step(next);
    if (next >= PHASE2_QS.length) {
      setTimeout(() => {
        setMsgs(prev => [...prev, { role: "bot", text: "Hoàn tất! Đang tạo hồ sơ đăng ký doanh nghiệp của bạn..." }]);
        setGenerating(true);
        setTimeout(() => { setGenerating(false); setFormReady(true); setPhase(3); }, 1800);
      }, 500);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedFile(f);
    setReturningStep("verifying");
    setTimeout(() => setReturningStep("done"), 2200);
  }

  // ── Returning dialog ───────────────────────────────────────────────────
  if (isReturning) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <div className="glass rounded-2xl p-8 max-w-md w-full" style={{ border: "1px solid var(--glass-border)" }}>
          {returningStep === "ask" && (
            <>
              <div className="text-4xl mb-4 text-center">👋</div>
              <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: "var(--text)" }}>
                Chào mừng trở lại!
              </h2>
              <p className="text-center mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
                Hồ sơ đăng ký kinh doanh của bạn đã được cơ quan nhà nước phê duyệt chưa?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setReturningStep("upload")}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                  ✅ Đã có Giấy phép kinh doanh
                </button>
                <button
                  onClick={() => router.push("/explore")}
                  className="w-full py-3 rounded-xl text-sm transition-opacity hover:opacity-80"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
                >
                  Chưa — nhắc tôi lần sau
                </button>
              </div>
            </>
          )}

          {returningStep === "upload" && (
            <>
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
                Tải ảnh Giấy phép kinh doanh
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Chụp ảnh hoặc tải lên ảnh scan bản gốc đã được đóng dấu phê duyệt.
              </p>
              <label
                className="flex flex-col items-center justify-center gap-3 rounded-xl py-10 cursor-pointer transition-colors"
                style={{ border: "2px dashed var(--glass-border)", background: "var(--glass-bg)" }}
              >
                <span className="text-3xl">📄</span>
                <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>Chọn ảnh hoặc chụp ngay</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>JPG, PNG, PDF · tối đa 10 MB</span>
                <input type="file" accept="image/*,.pdf" capture="environment" className="sr-only" onChange={handleFileChange} />
              </label>
            </>
          )}

          {returningStep === "verifying" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: "var(--glass-border)", borderTopColor: "var(--accent)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Đang xác minh hồ sơ...</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{uploadedFile?.name}</p>
            </div>
          )}

          {returningStep === "done" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>Xác minh thành công!</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Tài khoản nhà cung cấp của bạn đã được kích hoạt. Chào mừng đến với Volzen!
              </p>
              <button
                onClick={() => router.push("/host/financial/")}
                className="mt-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                Vào Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Chat UI ────────────────────────────────────────────────────────────
  const currentQ = phase === 2 && p2Step < PHASE2_QS.length ? PHASE2_QS[p2Step] : null;
  const waitingForAnswer = phase === 2 && !generating && !formReady && p2Step < PHASE2_QS.length && msgs.at(-1)?.role === "bot";

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--glass-border)", background: "var(--glass-bg)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: "var(--accent)" }}>
            volzen
          </Link>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(74,222,128,0.12)", color: "var(--accent)" }}>
            Đăng ký Nhà cung cấp
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
            {phase === 1 ? "Bước 1 / 3 — Tư vấn" : phase === 2 ? "Bước 2 / 3 — Thu thập thông tin" : "Bước 3 / 3 — Hoàn tất"}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl w-full mx-auto">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={
                m.role === "bot"
                  ? { background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text)" }
                  : { background: "var(--accent)", color: "var(--accent-fg)" }
              }
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {!p1Done && phase === 1 && msgs.length > 0 && msgs.length < PHASE1_MSGS.length && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3 flex gap-1.5 items-center"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              {[0, 1, 2].map(d => (
                <span
                  key={d}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: "var(--accent)", animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Generating shimmer */}
        {generating && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3 w-48 h-10 animate-pulse"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            />
          </div>
        )}

        {/* Download button */}
        {formReady && (
          <div className="flex justify-start">
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3 text-sm space-y-3"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
            >
              <p>🎉 Hồ sơ đã sẵn sàng! Tải xuống, điền các thông tin cá nhân còn thiếu, rồi nộp cho Cổng thông tin Đăng ký doanh nghiệp quốc gia.</p>
              <button
                onClick={() => downloadForm(answers)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                ⬇️ Tải Giấy đề nghị đăng ký (.docx)
              </button>
              <button
                onClick={() => router.push("/")}
                className="text-xs underline"
                style={{ color: "var(--text-muted)" }}
              >
                Xong, về trang chủ
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* CTA / MCQ bar */}
      <div
        className="shrink-0 px-4 py-4 max-w-2xl w-full mx-auto"
        style={{ borderTop: "1px solid var(--glass-border)" }}
      >
        {/* Phase 1 CTA */}
        {p1Done && phase === 1 && (
          <button
            onClick={startPhase2}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Tôi đã sẵn sàng! Tiến hành bước tiếp theo →
          </button>
        )}

        {/* Phase 2 MCQ options */}
        {waitingForAnswer && currentQ && (
          <div className="flex flex-wrap gap-2">
            {currentQ.opts.map(opt => (
              <button
                key={opt}
                onClick={() => pickAnswer(opt)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Phase 3 — idle state */}
        {phase === 3 && !generating && formReady && (
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Hoàn tất — tải hồ sơ ở trên hoặc về trang chủ.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProviderOnboarding() {
  return (
    <Suspense>
      <ProviderOnboardingInner />
    </Suspense>
  );
}
