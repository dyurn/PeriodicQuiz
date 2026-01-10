
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenAI } from '@google/genai';

// --- TYPES ---
interface ElementData {
  number: number;
  symbol: string;
  name: string;
  category: string;
  color: string;
}

enum QuestionType {
  NUMBER_TO_NAME = 'NUMBER_TO_NAME',
  NAME_TO_NUMBER = 'NAME_TO_NUMBER',
  SYMBOL_TO_BOTH = 'SYMBOL_TO_BOTH'
}

interface Question {
  type: QuestionType;
  targetElement: ElementData;
  options: string[];
  correctAnswer: string;
}

// --- DATA ---
const FULL_ELEMENTS: ElementData[] = [
  { number: 1, symbol: "H", name: "Hydrogène", category: "nonmetal", color: "#3d82ed" },
  { number: 2, symbol: "He", name: "Hélium", category: "noble-gas", color: "#7435e0" },
  { number: 3, symbol: "Li", name: "Lithium", category: "alkali-metal", color: "#e83e35" },
  { number: 4, symbol: "Be", name: "Béryllium", category: "alkaline-earth", color: "#e67e22" },
  { number: 5, symbol: "B", name: "Bore", category: "metalloid", color: "#27ae60" },
  { number: 6, symbol: "C", name: "Carbone", category: "nonmetal", color: "#3d82ed" },
  { number: 7, symbol: "N", name: "Azote", category: "nonmetal", color: "#3d82ed" },
  { number: 8, symbol: "O", name: "Oxygène", category: "nonmetal", color: "#3d82ed" },
  { number: 9, symbol: "F", name: "Fluor", category: "halogen", color: "#f1c40f" },
  { number: 10, symbol: "Ne", name: "Néon", category: "noble-gas", color: "#7435e0" },
  { number: 11, symbol: "Na", name: "Sodium", category: "alkali-metal", color: "#e83e35" },
  { number: 12, symbol: "Mg", name: "Magnésium", category: "alkaline-earth", color: "#e67e22" },
  { number: 13, symbol: "Al", name: "Aluminium", category: "post-transition", color: "#95a5a6" },
  { number: 14, symbol: "Si", name: "Silicium", category: "metalloid", color: "#27ae60" },
  { number: 15, symbol: "P", name: "Phosphore", category: "nonmetal", color: "#3d82ed" },
  { number: 16, symbol: "S", name: "Soufre", category: "nonmetal", color: "#3d82ed" },
  { number: 17, symbol: "Cl", name: "Chlore", category: "halogen", color: "#f1c40f" },
  { number: 18, symbol: "Ar", name: "Argon", category: "noble-gas", color: "#7435e0" },
  { number: 19, symbol: "K", name: "Potassium", category: "alkali-metal", color: "#e83e35" },
  { number: 20, symbol: "Ca", name: "Calcium", category: "alkaline-earth", color: "#e67e22" },
  { number: 26, symbol: "Fe", name: "Fer", category: "transition-metal", color: "#f39c12" },
  { number: 29, symbol: "Cu", name: "Cuivre", category: "transition-metal", color: "#f39c12" },
  { number: 47, symbol: "Ag", name: "Argent", category: "transition-metal", color: "#f39c12" },
  { number: 79, symbol: "Au", name: "Or", category: "transition-metal", color: "#f39c12" },
  { number: 80, symbol: "Hg", name: "Mercure", category: "transition-metal", color: "#f39c12" },
  { number: 82, symbol: "Pb", name: "Plomb", category: "post-transition", color: "#95a5a6" },
  { number: 92, symbol: "U", name: "Uranium", category: "actinide", color: "#c0392b" },
  { number: 30, symbol: "Zn", name: "Zinc", category: "transition-metal", color: "#f39c12" }
];

// --- APP COMPONENT ---
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

    while (options.length < 4) {
      const randomEl = FULL_ELEMENTS[Math.floor(Math.random() * FULL_ELEMENTS.length)];
      const opt = getOptionString(randomEl, type);
      if (!options.includes(opt)) {
        options.push(opt);
      }
    }

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

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleOptionClick = async (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === currentQuestion?.correctAnswer;
    setIsCorrect(correct);

    if (correct && currentQuestion && window.process?.env?.API_KEY) {
      setIsLoadingFact(true);
      try {
        const ai = new GoogleGenAI({ apiKey: window.process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Donne-moi un fait insolite et très court sur l'élément ${currentQuestion.targetElement.name} en français.`,
        });
        setShowFact(response.text || "");
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingFact(false);
      }
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl z-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            Periodic Pro Quiz
          </h1>
          <p className="text-slate-400 font-light">Maîtrisez le tableau périodique</p>
        </header>

        <main className="glass p-8 rounded-3xl shadow-2xl">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-6 border border-slate-700">
              Question
            </span>
            
            <div className="min-h-[140px] flex flex-col items-center justify-center">
              {currentQuestion.type === QuestionType.NUMBER_TO_NAME && (
                <div>
                  <p className="text-lg text-slate-400 mb-2">Quel est le nom de l'élément numéro</p>
                  <p className="text-7xl font-bold mono text-white">{currentQuestion.targetElement.number}</p>
                </div>
              )}
              {currentQuestion.type === QuestionType.NAME_TO_NUMBER && (
                <div>
                  <p className="text-lg text-slate-400 mb-2">Quel est le numéro atomique de</p>
                  <p className="text-6xl font-bold text-white italic">{currentQuestion.targetElement.name}</p>
                </div>
              )}
              {currentQuestion.type === QuestionType.SYMBOL_TO_BOTH && (
                <div className="flex flex-col items-center">
                  <p className="text-lg text-slate-400 mb-4">Nom et numéro pour le symbole</p>
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg border-2"
                    style={{ borderColor: currentQuestion.targetElement.color, color: currentQuestion.targetElement.color }}
                  >
                    {currentQuestion.targetElement.symbol}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                className={`
                  p-6 rounded-2xl text-left transition-all border
                  ${selectedOption === null ? 'hover:bg-slate-700/50 border-transparent bg-slate-800/40' : 'cursor-default'}
                  ${selectedOption !== null && option === currentQuestion.correctAnswer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : ''}
                  ${selectedOption === option && option !== currentQuestion.correctAnswer ? 'bg-rose-500/20 border-rose-500 text-rose-300' : ''}
                  ${selectedOption !== null && option !== currentQuestion.correctAnswer && option !== selectedOption ? 'opacity-40 bg-slate-800/20' : ''}
                `}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 min-h-[100px] flex flex-col items-center">
            {selectedOption !== null && (
              <div className="text-center w-full">
                {showFact && <div className="mb-4 p-4 rounded-xl bg-blue-500/10 text-blue-200 text-sm italic">{showFact}</div>}
                {isLoadingFact && <div className="mb-4 text-xs animate-pulse">Recherche d'une info...</div>}
                <button
                  onClick={generateQuestion}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all transform hover:-translate-y-1"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
