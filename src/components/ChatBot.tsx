import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Bot, ArrowLeft, Mail, ChevronRight } from "lucide-react";
import { CATEGORIES, CONTACT_EMAIL, type Category, type QA } from "../lib/chatbotData";

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Vistas de navegación del chatbot
type View =
  | { type: 'menu' }
  | { type: 'questions'; category: Category }
  | { type: 'answer'; category: Category; qa: QA };

const WELCOME = '¡Hola! Soy NINCH AI. Elegí una opción para empezar 👇';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>({ type: 'menu' });
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: WELCOME }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Selección de categoría desde el menú
  const handleSelectCategory = (category: Category) => {
    setMessages(prev => [...prev, { role: 'user', text: category.label }]);
    setView({ type: 'questions', category });
  };

  // Selección de una pregunta → muestra la respuesta
  const handleSelectQuestion = (category: Category, qa: QA) => {
    setMessages(prev => [
      ...prev,
      { role: 'user', text: qa.question },
      { role: 'model', text: qa.answer },
    ]);
    setView({ type: 'answer', category, qa });
  };

  // Volver al menú principal
  const handleBackToMenu = () => {
    setView({ type: 'menu' });
  };

  // Volver a la lista de preguntas de la categoría actual
  const handleBackToQuestions = (category: Category) => {
    setView({ type: 'questions', category });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#0022ff] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">NINCH AI</h3>
                  <p className="text-[10px] opacity-80">Online • Soporte Estratégico</p>
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gray-200' : 'bg-[#0022ff]/10 text-[#0022ff]'}`}>
                      {m.role === 'user' ? <span className="text-xs font-bold text-gray-600">Tú</span> : <Bot size={14} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#0022ff] text-white rounded-tr-none' : 'bg-white border border-gray-100 shadow-sm rounded-tl-none text-gray-800'}`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Navegación por botones */}
            <div className="p-4 bg-white border-t border-gray-100 max-h-[220px] overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* MENÚ PRINCIPAL */}
                {view.type === 'menu' && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-2"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat)}
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all text-left"
                      >
                        <span>{cat.label}</span>
                        <ChevronRight size={16} className="opacity-50 flex-shrink-0" />
                      </button>
                    ))}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-medium hover:bg-[#0022ff]/90 transition-all"
                    >
                      <Mail size={16} />
                      <span>Otra consulta (escribinos)</span>
                    </a>
                  </motion.div>
                )}

                {/* LISTA DE PREGUNTAS */}
                {view.type === 'questions' && (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-2"
                  >
                    <button
                      onClick={handleBackToMenu}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0022ff] transition-colors mb-1"
                    >
                      <ArrowLeft size={14} />
                      <span>Volver al menú</span>
                    </button>
                    {view.category.questions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectQuestion(view.category, qa)}
                        className="flex items-center justify-between gap-2 w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#0022ff] hover:text-[#0022ff] transition-all text-left"
                      >
                        <span>{qa.question}</span>
                        <ChevronRight size={16} className="opacity-50 flex-shrink-0" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* RESPUESTA MOSTRADA */}
                {view.type === 'answer' && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-2"
                  >
                    <button
                      onClick={() => handleBackToQuestions(view.category)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0022ff] transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Volver a {view.category.label}</span>
                    </button>
                    <button
                      onClick={handleBackToMenu}
                      className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200 transition-all"
                    >
                      <MessageCircle size={15} />
                      <span>Menú principal</span>
                    </button>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0022ff] text-white rounded-xl text-sm font-medium hover:bg-[#0022ff]/90 transition-all"
                    >
                      <Mail size={16} />
                      <span>¿Otra consulta? Escribinos</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#0022ff] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all relative group"
        id="chat-toggle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle badge if closed */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
};