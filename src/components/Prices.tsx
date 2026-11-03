import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { priceGroups, minimums } from '../data/site';
import { Reveal, SectionHeading } from './ui';

export default function Prices({ onQuote }: { onQuote: () => void }) {
  const [active, setActive] = useState(priceGroups[0].id);
  const group = priceGroups.find((g) => g.id === active)!;

  const onKey = (e: KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + priceGroups.length) % priceGroups.length;
    setActive(priceGroups[next].id);
    document.getElementById(`tab-${priceGroups[next].id}`)?.focus();
  };

  return (
    <section id="ceny" aria-labelledby="ceny-title" className="py-24 md:py-36">
      <div className="container-site">
        <SectionHeading
          id="ceny-title"
          label="Цены"
          title="Стоимость работ"
          text="Окончательная стоимость зависит от площади, состояния поверхности, сложности и объёма работ."
        />

        <div className="mt-16 md:mt-24 md:grid md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-3">
            <div role="tablist" aria-label="Категории работ" className="grid gap-2 sm:grid-cols-2 md:flex md:flex-col md:gap-0 md:border-t md:border-slate">
              {priceGroups.map((g, idx) => {
                const selected = g.id === active;
                return (
                  <button
                    key={g.id}
                    id={`tab-${g.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`panel-${g.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(g.id)}
                    onKeyDown={(e) => onKey(e, idx)}
                    className={`relative border px-3 py-3 text-center text-[12px] sm:text-[13px] md:text-left font-semibold uppercase tracking-[0.14em] transition-colors duration-300 md:border-0 md:border-b md:border-slate md:px-0 md:py-5 ${
                      selected ? 'border-gold text-gold-light md:border-slate' : 'border-slate text-mist hover:text-paper'
                    }`}
                  >
                    {selected && <motion.span layoutId="price-tab" className="absolute inset-y-0 left-0 hidden w-px bg-gold md:block" />}
                    <span className="md:pl-5">{g.title}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="mt-8 md:col-span-9 md:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.id}
                id={`panel-${group.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${group.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">{group.title}: цены</caption>
                  <thead>
                    <tr className="border-b border-slate text-[11px] uppercase tracking-label text-mist">
                      <th scope="col" className="py-4 font-semibold">Услуга</th>
                      <th scope="col" className="py-4 text-right font-semibold">Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((r) => (
                      <tr key={r.name} className="group border-b border-slate transition-colors hover:bg-graphite">
                        <th scope="row" className="py-5 pr-4 text-[16px] font-medium text-paper md:text-[17px]">
                          <span className="transition-transform duration-500 ease-arch md:inline-block md:group-hover:translate-x-2">{r.name}</span>
                        </th>
                        <td className="whitespace-nowrap py-5 text-right font-display text-[22px] text-gold-light md:text-[24px]">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            <Reveal className="mt-12 flex flex-col gap-8 border border-slate p-7 md:p-9 xl:flex-row xl:items-center xl:justify-between">
              <ul className="grid gap-2 text-[15px] text-paper/85">
                {minimums.map((m) => (
                  <li key={m} className="flex gap-3">
                    <span className="mt-[10px] h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={onQuote} className="btn-gold self-start text-center xl:shrink-0 xl:self-auto">
                Получить индивидуальный расчёт
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
