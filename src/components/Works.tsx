import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { works, type Work } from '../data/site';
import { Reveal, SectionHeading } from './ui';

/** Интерактивное сравнение «До / После»: тяните ползунок мышью, пальцем или стрелками клавиатуры */
function BeforeAfter({ work }: { work: Work }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const down = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromX(e.clientX);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => dragging.current && setFromX(e.clientX);
  const up = () => (dragging.current = false);

  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      className="relative w-full cursor-ew-resize select-none overflow-hidden bg-graphite"
      style={{ aspectRatio: `${work.width} / ${work.height}`, touchAction: 'pan-y' }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <img src={work.after} alt={work.altAfter} width={work.width} height={work.height} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={work.before} alt={work.altBefore} width={work.width} height={work.height} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 bg-ink/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-label text-paper backdrop-blur">До</span>
      <span className="pointer-events-none absolute right-4 top-4 bg-gold px-3 py-1.5 text-[11px] font-semibold uppercase tracking-label text-ink">После</span>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-gold-light" style={{ left: `${pos}%` }} aria-hidden="true" />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Сравнение до и после: ${work.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% снимка «до»`}
        onKeyDown={key}
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-gold-light bg-ink/80 text-gold-light backdrop-blur"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal size={20} strokeWidth={1.4} aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section id="raboty" aria-labelledby="raboty-title" className="bg-graphite py-24 md:py-36">
      <div className="container-site">
        <SectionHeading
          id="raboty-title"
          label="Наши работы"
          title={<>Результат, <span className="italic text-gold-light">который видно</span></>}
          text="Передвиньте ползунок, чтобы сравнить состояние объекта до и после работ."
        />

        <ul className="mt-16 grid items-start gap-x-8 gap-y-14 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
          {works.map((w, i) => (
            <Reveal as="li" key={w.title} delay={i * 0.1} className={i === 1 ? 'lg:mt-24' : ''}>
              <figure>
                <BeforeAfter work={w} />
                <figcaption className="mt-6 flex items-start gap-4">
                  <span className="pt-1 text-[11px] font-semibold tracking-label text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[24px] leading-tight text-paper">{w.title}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
