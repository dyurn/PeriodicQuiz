
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FULL_ELEMENTS } from './data/elements';
import { Question, QuestionType, ElementData } from './types';

// Components
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-8">
    <div 
      className="h-full bg-blue-500 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const App: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFact, setShowFact] = useState<string>("");
  const [isLoadingFact, setIsLoadingFact] = useState(false);

  const generateQuestion = useCallback(() => {
    const types = [QuestionType.NUMBER_TO_NAME, QuestionType.NAME_TO_NUMBER, QuestionType.SYMBOL_TO_BOTH];
    const type = types[Math.floor(Math.random() * types.length)];
    const target = FULL_ELEMENTS[Math.floor(Math.random() * FULL_ELEMENTS.length)];
    
    let correctAnswer = "";
    const options: string[] = [];

    const getOptionString = (el: ElementData, qType: QuestionType) => {
      switch (qType) {
        case QuestionType.NUMBER_TO_NAME: return el.name;
        case QuestionType.NAME_TO_NUMBER: return el.number.toString();
        case QuestionType.SYMBOL_TO_BOTH: return `${el.name} (${el.number})`;
        default: return "";
      }
    };

    correctAnswer = getOptionString(target, type);
    options.push(correctAnswer);

    // Get 3 random unique wrong options
    while (options.length < 4) {
      const randomEl = FULL_ELEMENTS[Math.floor(Math.random() * FULL_ELEMENTS.length)];
      const opt = getOptionString(randomEl, type);
      if (!options.includes(opt)) {
        options.push(opt);
      }
    }

    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      type,
      targetElement: target,
      options: shuffledOptions,
      correctAnswer
    });
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFact("");
  }, []);

  const fetchFact = async (elementName: string) => {
    setIsLoadingFact(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Donne-moi un fait insolite et court (max 1 phrase) sur l'élément chimique ${elementName} en français.`,
      });
      setShowFact(response.text || "");
    } catch (error) {
      console.error("Fact error", error);
    } finally {
      setIsLoadingFact(false);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === currentQuestion?.correctAnswer;
    setIsCorrect(correct);

    if (correct && currentQuestion) {
      fetchFact(currentQuestion.targetElement.name);
    }
  };

  if (!currentQuestion) return null;

  const { type, targetElement, options, correctAnswer } = currentQuestion;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#0f172a] text-slate-200">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl z-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            Periodic Pro Quiz
          </h1>
          <p className="text-slate-400 font-light">Maîtrisez le tableau périodique sans fin</p>
        </header>

        <main className="glass p-8 rounded-3xl shadow-2xl relative">
          {/* Question Display */}
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-6 border border-slate-700">
              Question
            </span>
            
            <div className="min-h-[140px] flex flex-col items-center justify-center">
              {type === QuestionType.NUMBER_TO_NAME && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-lg text-slate-400 mb-2">Quel est le nom de l'élément numéro</p>
                  <p className="text-7xl font-bold mono text-white">{targetElement.number}</p>
                </div>
              )}

              {type === QuestionType.NAME_TO_NUMBER && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-lg text-slate-400 mb-2">Quel est le numéro atomique de</p>
                  <p className="text-6xl font-bold text-white italic">{targetElement.name}</p>
                </div>
              )}

              {type === QuestionType.SYMBOL_TO_BOTH && (
                <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center">
                  <p className="text-lg text-slate-400 mb-4">Trouvez le nom et le numéro pour le symbole</p>
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg border-2"
                    style={{ 
                        backgroundColor: `${targetElement.color}22`,
                        borderColor: targetElement.color,
                        color: targetElement.color 
                    }}
                  >
                    {targetElement.symbol}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOpt = option === correctAnswer;
              const showCorrect = selectedOption !== null && isCorrectOpt;
              const showWrong = isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  className={`
                    group relative p-6 rounded-2xl text-left transition-all duration-300 transform active:scale-95
                    ${selectedOption === null ? 'hover:bg-slate-700/50 hover:border-blue-500/50 border-transparent' : 'cursor-default'}
                    ${showCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}
                    ${showWrong ? 'bg-rose-500/20 border-rose-500 text-rose-300' : ''}
                    ${selectedOption !== null && !isCorrectOpt && !isSelected ? 'opacity-40 grayscale-[0.5]' : ''}
                    border bg-slate-800/40
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{option}</span>
                    {showCorrect && (
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {showWrong && (
                      <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result & Info Section */}
          <div className="mt-8 min-h-[80px] flex flex-col items-center">
            {selectedOption !== null && (
              <div className="animate-in fade-in zoom-in-95 text-center w-full">
                {showFact && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 italic text-sm">
                        <span className="font-bold mr-2 not-italic">Le saviez-vous ?</span>
                        {showFact}
                    </div>
                )}
                
                {isLoadingFact && (
                    <div className="mb-6 text-slate-500 text-xs animate-pulse">Chargement d'une info croustillante...</div>
                )}

                <button
                  onClick={generateQuestion}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-900/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-8 text-center text-slate-500 text-xs">
          Apprentissage infini • Pas de points, juste du savoir.
        </footer>
      </div>
    </div>
  );
};

export default App;
