
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

// --- TYPES ---
interface ElementData {
  number: number;
  symbol: string;
  name: string;
  category: string;
  color: string;
  row: number;
  col: number;
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

type Tab = 'quiz' | 'revision';

// --- DATA (Les 118 éléments) ---
const FULL_ELEMENTS: ElementData[] = [
  { number: 1, symbol: "H", name: "Hydrogène", category: "nonmetal", color: "#3d82ed", row: 1, col: 1 },
  { number: 2, symbol: "He", name: "Hélium", category: "noble-gas", color: "#7435e0", row: 1, col: 18 },
  { number: 3, symbol: "Li", name: "Lithium", category: "alkali-metal", color: "#e83e35", row: 2, col: 1 },
  { number: 4, symbol: "Be", name: "Béryllium", category: "alkaline-earth", color: "#e67e22", row: 2, col: 2 },
  { number: 5, symbol: "B", name: "Bore", category: "metalloid", color: "#27ae60", row: 2, col: 13 },
  { number: 6, symbol: "C", name: "Carbone", category: "nonmetal", color: "#3d82ed", row: 2, col: 14 },
  { number: 7, symbol: "N", name: "Azote", category: "nonmetal", color: "#3d82ed", row: 2, col: 15 },
  { number: 8, symbol: "O", name: "Oxygène", category: "nonmetal", color: "#3d82ed", row: 2, col: 16 },
  { number: 9, symbol: "F", name: "Fluor", category: "halogen", color: "#f1c40f", row: 2, col: 17 },
  { number: 10, symbol: "Ne", name: "Néon", category: "noble-gas", color: "#7435e0", row: 2, col: 18 },
  { number: 11, symbol: "Na", name: "Sodium", category: "alkali-metal", color: "#e83e35", row: 3, col: 1 },
  { number: 12, symbol: "Mg", name: "Magnésium", category: "alkaline-earth", color: "#e67e22", row: 3, col: 2 },
  { number: 13, symbol: "Al", name: "Aluminium", category: "post-transition", color: "#95a5a6", row: 3, col: 13 },
  { number: 14, symbol: "Si", name: "Silicium", category: "metalloid", color: "#27ae60", row: 3, col: 14 },
  { number: 15, symbol: "P", name: "Phosphore", category: "nonmetal", color: "#3d82ed", row: 3, col: 15 },
  { number: 16, symbol: "S", name: "Soufre", category: "nonmetal", color: "#3d82ed", row: 3, col: 16 },
  { number: 17, symbol: "Cl", name: "Chlore", category: "halogen", color: "#f1c40f", row: 3, col: 17 },
  { number: 18, symbol: "Ar", name: "Argon", category: "noble-gas", color: "#7435e0", row: 3, col: 18 },
  { number: 19, symbol: "K", name: "Potassium", category: "alkali-metal", color: "#e83e35", row: 4, col: 1 },
  { number: 20, symbol: "Ca", name: "Calcium", category: "alkaline-earth", color: "#e67e22", row: 4, col: 2 },
  { number: 21, symbol: "Sc", name: "Scandium", category: "transition-metal", color: "#f39c12", row: 4, col: 3 },
  { number: 22, symbol: "Ti", name: "Titane", category: "transition-metal", color: "#f39c12", row: 4, col: 4 },
  { number: 23, symbol: "V", name: "Vanadium", category: "transition-metal", color: "#f39c12", row: 4, col: 5 },
  { number: 24, symbol: "Cr", name: "Chrome", category: "transition-metal", color: "#f39c12", row: 4, col: 6 },
  { number: 25, symbol: "Mn", name: "Manganèse", category: "transition-metal", color: "#f39c12", row: 4, col: 7 },
  { number: 26, symbol: "Fe", name: "Fer", category: "transition-metal", color: "#f39c12", row: 4, col: 8 },
  { number: 27, symbol: "Co", name: "Cobalt", category: "transition-metal", color: "#f39c12", row: 4, col: 9 },
  { number: 28, symbol: "Ni", name: "Nickel", category: "transition-metal", color: "#f39c12", row: 4, col: 10 },
  { number: 29, symbol: "Cu", name: "Cuivre", category: "transition-metal", color: "#f39c12", row: 4, col: 11 },
  { number: 30, symbol: "Zn", name: "Zinc", category: "transition-metal", color: "#f39c12", row: 4, col: 12 },
  { number: 31, symbol: "Ga", name: "Gallium", category: "post-transition", color: "#95a5a6", row: 4, col: 13 },
  { number: 32, symbol: "Ge", name: "Germanium", category: "metalloid", color: "#27ae60", row: 4, col: 14 },
  { number: 33, symbol: "As", name: "Arsenic", category: "metalloid", color: "#27ae60", row: 4, col: 15 },
  { number: 34, symbol: "Se", name: "Sélénium", category: "nonmetal", color: "#3d82ed", row: 4, col: 16 },
  { number: 35, symbol: "Br", name: "Brome", category: "halogen", color: "#f1c40f", row: 4, col: 17 },
  { number: 36, symbol: "Kr", name: "Krypton", category: "noble-gas", color: "#7435e0", row: 4, col: 18 },
  { number: 37, symbol: "Rb", name: "Rubidium", category: "alkali-metal", color: "#e83e35", row: 5, col: 1 },
  { number: 38, symbol: "Sr", name: "Strontium", category: "alkaline-earth", color: "#e67e22", row: 5, col: 2 },
  { number: 39, symbol: "Y", name: "Yttrium", category: "transition-metal", color: "#f39c12", row: 5, col: 3 },
  { number: 40, symbol: "Zr", name: "Zirconium", category: "transition-metal", color: "#f39c12", row: 5, col: 4 },
  { number: 41, symbol: "Nb", name: "Niobium", category: "transition-metal", color: "#f39c12", row: 5, col: 5 },
  { number: 42, symbol: "Mo", name: "Molybdène", category: "transition-metal", color: "#f39c12", row: 5, col: 6 },
  { number: 43, symbol: "Tc", name: "Technétium", category: "transition-metal", color: "#f39c12", row: 5, col: 7 },
  { number: 44, symbol: "Ru", name: "Ruthénium", category: "transition-metal", color: "#f39c12", row: 5, col: 8 },
  { number: 45, symbol: "Rh", name: "Rhodium", category: "transition-metal", color: "#f39c12", row: 5, col: 9 },
  { number: 46, symbol: "Pd", name: "Palladium", category: "transition-metal", color: "#f39c12", row: 5, col: 10 },
  { number: 47, symbol: "Ag", name: "Argent", category: "transition-metal", color: "#f39c12", row: 5, col: 11 },
  { number: 48, symbol: "Cd", name: "Cadmium", category: "transition-metal", color: "#f39c12", row: 5, col: 12 },
  { number: 49, symbol: "In", name: "Indium", category: "post-transition", color: "#95a5a6", row: 5, col: 13 },
  { number: 50, symbol: "Sn", name: "Étain", category: "post-transition", color: "#95a5a6", row: 5, col: 14 },
  { number: 51, symbol: "Sb", name: "Antimoine", category: "metalloid", color: "#27ae60", row: 5, col: 15 },
  { number: 52, symbol: "Te", name: "Tellure", category: "metalloid", color: "#27ae60", row: 5, col: 16 },
  { number: 53, symbol: "I", name: "Iode", category: "halogen", color: "#f1c40f", row: 5, col: 17 },
  { number: 54, symbol: "Xe", name: "Xénon", category: "noble-gas", color: "#7435e0", row: 5, col: 18 },
  { number: 55, symbol: "Cs", name: "Césium", category: "alkali-metal", color: "#e83e35", row: 6, col: 1 },
  { number: 56, symbol: "Ba", name: "Baryum", category: "alkaline-earth", color: "#e67e22", row: 6, col: 2 },
  { number: 57, symbol: "La", name: "Lanthane", category: "lanthanide", color: "#9b59b6", row: 9, col: 4 },
  { number: 58, symbol: "Ce", name: "Cérium", category: "lanthanide", color: "#9b59b6", row: 9, col: 5 },
  { number: 59, symbol: "Pr", name: "Praséodyme", category: "lanthanide", color: "#9b59b6", row: 9, col: 6 },
  { number: 60, symbol: "Nd", name: "Néodyme", category: "lanthanide", color: "#9b59b6", row: 9, col: 7 },
  { number: 61, symbol: "Pm", name: "Prométhium", category: "lanthanide", color: "#9b59b6", row: 9, col: 8 },
  { number: 62, symbol: "Sm", name: "Samarium", category: "lanthanide", color: "#9b59b6", row: 9, col: 9 },
  { number: 63, symbol: "Eu", name: "Europium", category: "lanthanide", color: "#9b59b6", row: 9, col: 10 },
  { number: 64, symbol: "Gd", name: "Gadolinium", category: "lanthanide", color: "#9b59b6", row: 9, col: 11 },
  { number: 65, symbol: "Tb", name: "Terbium", category: "lanthanide", color: "#9b59b6", row: 9, col: 12 },
  { number: 66, symbol: "Dy", name: "Dysprosium", category: "lanthanide", color: "#9b59b6", row: 9, col: 13 },
  { number: 67, symbol: "Ho", name: "Holmium", category: "lanthanide", color: "#9b59b6", row: 9, col: 14 },
  { number: 68, symbol: "Er", name: "Erbium", category: "lanthanide", color: "#9b59b6", row: 9, col: 15 },
  { number: 69, symbol: "Tm", name: "Thulium", category: "lanthanide", color: "#9b59b6", row: 9, col: 16 },
  { number: 70, symbol: "Yb", name: "Ytterbium", category: "lanthanide", color: "#9b59b6", row: 9, col: 17 },
  { number: 71, symbol: "Lu", name: "Lutécium", category: "lanthanide", color: "#9b59b6", row: 9, col: 18 },
  { number: 72, symbol: "Hf", name: "Hafnium", category: "transition-metal", color: "#f39c12", row: 6, col: 4 },
  { number: 73, symbol: "Ta", name: "Tantale", category: "transition-metal", color: "#f39c12", row: 6, col: 5 },
  { number: 74, symbol: "W", name: "Tungstène", category: "transition-metal", color: "#f39c12", row: 6, col: 6 },
  { number: 75, symbol: "Re", name: "Rhénium", category: "transition-metal", color: "#f39c12", row: 6, col: 7 },
  { number: 76, symbol: "Os", name: "Osmium", category: "transition-metal", color: "#f39c12", row: 6, col: 8 },
  { number: 77, symbol: "Ir", name: "Iridium", category: "transition-metal", color: "#f39c12", row: 6, col: 9 },
  { number: 78, symbol: "Pt", name: "Platine", category: "transition-metal", color: "#f39c12", row: 6, col: 10 },
  { number: 79, symbol: "Au", name: "Or", category: "transition-metal", color: "#f39c12", row: 6, col: 11 },
  { number: 80, symbol: "Hg", name: "Mercure", category: "transition-metal", color: "#f39c12", row: 6, col: 12 },
  { number: 81, symbol: "Tl", name: "Thallium", category: "post-transition", color: "#95a5a6", row: 6, col: 13 },
  { number: 82, symbol: "Pb", name: "Plomb", category: "post-transition", color: "#95a5a6", row: 6, col: 14 },
  { number: 83, symbol: "Bi", name: "Bismuth", category: "post-transition", color: "#95a5a6", row: 6, col: 15 },
  { number: 84, symbol: "Po", name: "Polonium", category: "post-transition", color: "#95a5a6", row: 6, col: 16 },
  { number: 85, symbol: "At", name: "Astate", category: "halogen", color: "#f1c40f", row: 6, col: 17 },
  { number: 86, symbol: "Rn", name: "Radon", category: "noble-gas", color: "#7435e0", row: 6, col: 18 },
  { number: 87, symbol: "Fr", name: "Francium", category: "alkali-metal", color: "#e83e35", row: 7, col: 1 },
  { number: 88, symbol: "Ra", name: "Radium", category: "alkaline-earth", color: "#e67e22", row: 7, col: 2 },
  { number: 89, symbol: "Ac", name: "Actinium", category: "actinide", color: "#c0392b", row: 10, col: 4 },
  { number: 90, symbol: "Th", name: "Thorium", category: "actinide", color: "#c0392b", row: 10, col: 5 },
  { number: 91, symbol: "Pa", name: "Protactinium", category: "actinide", color: "#c0392b", row: 10, col: 6 },
  { number: 92, symbol: "U", name: "Uranium", category: "actinide", color: "#c0392b", row: 10, col: 7 },
  { number: 93, symbol: "Np", name: "Neptunium", category: "actinide", color: "#c0392b", row: 10, col: 8 },
  { number: 94, symbol: "Pu", name: "Plutonium", category: "actinide", color: "#c0392b", row: 10, col: 9 },
  { number: 95, symbol: "Am", name: "Américium", category: "actinide", color: "#c0392b", row: 10, col: 10 },
  { number: 96, symbol: "Cm", name: "Curium", category: "actinide", color: "#c0392b", row: 10, col: 11 },
  { number: 97, symbol: "Bk", name: "Berkélium", category: "actinide", color: "#c0392b", row: 10, col: 12 },
  { number: 98, symbol: "Cf", name: "Californium", category: "actinide", color: "#c0392b", row: 10, col: 13 },
  { number: 99, symbol: "Es", name: "Einsteinium", category: "actinide", color: "#c0392b", row: 10, col: 14 },
  { number: 100, symbol: "Fm", name: "Fermium", category: "actinide", color: "#c0392b", row: 10, col: 15 },
  { number: 101, symbol: "Md", name: "Mendélévium", category: "actinide", color: "#c0392b", row: 10, col: 16 },
  { number: 102, symbol: "No", name: "Nobélium", category: "actinide", color: "#c0392b", row: 10, col: 17 },
  { number: 103, symbol: "Lr", name: "Lawrencium", category: "actinide", color: "#c0392b", row: 10, col: 18 },
  { number: 104, symbol: "Rf", name: "Rutherfordium", category: "transition-metal", color: "#f39c12", row: 7, col: 4 },
  { number: 105, symbol: "Db", name: "Dubnium", category: "transition-metal", color: "#f39c12", row: 7, col: 5 },
  { number: 106, symbol: "Sg", name: "Seaborgium", category: "transition-metal", color: "#f39c12", row: 7, col: 6 },
  { number: 107, symbol: "Bh", name: "Bohrium", category: "transition-metal", color: "#f39c12", row: 7, col: 7 },
  { number: 108, symbol: "Hs", name: "Hassium", category: "transition-metal", color: "#f39c12", row: 7, col: 8 },
  { number: 109, symbol: "Mt", name: "Meitnérium", category: "transition-metal", color: "#f39c12", row: 7, col: 9 },
  { number: 110, symbol: "Ds", name: "Darmstadtium", category: "transition-metal", color: "#f39c12", row: 7, col: 10 },
  { number: 111, symbol: "Rg", name: "Roentgenium", category: "transition-metal", color: "#f39c12", row: 7, col: 11 },
  { number: 112, symbol: "Cn", name: "Copernicium", category: "transition-metal", color: "#f39c12", row: 7, col: 12 },
  { number: 113, symbol: "Nh", name: "Nihonium", category: "post-transition", color: "#95a5a6", row: 7, col: 13 },
  { number: 114, symbol: "Fl", name: "Flérovium", category: "post-transition", color: "#95a5a6", row: 7, col: 14 },
  { number: 115, symbol: "Mc", name: "Moscovium", category: "post-transition", color: "#95a5a6", row: 7, col: 15 },
  { number: 116, symbol: "Lv", name: "Livermorium", category: "post-transition", color: "#95a5a6", row: 7, col: 16 },
  { number: 117, symbol: "Ts", name: "Tennesse", category: "halogen", color: "#f1c40f", row: 7, col: 17 },
  { number: 118, symbol: "Og", name: "Oganesson", category: "noble-gas", color: "#7435e0", row: 7, col: 18 }
];

// --- COMPONENTS ---

const RevisionView: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Exploration Périodique</h2>
        <p className="text-slate-400 text-sm">Cliquez sur un élément pour les détails</p>
      </div>

      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div 
          className="grid gap-1 min-w-[1000px] p-2 mx-auto"
          style={{ 
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
          }}
        >
          {FULL_ELEMENTS.map((el) => (
            <button
              key={el.number}
              onClick={() => setSelectedElement(el)}
              style={{ 
                gridRow: el.row, 
                gridColumn: el.col,
                backgroundColor: `${el.color}22`,
                borderColor: el.color
              }}
              className={`
                aspect-square flex flex-col items-center justify-center border rounded-md transition-all
                hover:scale-125 hover:z-30 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-white/10
                ${selectedElement?.number === el.number ? 'scale-125 z-40 shadow-[0_0_20px_white/30] ring-1 ring-white bg-white/20' : ''}
              `}
            >
              <span className="text-[8px] mono opacity-80 leading-none mb-0.5">{el.number}</span>
              <span className="text-sm font-bold leading-none" style={{ color: el.color }}>{el.symbol}</span>
            </button>
          ))}
          
