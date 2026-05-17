import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Sparkles, 
  Copy, 
  RefreshCw,
  Target,
  FileText,
  UserCircle,
  Layout,
  Layers,
  Moon,
  Sun,
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GeminiService, PromptTechnique, PromptAnalysis, RefinedPrompt } from './services/geminiService';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [originalPrompt, setOriginalPrompt] = useState('');
  const [technique, setTechnique] = useState<PromptTechnique>(PromptTechnique.ZERO_SHOT);
  const [taskType, setTaskType] = useState('Escritura creativa');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [refinedData, setRefinedData] = useState<RefinedPrompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const taskTypes = [
    'Escritura creativa',
    'Análisis de datos',
    'Generación de código',
    'Resumen de texto',
    'Atención al cliente',
    'Planificación estratégica'
  ];

  const handleProcess = async () => {
    if (!originalPrompt.trim()) return;

    setError(null);
    setCopied(false);
    setIsAnalyzing(true);
    setIsRefining(true);

    try {
      const [analysisResult, refinementResult] = await Promise.all([
        GeminiService.analyzePrompt(originalPrompt),
        GeminiService.refinePrompt(originalPrompt, technique, taskType)
      ]);

      setAnalysis(analysisResult);
      setRefinedData(refinementResult);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al procesar el prompt. Por favor intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
      setIsRefining(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans transition-colors duration-300",
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Header */}
      <header className={cn(
        "h-16 border-b flex items-center justify-between px-8 sticky top-0 z-50 shrink-0 shadow-sm transition-colors duration-300",
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png" 
              alt="Logo SENA" 
              className={cn(
                "w-full h-full object-contain",
                isDarkMode && "brightness-0 invert"
              )}
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className={cn(
            "text-xl font-bold tracking-tight transition-colors",
            isDarkMode ? "text-slate-100" : "text-slate-800"
          )}>
            Prompt <span className="text-sena">Maestro SENA</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Estado</span>
            <span className={cn("flex h-2 w-2 rounded-full", isRefining ? "bg-orange-400 animate-pulse" : "bg-green-500")}></span>
          </div>

          <button
            onClick={() => setShowTutorial(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all border shadow-sm text-xs font-medium",
              isDarkMode 
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            )}
          >
            <BookOpen className="w-4 h-4 text-sena" />
            <span className="hidden md:inline">Tutorial</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "p-2 rounded-lg transition-all border shadow-sm",
              isDarkMode 
                ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            )}
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => {
              setOriginalPrompt('');
              setAnalysis(null);
              setRefinedData(null);
            }}
            className="px-4 py-2 bg-sena text-white rounded-md text-sm font-medium hover:opacity-90 transition-colors shadow-sm active:scale-95"
          >
            Nueva Sesión
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ filter: 'blur(8px)', opacity: 0.9 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          exit={{ filter: 'blur(8px)', opacity: 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-[1400px] mx-auto w-full overflow-hidden"
        >
          {/* Left Column */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6 overflow-y-auto pr-1">
            <section className={cn(
              "rounded-xl border p-6 flex flex-col gap-6 shadow-sm transition-colors duration-300",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center justify-between">
                <h2 className={cn(
                  "text-sm font-semibold flex items-center gap-2",
                  isDarkMode ? "text-slate-200" : "text-slate-700"
                )}>
                  <Layout className="w-4 h-4 text-sena" />
                  Estructura del Prompt
                </h2>
                <div className="flex gap-1">
                  {Object.values(PromptTechnique).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTechnique(t)}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-medium transition-all border shadow-sm",
                        technique === t 
                          ? "bg-sena text-white border-sena" 
                          : isDarkMode
                            ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prompt Original</label>
                    <span className="text-[10px] text-slate-400 font-mono italic">{originalPrompt.length} caracteres</span>
                  </div>
                  <textarea
                    value={originalPrompt}
                    onChange={(e) => setOriginalPrompt(e.target.value)}
                    placeholder="Introduce tu prompt base aquí..."
                    className={cn(
                      "w-full h-32 px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sena/20 transition-all resize-none italic leading-relaxed",
                      isDarkMode 
                        ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-sena" 
                        : "bg-slate-50 border-slate-200 text-slate-600 placeholder:text-slate-400 focus:border-sena"
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-sena" />
                      Tipo de Tarea
                    </label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all cursor-pointer font-medium",
                        isDarkMode 
                          ? "bg-slate-800 border-slate-700 text-slate-300 focus:border-sena" 
                          : "bg-slate-50 border-slate-200 text-slate-700 focus:border-sena"
                      )}
                    >
                      {taskTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <RefreshCw className={cn("w-3.5 h-3.5 text-sena", isRefining && "animate-spin")} />
                      Acción
                    </label>
                    <button
                      onClick={handleProcess}
                      disabled={!originalPrompt.trim() || isRefining}
                      className="w-full py-2 bg-slate-900 border border-slate-800 text-white dark:bg-sena dark:border-sena rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
                    >
                      {isRefining ? 'Optimizando...' : 'Mejorar Prompt'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {!analysis && !isRefining && (
              <div className={cn(
                "rounded-xl border p-8 flex flex-col items-center justify-center text-center gap-4 border-dashed h-full min-h-[200px] transition-colors",
                isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isDarkMode ? "bg-slate-800" : "bg-slate-50"
                )}>
                  <Layers className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-500">Listo para analizar</h3>
                  <p className="text-slate-500 text-xs max-w-[240px] mt-1">El análisis estructural aparecerá aquí después de procesar tu prompt.</p>
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-600 dark:text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <AnimatePresence>
              {refinedData && !isRefining && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    { label: 'Rol', value: refinedData.role, icon: UserCircle },
                    { label: 'Tarea', value: refinedData.task, icon: FileText },
                    { label: 'Contexto', value: refinedData.context, icon: Layout },
                    { label: 'Formato', value: refinedData.format, icon: Layers },
                  ].map((item, idx) => (
                    <div key={idx} className={cn(
                      "p-4 rounded-xl border shadow-sm transition-colors",
                      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                         <item.icon className="w-3.5 h-3.5 text-sena" />
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      </div>
                      <p className={cn(
                        "text-sm font-medium line-clamp-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}>{item.value}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6 overflow-y-auto pb-4">
            <section className={cn(
              "rounded-xl border p-6 shadow-sm transition-colors duration-300",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              <h2 className={cn(
                "text-sm font-semibold mb-6",
                isDarkMode ? "text-slate-200" : "text-slate-700"
              )}>Precisión del Prompt</h2>
              <div className="flex items-center gap-8">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle className={isDarkMode ? "text-slate-800" : "text-slate-100"} strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                    <circle 
                      className="text-sena transition-all duration-1000 ease-out" 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={analysis ? 251.2 - (251.2 * analysis.precision) / 100 : 251.2} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" cx="48" cy="48" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-slate-800")}>
                      {analysis ? analysis.precision : '0'}%
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  {isAnalyzing ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-2 rounded w-full bg-slate-800" />
                      <div className="h-2 rounded w-full bg-slate-800" />
                      <div className="h-2 rounded w-full bg-slate-800" />
                    </div>
                  ) : analysis ? (
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Indicadores Clave</p>
                       <div className="flex flex-wrap gap-2">
                         {analysis.strengths.slice(0, 2).map((s, i) => (
                           <span key={i} className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-medium border border-green-500/20">
                             {s.split(' ')[0]} ✓
                           </span>
                         ))}
                          {analysis.missingElements.map((m, i) => (
                           <span key={i} className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full font-medium border border-red-500/20">
                             Sin {m}
                           </span>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Esperando datos de ejecución...</p>
                  )}
                </div>
              </div>
            </section>

            <section className={cn(
              "flex-1 rounded-xl p-6 flex flex-col gap-4 shadow-lg min-h-[400px] transition-colors border",
              isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-900 border-slate-900 text-white"
            )}>
              <div className="flex items-center justify-between">
                <h2 className={cn(
                  "text-sm font-semibold",
                  isDarkMode ? "text-slate-400" : "text-slate-300"
                )}>
                  Resultado Optimizado ({technique})
                </h2>
                <button 
                  onClick={() => refinedData && copyToClipboard(refinedData.improvedPrompt)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-medium",
                    copied 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "hover:bg-white/10 text-slate-400 hover:text-white"
                  )}
                  disabled={!refinedData}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Prompt</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className={cn(
                "flex-1 rounded-lg p-5 font-mono text-[13px] leading-relaxed overflow-y-auto border transition-colors",
                isDarkMode ? "bg-slate-950/50 border-white/5 text-emerald-300" : "bg-slate-800/50 border-white/5 text-emerald-200"
              )}>
                {isRefining ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-32 bg-white/5 rounded w-full mt-4" />
                  </div>
                ) : refinedData ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider"># Estructura</span>
                      <div className="pl-4 mt-2 space-y-1">
                        <div className="flex gap-2">
                          <span className="text-sena">Rol:</span> <span>{refinedData.role}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sena">Tarea:</span> <span>{refinedData.task}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider"># Prompt Refinado</span>
                      <div className="mt-3 text-slate-300 whitespace-pre-wrap">
                        <div className="markdown-body">
                          <ReactMarkdown>
                            {refinedData.improvedPrompt}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 font-sans italic gap-2">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <span>Configura tu prompt para comenzar</span>
                  </div>
                )}
              </div>

              {refinedData && !isRefining && (
                <div className="p-3 bg-sena/5 border border-sena/20 rounded-lg">
                  <p className="text-[11px] text-sena/80 leading-relaxed font-sans flex gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-sena" />
                    <span><span className="font-bold text-sena uppercase mr-1">Razón:</span> {refinedData.explanation}</span>
                  </p>
                </div>
              )}
            </section>
          </div>
        </motion.main>
      </AnimatePresence>

      <footer className={cn(
        "h-12 border-t flex items-center px-8 text-[11px] shrink-0 justify-between transition-colors",
        isDarkMode ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"
      )}>
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <span className={cn("w-1.5 h-1.5 rounded-full", "bg-sena")} />
            <span>ID de Sesión: {isDarkMode ? 'DRK' : 'LHT'}-{Math.floor(Math.random() * 9000) + 1000}</span>
          </div>
          <span className="hidden sm:inline">IA Engine: Gemini 3 Flash</span>
        </div>
        <div className="flex gap-6 items-center font-medium">
          <a href="#" className="hover:text-sena transition-colors">Terminos</a>
          <a href="#" className="hover:text-sena transition-colors">Privacidad</a>
        </div>
      </footer>

      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={cn(
                "w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[90vh]",
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              )}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-inherit">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sena/10 flex items-center justify-center text-sena font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-slate-900")}>
                      Tutorial Interactivo
                    </h2>
                    <p className="text-xs text-slate-500">Aprende a usar Prompt Maestro SENA</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="p-2 hover:bg-slate-500/10 rounded-full transition-colors"
                >
                  <X className={cn("w-5 h-5", isDarkMode ? "text-slate-400" : "text-slate-500")} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tutorialStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    {tutorialStep === 0 && (
                      <div className="space-y-4">
                        <div className="aspect-video bg-sena/5 rounded-xl border border-sena/10 flex items-center justify-center overflow-hidden">
                           <VisualFlow isDarkMode={isDarkMode} />
                        </div>
                        <h3 className={cn("text-xl font-bold text-center", isDarkMode ? "text-sena" : "text-sena")}>
                          Bienvenido al Flujo de Trabajo
                        </h3>
                        <p className={cn("text-sm text-center leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                          Esta herramienta aplica ingeniería de prompts avanzada para transformar ideas simples en instrucciones poderosas para IA. 
                          Arriba puedes ver el mapa lógico de cómo procesamos cada solicitud.
                        </p>
                      </div>
                    )}

                    {tutorialStep === 1 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-500/5 rounded-xl border border-dashed border-slate-500/20 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-sena text-white flex items-center justify-center text-xs font-bold">1</span>
                            <h4 className={cn("font-bold", isDarkMode ? "text-white" : "text-slate-900")}>Ingreso del Prompt Original</h4>
                          </div>
                          <p className={cn("text-sm leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                            Introduce tu idea tal como te surge en el cuadro de texto. No importa si es desordenado.
                          </p>
                          <div className={cn("p-3 rounded bg-inherit flex items-center gap-3 text-xs italic", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                            <Info className="w-4 h-4" />
                            <span>Ejemplo: "Escribe un correo sobre un proyecto"</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {tutorialStep === 2 && (
                      <div className="space-y-4">
                         <div className="p-4 bg-slate-500/5 rounded-xl border border-dashed border-slate-500/20 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-sena text-white flex items-center justify-center text-xs font-bold">2</span>
                            <h4 className={cn("font-bold", isDarkMode ? "text-white" : "text-slate-900")}>Configuración Estratégica</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                             <div className="p-2 bg-sena/10 rounded border border-sena/20">
                               <span className="text-[10px] font-bold text-sena uppercase mr-2">Zero-Shot</span>
                               <span className="text-xs">Para tareas directas y comunes.</span>
                             </div>
                             <div className="p-2 bg-sena/10 rounded border border-sena/20">
                               <span className="text-[10px] font-bold text-sena uppercase mr-2">Few-Shot</span>
                               <span className="text-xs">Cuando necesitas un estilo o formato específico.</span>
                             </div>
                             <div className="p-2 bg-sena/10 rounded border border-sena/20">
                               <span className="text-[10px] font-bold text-sena uppercase mr-2">Chain of Thought</span>
                               <span className="text-xs">Para problemas que requieren lógica paso a paso.</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {tutorialStep === 3 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-500/5 rounded-xl border border-dashed border-slate-500/20 flex flex-col gap-3 text-center">
                           <Sparkles className="w-12 h-12 text-sena mx-auto animate-bounce" />
                           <h4 className={cn("font-bold text-lg", isDarkMode ? "text-white" : "text-slate-900")}>Análisis y Refinamiento</h4>
                           <p className={cn("text-sm leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                             Al hacer clic en <span className="font-bold text-sena">"Mejorar Prompt"</span>, Gemini analizará la precisión estructural y construirá un mensaje basado en el estándar: 
                           </p>
                           <div className="flex justify-center gap-2 flex-wrap">
                             {['Rol', 'Tarea', 'Contexto', 'Formato'].map(tag => (
                               <span key={tag} className="px-2 py-1 bg-sena/20 text-sena text-[10px] font-bold rounded uppercase tracking-wider">{tag}</span>
                             ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-inherit flex items-center justify-between">
                <button
                  onClick={() => setTutorialStep(prev => Math.max(0, prev - 1))}
                  disabled={tutorialStep === 0}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    tutorialStep === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-500/10"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        tutorialStep === s ? "w-6 bg-sena" : "w-1.5 bg-slate-500/30"
                      )}
                    />
                  ))}
                </div>

                {tutorialStep === 3 ? (
                  <button
                    onClick={() => {
                      setShowTutorial(false);
                      setTutorialStep(0);
                    }}
                    className="px-6 py-2 bg-sena text-white rounded-lg text-sm font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    Empezar ahora
                  </button>
                ) : (
                  <button
                    onClick={() => setTutorialStep(prev => Math.min(3, prev + 1))}
                    className="flex items-center gap-2 px-4 py-2 bg-sena/10 text-sena rounded-lg text-sm font-bold hover:bg-sena/20 transition-all"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const VisualFlow = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const color = isDarkMode ? "#39A900" : "#39A900";
  const textColor = isDarkMode ? "#94a3b8" : "#475569";

  return (
    <svg viewBox="0 0 500 240" className="w-full h-full p-4">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      
      {/* Nodes */}
      <rect x="20" y="20" width="100" height="40" rx="8" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4" />
      <text x="70" y="45" textAnchor="middle" fontSize="12" fill={textColor} fontWeight="bold">INICIO</text>
      
      <rect x="150" y="20" width="120" height="40" rx="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
      <text x="210" y="45" textAnchor="middle" fontSize="11" fill={textColor}>Entrada Prompt</text>
      
      <rect x="300" y="20" width="120" height="40" rx="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
      <text x="360" y="45" textAnchor="middle" fontSize="11" fill={textColor}>Selección Técnica</text>

      <path d="M 420 40 L 460 40 L 460 120 L 420 120" fill="none" stroke={color} strokeWidth="2" markerEnd="url(#arrow)" />
      
      <rect x="300" y="100" width="120" height="40" rx="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <text x="360" y="125" textAnchor="middle" fontSize="11" fill={textColor} fontWeight="bold">GEMINI AI</text>
      
      <rect x="150" y="100" width="120" height="40" rx="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
      <text x="210" y="125" textAnchor="middle" fontSize="11" fill={textColor}>Análisis Métricas</text>
      
      <rect x="20" y="100" width="100" height="40" rx="8" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4" />
      <text x="70" y="125" textAnchor="middle" fontSize="12" fill={textColor} fontWeight="bold">RESULTADO</text>

      {/* Arrows */}
      <line x1="120" y1="40" x2="145" y2="40" stroke={color} strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="270" y1="40" x2="295" y2="40" stroke={color} strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="300" y1="120" x2="275" y2="120" stroke={color} strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="150" y1="120" x2="125" y2="120" stroke={color} strokeWidth="2" markerEnd="url(#arrow)" />

      {/* Vertical Connection */}
      <text x="465" y="85" textAnchor="middle" fontSize="10" fill={color} transform="rotate(90, 465, 85)">PROCESANDO</text>
    </svg>
  );
};

