import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, LogOut, CheckCircle2, XCircle, ArrowRight, Play } from 'lucide-react';

const formulas = [
  { f_s: "1 / s", f_t: "1" },
  { f_s: "1 / (s^(n+1)) [n is +ve integer]", f_t: "t^n / n!" },
  { f_s: "1 / (s - a)", f_t: "e^(at)" },
  { f_s: "1 / (s + a)", f_t: "e^(-at)" },
  { f_s: "1 / (s^2 + a^2)", f_t: "(1/a) * sin(at)" },
  { f_s: "s / (s^2 + a^2)", f_t: "cos(at)" },
  { f_s: "1 / (s^2 - a^2)", f_t: "(1/a) * sinh(at)" },
  { f_s: "s / (s^2 - a^2)", f_t: "cosh(at)" },
  { f_s: "1 / ((s - a)^2 + b^2)", f_t: "(1/b) * e^(at) * sin(bt)" },
  { f_s: "(s - a) / ((s - a)^2 + b^2)", f_t: "e^(at) * cos(bt)" },
  { f_s: "2as / ((s^2 + a^2)^2)", f_t: "t * sin(at)" },
  { f_s: "(s^2 - a^2) / ((s^2 + a^2)^2)", f_t: "t * cos(at)" }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [currentQ, setCurrentQ] = useState<typeof formulas[0] | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const generateQuestion = useCallback(() => {
    const q = formulas[Math.floor(Math.random() * formulas.length)];
    const otherAnswers = formulas.filter(f => f.f_t !== q.f_t).map(f => f.f_t);
    const wrongChoices = shuffleArray(otherAnswers).slice(0, 3);
    const allChoices = shuffleArray([q.f_t, ...wrongChoices]);
    
    setCurrentQ(q);
    setOptions(allChoices);
    setFeedback(null);
    setSelectedChoice(null);
  }, []);

  const startGame = () => {
    setGameState('playing');
    generateQuestion();
  };

  const quitGame = () => {
    setGameState('menu');
    setCurrentQ(null);
    setFeedback(null);
    setSelectedChoice(null);
  };

  const handleChoice = (choice: string) => {
    if (feedback !== null) return; // Prevent multiple clicks while showing feedback

    setSelectedChoice(choice);
    if (choice === currentQ?.f_t) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      // Need a way to ensure we're still playing before advancing, but 
      // simple timeout is okay since quitting resets the whole top-down state.
      setGameState((currentState) => {
        if (currentState === 'playing') {
          generateQuestion();
        }
        return currentState;
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-200">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {gameState === 'menu' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-850/50 backdrop-blur border border-slate-800 rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                <BookOpen size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4 tracking-tight">
                Inverse Laplace Game
              </h1>
              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                No timers, no scores. Just pure mathematics. Test your knowledge of inverse Laplace transforms.
              </p>
              <button 
                onClick={startGame}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-full transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                <Play size={20} className="fill-current" />
                Start Practice
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-medium tracking-tight text-slate-300">Inverse Laplace</span>
                </div>
                <button 
                  onClick={quitGame}
                  className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-800"
                >
                  Quit <LogOut size={16} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {currentQ && (
                  <motion.div
                    key={currentQ.f_s}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Question Card */}
                    <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 md:p-10 mb-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                      
                      <div className="relative z-10">
                        <p className="text-slate-400 font-medium mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                          Find the inverse transform of
                        </p>
                        
                        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 overflow-x-auto custom-scrollbar">
                          <code className="text-xl md:text-2xl font-mono text-indigo-300 whitespace-nowrap">
                            F(s) = {currentQ.f_s}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {options.map((choice, i) => {
                        const isSelected = selectedChoice === choice;
                        const isCorrectAnswer = choice === currentQ.f_t;
                        
                        // Determine styling based on feedback state
                        let buttonClassName = "relative overflow-hidden group text-left px-6 py-5 rounded-xl border transition-all duration-200 shadow-sm ";
                        let icon = null;

                        if (feedback && isCorrectAnswer) {
                          // Correct answer styling (highlight green even if not selected)
                          buttonClassName += "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 scale-[1.02] md:hover:scale-[1.02] shadow-emerald-500/10";
                          icon = <CheckCircle2 className="text-emerald-400 min-w-6" size={24} />;
                        } else if (feedback && isSelected && !isCorrectAnswer) {
                          // Selected wrong answer
                          buttonClassName += "bg-rose-500/10 border-rose-500/40 text-rose-300";
                          icon = <XCircle className="text-rose-400 min-w-6" size={24} />;
                        } else if (feedback) {
                          // Other answers while feedback is showing
                          buttonClassName += "bg-slate-800/30 border-slate-800/50 text-slate-600 cursor-not-allowed";
                        } else {
                          // Default idle state
                          buttonClassName += "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600 hover:shadow-md cursor-pointer active:scale-95";
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleChoice(choice)}
                            disabled={feedback !== null}
                            className={buttonClassName}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <code className="font-mono text-sm md:text-base leading-tight">
                                <span className={feedback ? "opacity-30 mr-2" : "text-slate-500 mr-2 group-hover:text-slate-400 transition-colors"}>
                                  {i + 1}.
                                </span>
                                f(t) = {choice}
                              </code>
                              {icon}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Feedback Toast/Progress Hint */}
                    <div className="mt-8 flex justify-center min-h-[40px]">
                      <AnimatePresence>
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${
                              feedback === 'correct' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                            <div className="w-1 h-1 rounded-full bg-current mx-1 animate-pulse" />
                            <span className="text-slate-500 text-xs font-normal">Next question loading...</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Custom Scrolbar styles for any math overflow */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}} />
    </div>
  );
}
