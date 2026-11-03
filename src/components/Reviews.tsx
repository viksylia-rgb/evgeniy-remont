import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Image as ImageIcon, Star, X } from 'lucide-react';
import { reviews, type Review } from '../data/site';
import { Reveal, SectionHeading } from './ui';

function Screenshot({ review, onClose }: { review: Review | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (review && !d.open) d.showModal();
    if (!review && d.open) d.close();
  }, [review]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(92vw,640px)] bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      aria-label={review ? `Скриншот отзыва: ${review.name}` : undefined}
    >
      {review && (
        <div className="relative bg-paper">
          <img src={review.screenshot} alt={`Скриншот отзыва ${review.name} от ${review.date}`} className="h-auto w-full" />
          <button type="button" onClick={onClose} className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center border border-paper/30 text-paper hover:border-gold hover:text-gold" aria-label="Закрыть">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </dialog>
  );
}

export default function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<Review | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const t = track.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 8 });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, []);

  const scroll = (dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const card = t.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 24 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const arrowCls = 'flex h-14 w-14 items-center justify-center border border-slate text-paper transition-colors duration-300 hover:border-gold hover:text-gold disabled:cursor-default disabled:opacity-30 disabled:hover:border-slate disabled:hover:text-paper';

  return (
    <section id="otzyvy" aria-labelledby="otzyvy-title" className="overflow-hidden py-24 md:py-36">
      <div className="container-site">
        <SectionHeading id="otzyvy-title" label="Отзывы" title={<>Нам <span className="italic text-gold-light">доверяют</span></>} text="Отзывы о покраске и ремонтных работах." />

        <div className="mt-12 flex justify-end gap-3 md:mt-16">
          <button type="button" className={arrowCls} onClick={() => scroll(-1)} disabled={edges.start} aria-label="Предыдущие отзывы">
            <ArrowLeft size={20} strokeWidth={1.4} />
          </button>
          <button type="button" className={arrowCls} onClick={() => scroll(1)} disabled={edges.end} aria-label="Следующие отзывы">
            <ArrowRight size={20} strokeWidth={1.4} />
          </button>
        </div>

        <Reveal className="mt-8">
          <ul
            ref={track}
            onScroll={updateEdges}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-2 md:-mx-10 md:px-10"
            aria-label="Отзывы клиентов"
            tabIndex={0}
          >
            {reviews.map((r) => (
              <li key={r.name + r.date} className="w-[86%] shrink-0 snap-start sm:w-[420px]">
                <article className="flex h-full flex-col border border-slate bg-graphite p-7 md:p-9">
                  <div className="flex items-center gap-1 text-gold" aria-label="Оценка 5 из 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                    ))}
                    <span className="ml-3 text-[12px] text-mist">Сделка состоялась</span>
                  </div>
                  <p className="mt-6 font-display text-[22px] italic leading-[1.35] text-paper md:text-[24px]">«{r.text}»</p>
                  <div className="mt-auto pt-8">
                    <span className="block h-px w-full bg-slate" aria-hidden="true" />
                    <div className="flex items-end justify-between gap-4 pt-5">
                      <div>
                        <p className="text-[15px] font-semibold text-paper">{r.name}</p>
                        <p className="mt-1 text-[12.5px] leading-snug text-mist">
                          {r.date} · {r.service}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpen(r)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate text-mist transition-colors hover:border-gold hover:text-gold"
                        aria-label={`Открыть скриншот отзыва: ${r.name}`}
                        title="Смотреть скриншот"
                      >
                        <ImageIcon size={18} strokeWidth={1.4} />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Screenshot review={open} onClose={() => setOpen(null)} />
    </section>
  );
}
