
import { ElementData } from '../types';

export const ELEMENTS: ElementData[] = [
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
  { number: 92, symbol: "U", name: "Uranium", category: "actinide", color: "#c0392b" }
  // Simplified list for the app logic; could be extended to all 118 easily.
];

// Helper to fill with some common additional ones to make it robust
const extraElements: ElementData[] = [
    { number: 21, symbol: "Sc", name: "Scandium", category: "transition-metal", color: "#f39c12" },
    { number: 22, symbol: "Ti", name: "Titane", category: "transition-metal", color: "#f39c12" },
    { number: 23, symbol: "V", name: "Vanadium", category: "transition-metal", color: "#f39c12" },
    { number: 24, symbol: "Cr", name: "Chrome", category: "transition-metal", color: "#f39c12" },
    { number: 25, symbol: "Mn", name: "Manganèse", category: "transition-metal", color: "#f39c12" },
    { number: 27, symbol: "Co", name: "Cobalt", category: "transition-metal", color: "#f39c12" },
    { number: 28, symbol: "Ni", name: "Nickel", category: "transition-metal", color: "#f39c12" },
    { number: 30, symbol: "Zn", name: "Zinc", category: "transition-metal", color: "#f39c12" }
];

export const FULL_ELEMENTS = [...ELEMENTS, ...extraElements];
