import { motion, AnimatePresence } from "motion/react";
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, FormEvent } from "react";

// Misma URL de Apps Script que el form de creadores.
// El script enruta a la pestaña "Marcas" según el campo formType.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXk7R_ZxIdt46JHzzJ4g7dXczzN5bAAC2nrBBEnnuhZ3vmO42l3nlDaqa2iMKVjpU-/exec";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitStatus = "idle" | "sending" | "success" | "error";

export const BrandModal = ({ isOpen, onClose }: BrandModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    company: "",
    role: "",
    serviceType: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const serviceOptions = [
    "Creación de contenido para mis redes.",
    "Creación de contenido + amplificación en redes del creador.",
  ];

  const resetAndClose = () => {
    setFormData({
      fullName: "", country: "", company: "", role: "",
      serviceType: "", email: "", phone: "",
    });
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!formData.serviceType) {
      setStatus("error");
      setErrorMsg("Seleccioná un tipo de servicio.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      // Apps Script no devuelve headers CORS, por eso usamos no-cors.
      // formType: "marca" le dice al script que escriba en la pestaña Marcas.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          formType: "marca",
          fullName: formData.fullName,
          country: formData.country,
          company: formData.company,
          role: formData.role,
          serviceType: formData.serviceType,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Revisá tu internet e intentá de nuevo.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[120] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative font-sans"
            >
              {/* Close Button */}
              <button
                onClick={resetAndClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                id="close-brand-modal"
              >
                <X size={24} />
              </button>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {status === "success" ? (
                  /* Pantalla de éxito */
                  <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-3">¡Gracias por tu interés en STAGE!</h3>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mb-8">
                      Recibimos tu información. Nuestro equipo se pondrá en contacto para contarte cómo amplificar tu contenido.
                    </p>
                    <button
                      onClick={resetAndClose}
                      className="px-8 py-4 bg-[#0022ff] text-white font-bold uppercase tracking-wider rounded-2xl shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                <>
                {/* Header Image Area */}
                <div className="relative w-full overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={`${import.meta.env.BASE_URL}UGC-Landing-1.jpg`}
                    alt="STAGE Brands"
                    className="w-full h-auto object-cover block cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-8 md:p-12">
                  {/* Welcome Message */}
                  <div className="mb-10 text-center">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      La plataforma que te conecta con los top UGC & creadores de LATAM para amplificar tu contenido.
                      Completa nuestro form para estar al día con nuestras últimas campañas UGC.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Nombre completo</label>
                        <input
                          required
                          type="text"
                          placeholder="Tu nombre aquí"
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.fullName}
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>

                      {/* Country */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">País</label>
                        <input
                          required
                          type="text"
                          placeholder="Ej: Argentina, México..."
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.country}
                          onChange={e => setFormData({ ...formData, country: e.target.value })}
                        />
                      </div>

                      {/* Company */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Empresa</label>
                        <input
                          required
                          type="text"
                          placeholder="Nombre de tu empresa"
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Rol</label>
                        <input
                          required
                          type="text"
                          placeholder="Ej: Marketing Manager..."
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Email</label>
                        <input
                          required
                          type="email"
                          placeholder="hola@ejemplo.com"
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Teléfono</label>
                        <input
                          required
                          type="tel"
                          placeholder="+54 9 11 ..."
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      {/* Service Type (Single select via buttons) */}
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500 block">Tipo de servicio</label>
                        <div className="flex flex-col gap-3">
                          {serviceOptions.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setFormData({ ...formData, serviceType: option })}
                              className={`px-5 py-4 rounded-2xl text-sm font-medium text-left transition-all border-2 ${
                                formData.serviceType === option
                                  ? "bg-[#0022ff] text-white border-[#0022ff] shadow-lg"
                                  : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mensaje de error */}
                    {status === "error" && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      whileHover={status === "sending" ? {} : { scale: 1.02 }}
                      whileTap={status === "sending" ? {} : { scale: 0.98 }}
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-5 bg-[#0022ff] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                      id="brand-submit"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          ENVIANDO...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          ENVIAR
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Footer Section */}
                  <div className="mt-16 pt-10 border-t border-gray-100 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-wider mb-6">¿Querés conocer más sobre NINCH?</p>
                    <div className="flex justify-center flex-wrap gap-2.5">
                      <motion.a
                        whileHover={{ y: -5, scale: 1.1 }}
                        href="https://www.instagram.com/ninchcompany/"
                        target="_blank"
                        rel="noreferrer"
                        className="group"
                      >
                        <div
                          className="w-7 h-7 bg-[#0022ff] transition-colors"
                          style={{
                            maskImage: `url(${import.meta.env.BASE_URL}INSTAGRAM.svg)`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: `url(${import.meta.env.BASE_URL}INSTAGRAM.svg)`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain'
                          }}
                        />
                      </motion.a>
                      <motion.a
                        whileHover={{ y: -5, scale: 1.1 }}
                        href="https://www.linkedin.com/company/ninch-comunicacion-estrategica/"
                        target="_blank"
                        rel="noreferrer"
                        className="group"
                      >
                        <div
                          className="w-7 h-7 bg-[#0022ff] transition-colors"
                          style={{
                            maskImage: `url(${import.meta.env.BASE_URL}LINKEDIN.svg)`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: `url(${import.meta.env.BASE_URL}LINKEDIN.svg)`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain'
                          }}
                        />
                      </motion.a>
                      <motion.a
                        whileHover={{ y: -5, scale: 1.1 }}
                        href="https://www.youtube.com/@NinchCompany"
                        target="_blank"
                        rel="noreferrer"
                        className="group"
                      >
                        <div
                          className="w-7 h-7 bg-[#0022ff] transition-colors"
                          style={{
                            maskImage: `url(${import.meta.env.BASE_URL}YOUTUBE.svg)`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: `url(${import.meta.env.BASE_URL}YOUTUBE.svg)`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain'
                          }}
                        />
                      </motion.a>
                      <motion.a
                        whileHover={{ y: -5, scale: 1.1 }}
                        href="https://www.behance.net/ninchcompany"
                        target="_blank"
                        rel="noreferrer"
                        className="group"
                      >
                        <div
                          className="w-7 h-7 bg-[#0022ff] transition-colors"
                          style={{
                            maskImage: `url(${import.meta.env.BASE_URL}BEHANCE.svg)`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: `url(${import.meta.env.BASE_URL}BEHANCE.svg)`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain'
                          }}
                        />
                      </motion.a>
                    </div>
                  </div>
                </div>
                </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};