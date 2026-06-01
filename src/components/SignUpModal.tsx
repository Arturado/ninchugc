import { motion, AnimatePresence } from "motion/react";
import { X, Instagram, Linkedin, Send, Share2 } from "lucide-react";
import { useState, FormEvent } from "react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    handle: "",
    contentTypes: [] as string[]
  });

  const contentOptions = [
    "Beauty", "Lifestyle", "Travel", "Foodie", 
    "Tecnología", "Gaming", "Finanzas", "Hogar/Decoración", "Otro"
  ];

  const handleContentTypeToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(option)
        ? prev.contentTypes.filter(item => item !== option)
        : [...prev.contentTypes, option]
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here we would typically send the data to a backend
    alert("¡Gracias por sumarte a STAGE!");
    onClose();
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
            onClick={onClose}
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
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                id="close-modal"
              >
                <X size={24} />
              </button>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Header Image Area */}
                <div className="relative w-full overflow-hidden">
                  <motion.img 
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src="/UGC-Landing-1.jpg" 
                    alt="STAGE Creators"
                    className="w-full h-auto object-cover block cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-8 md:p-12">
                  {/* Welcome Message */}
                  <div className="mb-10 text-center">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      El espacio que te conecta con las top brands de LATAM para que seas el protagonista. 
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

                      {/* Birth Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Fecha de nacimiento</label>
                        <input
                          required
                          type="date"
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.birthDate}
                          onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Género</label>
                        <select
                          required
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors appearance-none"
                          value={formData.gender}
                          onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="femenino">Femenino</option>
                          <option value="masculino">Masculino</option>
                          <option value="no binario">No Binario</option>
                          <option value="prefiero no decirlo">Prefiero no decirlo</option>
                        </select>
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

                      {/* Username */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Usuario (Instagram o TikTok)</label>
                        <input
                          required
                          type="text"
                          placeholder="@tu_usuario"
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0022ff] focus:outline-none transition-colors"
                          value={formData.handle}
                          onChange={e => setFormData({ ...formData, handle: e.target.value })}
                        />
                      </div>

                      {/* Content Type (Multi-select) */}
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500 block">Tipo de contenido (Selecciona una o más)</label>
                        <div className="flex flex-wrap gap-2">
                          {contentOptions.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleContentTypeToggle(option)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                formData.contentTypes.includes(option)
                                  ? "bg-[#0022ff] text-white shadow-lg"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-5 bg-[#0022ff] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
                      id="signup-submit"
                    >
                      <Send size={20} />
                      SIGN UP
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
                            maskImage: 'url(/INSTAGRAM.svg)',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: 'url(/INSTAGRAM.svg)',
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
                            maskImage: 'url(/LINKEDIN.svg)',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: 'url(/LINKEDIN.svg)',
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
                            maskImage: 'url(/YOUTUBE.svg)',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: 'url(/YOUTUBE.svg)',
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
                            maskImage: 'url(/BEHANCE.svg)',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskImage: 'url(/BEHANCE.svg)',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain'
                          }}
                        />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