          <div style={{ gridRow: 8, gridColumn: 1 }} className="h-4"></div>
        </div>
      </div>

      {/* Barre d'info rétablie en bas */}
      <div className="sticky bottom-4 w-full max-w-lg glass rounded-2xl p-6 flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-2xl">
        {selectedElement ? (
          <div className="flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-300 w-full">
            <div 
              className="w-16 h-16 shrink-0 rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg border-2 bg-white/5"
              style={{ borderColor: selectedElement.color, color: selectedElement.color }}
            >
              {selectedElement.symbol}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-0.5 truncate">{selectedElement.category.replace('-', ' ')}</p>
              <h3 className="text-xl font-bold text-white truncate leading-tight">{selectedElement.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Numéro Atomique: <span className="text-white font-bold mono ml-1">{selectedElement.number}</span></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-500 italic py-2">
            <p className="text-sm">Sélectionnez un élément ci-dessus</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setIsCorrect(option === currentQuestion?.correctAnswer);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/30 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-900/30 blur-[150px]" />
      </div>

      <div className="w-full max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 mb-6 drop-shadow-sm tracking-tighter">
            Periodic Master
          </h1>
          
          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-slate-900/60 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'quiz' ? 'bg-blue-600 text-white shadow-lg scale-[1.05]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Quiz Infini
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'revision' ? 'bg-blue-600 text-white shadow-lg scale-[1.05]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Révision
            </button>
          </div>
        </header>

        <main className="w-full">
          {activeTab === 'quiz' ? (
            <div className="max-w-2xl mx-auto glass p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              {currentQuestion ? (
                <>
                  <div className="mb-10 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-[10px] font-bold text-blue-400 uppercase tracking-[0.25em] mb-6 border border-slate-700 shadow-sm">
                      Question Active
                    </span>
                    
                    <div className="min-h-[160px] flex flex-col items-center justify-center">
                      {currentQuestion.type === QuestionType.NUMBER_TO_NAME && (
                        <div>
                          <p className="text-slate-400 mb-3 text-lg">Quel est le nom de l'élément numéro</p>
                          <p className="text-8xl font-black mono text-white drop-shadow-2xl tracking-tighter">{currentQuestion.targetElement.number}</p>
                        </div>
                      )}
                      {currentQuestion.type === QuestionType.NAME_TO_NUMBER && (
                        <div>
                          <p className="text-slate-400 mb-3 text-lg">Quel est le numéro atomique de</p>
                          <p className="text-5xl sm:text-7xl font-bold text-white italic drop-shadow-2xl">{currentQuestion.targetElement.name}</p>
                        </div>
                      )}
                      {currentQuestion.type === QuestionType.SYMBOL_TO_BOTH && (
                        <div className="flex flex-col items-center">
                          <p className="text-slate-400 mb-6 text-lg">Nom et numéro pour le symbole</p>
                          <div 
                            className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl border-2 bg-white/5"
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
                          p-6 rounded-2xl text-left transition-all duration-300 border shadow-sm text-lg font-medium
                          ${selectedOption === null ? 'hover:bg-slate-700/50 border-white/5 bg-slate-800/40 hover:scale-[1.03] active:scale-95' : 'cursor-default'}
                          ${selectedOption !== null && option === currentQuestion.correctAnswer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}
                          ${selectedOption === option && option !== currentQuestion.correctAnswer ? 'bg-rose-500/20 border-rose-500 text-rose-300' : ''}
                          ${selectedOption !== null && option !== currentQuestion.correctAnswer && option !== selectedOption ? 'opacity-20 scale-95' : ''}
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 min-h-[60px] flex flex-col items-center justify-center">
                    {selectedOption !== null && (
                      <div className="text-center w-full animate-in fade-in zoom-in-95 duration-500">
                        <button
                          onClick={generateQuestion}
                          className="px-14 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-lg transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-900/40 active:scale-95 uppercase tracking-widest"
                        >
                          Continuer
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <RevisionView />
          )}
        </main>
      </div>
      <footer className="mt-auto py-8 text-slate-500 text-[9px] uppercase tracking-[0.4em] opacity-40 font-bold">
        Pure Knowledge • Periodic Mastery • Infinite Learning
      </footer>
    </div>
  );
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = (ReactDOM as any).createRoot(rootElement);
  root.render(<App />);
}
