import { createContext, useContext, useEffect, useRef, useState } from "react";
import { EMPTY, KEY, STACK } from "../constants";

const Ctx = createContext(null);
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const urlOk = (u) => /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/.test(u);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!saved) return { formData: { ...EMPTY }, step: 1 };
    return {
      formData: { ...EMPTY, ...saved.formData },
      step: saved.step && saved.step >= 1 && saved.step <= 4 ? saved.step : 1,
    };
  } catch {
    return { formData: { ...EMPTY }, step: 1 };
  }
}

// Returns the error map for a given step's fields.
function validate(step, d) {
  const e = {};
  if (step === 1) {
    if (!d.name.trim()) e.name = "Name is required";
    if (!d.email.trim()) e.email = "Email is required";
    else if (!emailOk(d.email)) e.email = "Enter a valid email";
    if (!d.portfolio.trim() && !d.email.trim()) e.portfolio = "Portfolio or email is required";
    else if (d.portfolio.trim() && !urlOk(d.portfolio)) e.portfolio = "Enter a valid URL";
  }
  if (step === 2) {
    if (!d.track) e.track = "Select a track";
    if (!d.experience) e.experience = "Select an experience level";
  }
  if (step === 3 && !d.techStack.length) e.techStack = "Select at least one";
  return e;
}

// Which step a given field lives on — lets blur() validate any field generically.
const FIELD_STEP = { name: 1, email: 1, track: 2, experience: 2, techStack: 3 };

export function FormProvider({ children }) {
  const initial = useRef(load()).current;
  const [formData, setFormData] = useState(initial.formData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(initial.step);
  const [direction, setDirection] = useState("fwd");
  const [isDraftSaved, setSaved] = useState(true);
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Debounced localStorage sync (~500ms). Saves formData + step together
  // so a refresh restores both the data and where the user was.
  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => {
      localStorage.setItem(KEY, JSON.stringify({ formData, step: currentStep }));
      setSaved(true);
    }, 500);
    return () => clearTimeout(t);
  }, [formData, currentStep]);

  const set = (field, value) => {
    setFormData((p) => {
      if (field === "track") {
        // Track change invalidates any tech picks that don't belong to the new track.
        const allowed = STACK[value] || [];
        return { ...p, track: value, techStack: p.techStack.filter((x) => allowed.includes(x)) };
      }
      return { ...p, [field]: value };
    });
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const toggleTech = (tech) => {
    setFormData((p) => ({
      ...p,
      techStack: p.techStack.includes(tech)
        ? p.techStack.filter((x) => x !== tech)
        : [...p.techStack, tech],
    }));
    setErrors((p) => ({ ...p, techStack: undefined }));
  };

  // Generalized: validates whichever step the field belongs to, not just Step 1.
  const blur = (field) => {
    const step = FIELD_STEP[field];
    const e = validate(step, formData);
    setErrors((p) => ({ ...p, [field]: e[field] }));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const next = () => {
    const e = validate(currentStep, formData);
    if (Object.keys(e).length) {
      setErrors(e);
      triggerShake();
      return;
    }
    setErrors({});
    setDirection("fwd");
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const back = () => {
    setErrors({});
    setDirection("back");
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const go = (n) => {
    setErrors({});
    setDirection(n > currentStep ? "fwd" : "back");
    setCurrentStep(n);
  };

  const submit = async () => {
    // Safety net: re-check every step in case Step 4 was reached with stale
    // data (e.g. browser back/forward), then jump to the first problem.
    for (let step = 1; step <= 3; step++) {
      const e = validate(step, formData);
      if (Object.keys(e).length) {
        setErrors(e);
        setDirection("back");
        setCurrentStep(step);
        return;
      }
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("http://localhost:8000/api/onboarding/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("The submission could not be saved");
      localStorage.removeItem(KEY);
      setSubmitted(true);
    } catch {
      setSubmitError("Could not connect to the server. Start Django and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setFormData({ ...EMPTY });
    setErrors({});
    setCurrentStep(1);
    setSubmitted(false);
    setSubmitError("");
  };

  return (
    <Ctx.Provider
      value={{
        formData,
        errors,
        currentStep,
        direction,
        isDraftSaved,
        shake,
        submitted,
        isSubmitting,
        submitError,
        set,
        toggleTech,
        blur,
        next,
        back,
        go,
        submit,
        restart,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useForm = () => useContext(Ctx);