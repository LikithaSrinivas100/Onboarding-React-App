import { FormProvider, useForm } from "./context/FormContext";
import { Step1, Step2, Step3, Step4, StepBar } from "./components/Steps";

function Wizard() {
  const { currentStep, isDraftSaved, direction, submitted } = useForm();
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="eyebrow">Tamasha</p>
          <h1>Onboarding</h1>
        </div>
        <span className={`saved ${isDraftSaved ? "ok" : ""}`}>
          <i className="dot" />
          {isDraftSaved ? "Draft saved" : "Saving…"}
        </span>
      </header>

      <StepBar />

      <div className="stage">
        <div key={currentStep} className={`slide ${submitted ? "" : direction}`}>
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FormProvider>
      <Wizard />
    </FormProvider>
  );
}