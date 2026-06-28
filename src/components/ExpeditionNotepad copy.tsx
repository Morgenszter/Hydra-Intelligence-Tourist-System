import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, FileText, Save, Trash2, Plus, CheckSquare, Square, FolderOpen } from 'lucide-react';
import { CountryKey, packingListDefaults } from '../data/pricingData';

interface ExpeditionItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

interface ExpeditionNotepadProps {
  country: CountryKey;
}

const LS_KEY_ITEMS = 'hydra_expedition_items';
const LS_KEY_NOTES = 'hydra_tactical_notes';
const CATEGORIES = ['Dokumenty', 'Elektronika', 'Odzież', 'Przepustki', 'Żywność', 'Medyczne', 'Inne'];

export default function ExpeditionNotepad({ country }: ExpeditionNotepadProps) {
  const [items, setItems] = useState<ExpeditionItem[]>([]);
  const [notes, setNotes] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Dokumenty');
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(LS_KEY_ITEMS);
      const savedNotes = localStorage.getItem(LS_KEY_NOTES);
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedNotes) setNotes(savedNotes);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Auto-save items
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY_ITEMS, JSON.stringify(items));
  }, [items, hydrated]);

  // Auto-save notes with debounce
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      localStorage.setItem(LS_KEY_NOTES, notes);
    }, 500);
    return () => clearTimeout(timer);
  }, [notes, hydrated]);

  // Inject country-specific gear when country changes
  useEffect(() => {
    if (!hydrated) return;
    const defaults = packingListDefaults[country];
    const existingTexts = new Set(items.map((i) => i.text.toLowerCase()));
    const newDefaults = defaults
      .filter((d) => !existingTexts.has(d.toLowerCase()))
      .map((d) => ({
        id: `default-${country}-${d}-${Date.now()}`,
        text: d,
        checked: false,
        category: 'Dokumenty',
      }));
    if (newDefaults.length > 0) {
      setItems((prev) => [...prev, ...newDefaults]);
    }
  }, [country, hydrated]);

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, text: newItemText.trim(), checked: false, category: newItemCategory },
    ]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    if (confirm('CZY NA PEWNO CHCESZ WYCZYŚCIĆ CAŁĄ LISTĘ WYPOSAŻENIA?')) {
      setItems([]);
    }
  };

  const itemsByCategory = useCallback(() => {
    const grouped: Record<string, ExpeditionItem[]> = {};
    CATEGORIES.forEach((c) => (grouped[c] = []));
    items.forEach((i) => {
      if (!grouped[i.category]) grouped[i.category] = [];
      grouped[i.category].push(i);
    });
    return grouped;
  }, [items]);

  const grouped = itemsByCategory();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3 pb-2 border-b border-[#005f73]">
        <FolderOpen size={14} className="text-gold-accent" />
        <span className="text-[12px] uppercase tracking-widest text-alpharius-cyan font-bold font-orbitron">
          PANEL EKSPEDYCJI I LOGU OPERACYJNEGO
        </span>
      </div>

      <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
        {/* COLUMN 1: Expedition Gear */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-2">
            <ClipboardList size={14} className="text-gold-accent" />
            <span className="text-[12px] uppercase tracking-wider text-alpharius-cyan font-bold font-orbitron">
              WYPOSAŻENIE EKSPEDYCJI
            </span>
            <div className="flex-1" />
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-2 py-1 text-[9px] uppercase text-[#e63946] border border-[#e63946]/50 rounded-sm hover:bg-[rgba(230,57,70,0.1)] font-orbitron"
            >
              <Trash2 size={9} />
              WYCZYŚĆ
            </button>
          </div>

          {/* Add new item */}
          <div className="flex items-center gap-2">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[11px] py-1.5 px-2 rounded-sm focus:outline-none font-tech"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0a1118]">
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="NOWY PRZEDMIOT..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              className="flex-1 bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[12px] py-1.5 px-2 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
            />
            <button
              onClick={addItem}
              className="px-2 py-1.5 bg-[rgba(57,255,20,0.1)] border border-[#39ff14] text-gold-accent text-[11px] uppercase font-bold rounded-sm hover:bg-[rgba(57,255,20,0.2)] font-orbitron"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Status bar */}
          <div className="text-[10px] text-gold-accent font-tech bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/30 px-2 py-1 rounded-sm flex items-center gap-1">
            <Save size={10} />
            [PAMIĘĆ DANYCH TERMINALA: ZABEZPIECZONA // DANE ZAWIESZONE W LOKALNYM LOGU]
          </div>

          {/* Items list grouped by category */}
          <div className="flex-1 overflow-y-auto scrollbar-hydra flex flex-col gap-3 min-h-0">
            {CATEGORIES.map((cat) => {
              const catItems = grouped[cat] || [];
              if (catItems.length === 0) return null;
              return (
                <div key={cat} className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-cyan font-bold font-orbitron border-b border-[#005f73]/30 pb-0.5">
                    {cat}
                  </span>
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 py-1 px-2 bg-[rgba(3,7,9,0.94)] border border-[#005f73]/30 rounded-sm"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="shrink-0 text-gold-accent hover:scale-110 transition-transform"
                      >
                        {item.checked ? <CheckSquare size={13} /> : <Square size={13} />}
                      </button>
                      <span
                        className={`text-[12px] flex-1 font-tech ${
                          item.checked ? 'line-through text-muted-cyan' : 'text-alpharius-cyan'
                        }`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="shrink-0 text-[#e63946] hover:text-white transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-cyan text-[12px] font-tech">
                BRAK PRZEDMIOTÓW NA LIŚCIE. DODAJ WŁASNE LUB ZACZEKAJ NA INIEKCJĘ DANYCH KRAJOWYCH.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: Notepad */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-gold-accent" />
            <span className="text-[12px] uppercase tracking-wider text-alpharius-cyan font-bold font-orbitron">
              LOG OPERACYJNY (NOTATNIK)
            </span>
          </div>

          <div className="text-[10px] text-gold-accent font-tech bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/30 px-2 py-1 rounded-sm flex items-center gap-1">
            <Save size={10} />
            [AUTO-ZAPIS AKTYWNY // KAŻDY ZNAK REJESTROWANY W PAMIĘCI LOKALNEJ]
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="WPROWADŹ NOTATKI MISYJNE, DANE KONTAKTOWE, LOGI ZWIADOWCZE, PLAN WYPRAWY..."
            className="flex-1 min-h-0 bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[13px] p-3 rounded-sm focus:outline-none focus:border-[#39ff14] resize-none font-tech leading-relaxed scrollbar-hydra"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
