import { LABELS, LEVEL_INFO, LEVELS, STACK, TRACK_INFO, TRACKS } from "../constants";
import { useForm } from "../context/FormContext";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="icon-check" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StepBar() {
  const { currentStep, go } = useForm();
  return (
    <nav className="rail" aria-label="Onboarding progress">
      {LABELS.map((label, i) => {
        const step = i + 1;
        const state = step < currentStep ? "done" : step === currentStep ? "active" : "pending";
        return (
          <div className={`rail-node ${state}`} key={label}>
            <button
              type="button"
              className="rail-dot"
              disabled={state !== "done"}
              onClick={() => state === "done" && go(step)}
              aria-current={state === "active" ? "step" : undefined}
            >
              {state === "done" ? <CheckIcon /> : <span>{step}</span>}
            </button>
            <span className="rail-label">{label}</span>
            {i < LABELS.length - 1 && <div className="rail-line" />}
          </div>
        );
      })}
    </nav>
  );
}

function Nav({ showBack, onNext, label = "Next" }) {
  const { back } = useForm();
  return (
    <div className="nav">
      {showBack ? <button type="button" onClick={back}>Back</button> : <span />}
      <button type="button" className="primary" onClick={onNext}>{label}</button>
    </div>
  );
}

function Field({ id, label, value, onChange, onBlur, error, type = "text", required }) {
  return (
    <div className="field">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "invalid" : ""}
        aria-invalid={!!error}
      />
      <label htmlFor={id}>{label}{required && " *"}</label>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}

export function Step1() {
  const { formData: d, errors: e, set, blur, next, shake } = useForm();
  return (
    <section className={`card ${shake ? "shake" : ""}`}>
      <h2>Personal info</h2>
      <p className="hint">Tell us who you are and where to find your work.</p>
      <Field id="name" label="Name" required value={d.name}
        onChange={(ev) => set("name", ev.target.value)} onBlur={() => blur("name")} error={e.name} />
      <Field id="email" label="Email" required type="email" value={d.email}
        onChange={(ev) => set("email", ev.target.value)} onBlur={() => blur("email")} error={e.email} />
      <Field id="portfolio" label="Portfolio / GitHub URL" value={d.portfolio}
        onChange={(ev) => set("portfolio", ev.target.value)} />
      <Nav showBack={false} onNext={next} />
    </section>
  );
}

export function Step2() {
  const { formData: d, errors: e, set, next, shake } = useForm();
  return (
    <section className={`card ${shake ? "shake" : ""}`}>
      <h2>Preferences</h2>
      <p className="hint">This decides which stack options you'll see next.</p>

      <p className="group-label">Primary track *</p>
      <div className="chip-grid">
        {TRACKS.map((t) => (
          <label className="chip" key={t}>
            <input type="radio" name="track" checked={d.track === t} onChange={() => set("track", t)} />
            <span>{t}</span>
            <CheckIcon />
          </label>
        ))}
      </div>
      {d.track && <p className="micro-copy">{TRACK_INFO[d.track]}</p>}
      {e.track && <small role="alert">{e.track}</small>}

      <p className="group-label">Experience level *</p>
      <div className="chip-grid">
        {LEVELS.map((l) => (
          <label className="chip" key={l}>
            <input type="radio" name="experience" checked={d.experience === l} onChange={() => set("experience", l)} />
            <span>{l}</span>
            <CheckIcon />
          </label>
        ))}
      </div>
      {d.experience && <p className="micro-copy">{LEVEL_INFO[d.experience]}</p>}
      {e.experience && <small role="alert">{e.experience}</small>}

      <Nav showBack onNext={next} />
    </section>
  );
}

export function Step3() {
  const { formData: d, errors: e, toggleTech, next, shake } = useForm();
  const opts = STACK[d.track] || [];
  return (
    <section className={`card ${shake ? "shake" : ""}`}>
      <h2>Tech stack</h2>
      <p className="hint">Picked for {d.track || "your track"} — check everything that applies.</p>
      <div className="chip-grid">
        {opts.map((t) => (
          <label className="chip" key={t}>
            <input type="checkbox" checked={d.techStack.includes(t)} onChange={() => toggleTech(t)} />
            <span>{t}</span>
            <CheckIcon />
          </label>
        ))}
      </div>
      {e.techStack && <small role="alert">{e.techStack}</small>}
      <Nav showBack onNext={next} />
    </section>
  );
}

function ReviewBlock({ title, step, go, children }) {
  return (
    <div className="review">
      <div className="review-h">
        <strong>{title}</strong>
        <button type="button" onClick={() => go(step)}>Edit</button>
      </div>
      {children}
    </div>
  );
}

function SuccessPanel() {
  const { restart } = useForm();
  return (
    <section className="card success">
      <div className="term">
        <p><span className="term-ok">✓</span> build succeeded</p>
        <p className="term-dim">onboarding // committed</p>
      </div>
      <h2>You're onboarded</h2>
      <p className="hint">Your details have been submitted. The draft has been cleared.</p>
      <div className="nav">
        <span />
        <button type="button" className="primary" onClick={restart}>Start over</button>
      </div>
    </section>
  );
}

export function Step4() {
  const { formData: d, back, go, submit, submitted, isSubmitting, submitError } = useForm();
  if (submitted) return <SuccessPanel />;
  return (
    <section className="card">
      <h2>Review & submit</h2>
      <p className="hint">Check everything before you send it off.</p>
      <ReviewBlock title="Personal" step={1} go={go}>
        <p>{d.name}</p>
        <p>{d.email}</p>
        <p>{d.portfolio || "No portfolio link"}</p>
      </ReviewBlock>
      <ReviewBlock title="Preferences" step={2} go={go}>
        <p>{d.track} · {d.experience}</p>
      </ReviewBlock>
      <ReviewBlock title="Tech stack" step={3} go={go}>
        <p>{d.techStack.join(", ") || "None selected"}</p>
      </ReviewBlock>
      <div className="nav">
        <button type="button" onClick={back}>Back</button>
        <button type="button" className="primary" onClick={submit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Submit"}
        </button>
      </div>
      {submitError && <small role="alert">{submitError}</small>}
    </section>
  );
}