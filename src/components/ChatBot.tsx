import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Bot, ArrowLeft, Send, Loader2, Mail } from "lucide-react";
import {
  WELCOME_TEXT, PATH_OPTIONS, MARCA_STEPS, MARCA_CIERRE, CREADOR_STEPS,
  CREADOR_CIERRE_TEXT, MARCA_CIERRE_TEXT, PAISES, CONTACT_EMAIL,
  type Step,
} from "../lib/chatbotFlow";
import { FAQ_CATEGORIES, type FaqCategory, type FaqQA } from "../lib/faqData";

// Mismo endpoint que los formularios; el script enruta por formType.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2F5BICLKJYac4hO9GEX8roPubaRrG6v-RqBpJRKwwdA06Serhcbe0J4iymO99fGg/exec";

interface Message {
  role: "user" | "model";
  text: string;
}

type Phase = "intro" | "steps" | "sending" | "done" | "error" | "faqMenu" | "faqQuestions";
type Path = "marca" | "creador" | null;

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [path, setPath] = useState<Path>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiSelection, setMultiSelection] = useState<string[]>([]);
  const [openText, setOpenText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [faqCategory, setFaqCategory] = useState<FaqCategory | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: WELCOME_TEXT },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lista de pasos de la rama elegida
  const allSteps: Step[] = path === "marca"
    ? [...MARCA_STEPS, ...MARCA_CIERRE]
    : path === "creador"
    ? CREADOR_STEPS
    : [];

  // Sólo los pasos que corresponden según las respuestas dadas (ramificación)
  const steps: Step[] = allSteps.filter(s => {
    if (!s.showIf) return true;
    const given = answers[s.showIf.stepId];
    return given !== undefined && s.showIf.equals.includes(given);
  });

  const currentStep = steps[stepIndex];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Muestra la pregunta del paso actual como burbuja del bot
  useEffect(() => {
    if (phase === "steps" && currentStep) {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "model" && last.text === currentStep.question) return prev;
        return [...prev, { role: "model", text: currentStep.question }];
      });
      setMultiSelection([]);
      setOpenText("");
    }
  }, [phase, stepIndex, path]);

  const choosePath = (id: "marca" | "creador", label: string) => {
    setMessages(prev => [...prev, { role: "user", text: label }]);
    setPath(id);
    setStepIndex(0);
    setPhase("steps");
  };

  const saveAndAdvance = (value: string) => {
    if (!currentStep) return;
    setMessages(prev => [...prev, { role: "user", text: value }]);
    const updated = { ...answers, [currentStep.id]: value };
    setAnswers(updated);

    // Recalcula los pasos visibles con la respuesta recién dada,
    // porque puede habilitar u ocultar pasos siguientes (showIf).
    const visibles = allSteps.filter(s => {
      if (!s.showIf) return true;
      const given = updated[s.showIf.stepId];
      return given !== undefined && s.showIf.equals.includes(given);
    });
    const nuevoIndex = visibles.findIndex(s => s.id === currentStep.id) + 1;

    if (nuevoIndex < visibles.length) {
      setStepIndex(nuevoIndex);
    } else {
      submit(updated);
    }
  };

  const goBack = () => {
    if (stepIndex === 0) {
      // Volver a la elección de rama
      setPath(null);
      setPhase("intro");
      setMessages([{ role: "model", text: WELCOME_TEXT }]);
      setAnswers({});
      return;
    }
    setStepIndex(stepIndex - 1);
    // Quita las últimas dos burbujas (respuesta previa + pregunta actual)
    setMessages(prev => prev.slice(0, -2));
  };

  const submit = async (finalAnswers: Record<string, string>) => {
    setPhase("sending");
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          formType: path === "marca" ? "chatbot_marca" : "chatbot_creador",
          ...finalAnswers,
        }),
      });
      setPhase("done");
      setMessages(prev => [
        ...prev,
        { role: "model", text: path === "marca" ? MARCA_CIERRE_TEXT : CREADOR_CIERRE_TEXT },
      ]);
    } catch {
      setPhase("error");
      setErrorMsg("No pudimos enviar tus respuestas. Revisá tu conexión.");
    }
  };

  // --- FAQ ("Tengo otras consultas") ---
  const openFaq = () => {
    setPhase("faqMenu");
    setMessages(prev => [
      ...prev,
      { role: "user", text: "Tengo otras consultas" },
      { role: "model", text: "Claro, ¿sobre qué querés saber más?" },
    ]);
  };

  const selectFaqCategory = (cat: FaqCategory) => {
    setFaqCategory(cat);
    setPhase("faqQuestions");
  };

  const selectFaqQuestion = (qa: FaqQA) => {
    setMessages(prev => [
      ...prev,
      { role: "user", text: qa.question },
      { role: "model", text: qa.answer },
    ]);
  };

  const backToFaqMenu = () => {
    setFaqCategory(null);
    setPhase("faqMenu");
  };

  const restart = () => {
    setPhase("intro");
    setPath(null);
    setStepIndex(0);
    setAnswers({});
    setMultiSelection([]);
    setOpenText("");
    setErrorMsg("");
    setFaqCategory(null);
    setMessages([{ role: "model", text: WELCOME_TEXT }]);
  };

  const toggleMulti = (option: string) => {
    setMultiSelection(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const progress = steps.length > 0 ? Math.round(((stepIndex) / steps.length) * 100) : 0;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#0022ff] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">STAGE</h3>
                    <p className="text-[10px] opacity-80">Online • Contanos sobre vos</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  id="close-chat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Barra de progreso */}
              {phase === "steps" && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] opacity-80 mb-1">
                    <span>Pregunta {stepIndex + 1} de {steps.length}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-gray-200" : "bg-[#0022ff]/10 text-[#0022ff]"}`}>
                      {m.role === "user" ? <span className="text-xs font-bold text-gray-600">Tú</span> : <Bot size={14} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-[#0022ff] text-white rounded-tr-none" : "bg-white border border-gray-100 shadow-sm rounded-tl-none text-gray-800"}`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zona de interacción */}
            <div className="p-4 bg-white border-t border-gray-100 max-h-[240px] overflow-y-auto">
              {/* INTRO: elegir rama */}
              {phase === "intro" && (
                <div className="flex flex-col gap-2">
                  {PATH_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => choosePath(opt.id as "marca" | "creador", opt.label)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all text-left font-medium"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* PASOS */}
              {phase === "steps" && currentStep && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0022ff] transition-colors mb-1 self-start"
                  >
                    <ArrowLeft size={14} />
                    <span>Volver</span>
                  </button>

                  {/* Opción única */}
                  {currentStep.type === "single" && currentStep.options?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => saveAndAdvance(opt)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all text-left"
                    >
                      {opt}
                    </button>
                  ))}

                  {/* País */}
                  {currentStep.type === "country" && (
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:border-[#0022ff] focus:outline-none"
                      defaultValue=""
                      onChange={e => e.target.value && saveAndAdvance(e.target.value)}
                    >
                      <option value="" disabled>Seleccioná tu país...</option>
                      {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  )}

                  {/* Selección múltiple */}
                  {currentStep.type === "multi" && (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.options?.map(opt => (
                          <button
                            key={opt}
                            onClick={() => toggleMulti(opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              multiSelection.includes(opt)
                                ? "bg-[#0022ff] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => saveAndAdvance(multiSelection.join(", "))}
                        disabled={multiSelection.length === 0}
                        className="mt-2 w-full py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                      >
                        Continuar
                      </button>
                    </>
                  )}

                  {/* Email */}
                  {currentStep.type === "email" && (
                    <>
                      <input
                        type="email"
                        value={openText}
                        onChange={e => setOpenText(e.target.value)}
                        placeholder={currentStep.placeholder}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:border-[#0022ff] focus:outline-none"
                      />
                      <button
                        onClick={() => saveAndAdvance(openText.trim())}
                        disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(openText.trim())}
                        className="w-full py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        Enviar
                      </button>
                    </>
                  )}

                  {/* Respuesta abierta */}
                  {currentStep.type === "open" && (
                    <>
                      <textarea
                        value={openText}
                        onChange={e => setOpenText(e.target.value)}
                        placeholder={currentStep.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:border-[#0022ff] focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        {currentStep.optional && (
                          <button
                            onClick={() => saveAndAdvance("(sin responder)")}
                            className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                          >
                            Saltear
                          </button>
                        )}
                        <button
                          onClick={() => saveAndAdvance(openText.trim())}
                          disabled={!openText.trim()}
                          className="flex-1 py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Send size={14} />
                          Enviar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ENVIANDO */}
              {phase === "sending" && (
                <div className="flex items-center justify-center gap-2 py-4 text-gray-500 text-sm">
                  <Loader2 size={18} className="animate-spin" />
                  Enviando tus respuestas...
                </div>
              )}

              {/* LISTO */}
              {phase === "done" && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={openFaq}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all font-medium"
                  >
                    Tengo otras consultas
                  </button>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
                  >
                    <Mail size={16} />
                    Escribinos por email
                  </a>
                  <button
                    onClick={restart}
                    className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                  >
                    Empezar de nuevo
                  </button>
                </div>
              )}

              {/* FAQ: menú de categorías */}
              {phase === "faqMenu" && (
                <div className="flex flex-col gap-2">
                  {FAQ_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => selectFaqCategory(cat)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all text-left"
                    >
                      {cat.label}
                    </button>
                  ))}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
                  >
                    <Mail size={16} />
                    Otra consulta (escribinos)
                  </a>
                </div>
              )}

              {/* FAQ: preguntas de la categoría */}
              {phase === "faqQuestions" && faqCategory && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={backToFaqMenu}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0022ff] transition-colors mb-1 self-start"
                  >
                    <ArrowLeft size={14} />
                    <span>Volver</span>
                  </button>
                  {faqCategory.questions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => selectFaqQuestion(qa)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all text-left"
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              )}

              {/* ERROR */}
              {phase === "error" && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-red-600 text-center">{errorMsg}</p>
                  <button
                    onClick={() => submit(answers)}
                    className="w-full py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#0022ff] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all relative"
        id="chat-toggle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
};