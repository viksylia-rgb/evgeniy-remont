import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react';
import { contacts, formServices, images } from '../data/site';
import { Reveal, SectionHeading, TelegramIcon, VkIcon, WhatsAppIcon } from './ui';

/**
 * Форма расчёта без сервера: собирает текст заявки и открывает WhatsApp
 * с готовым сообщением Евгению. Сайт ничего не хранит и не отправляет сам.
 */
function QuoteForm({ requestedService }: { requestedService: string }) {
  const [service, setService] = useState(formServices[0]);
  const [area, setArea] = useState('');
  const [place, setPlace] = useState('');
  const [comment, setComment] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (requestedService) setService(requestedService);
  }, [requestedService]);

  const message = () =>
    [
      'Здравствуйте, Евгений! Хочу получить расчёт стоимости.',
      `Вид работ: ${service}`,
      area && `Площадь: ${area} м²`,
      place && `Где объект: ${place}`,
      comment && `Комментарий: ${comment}`,
    ]
      .filter(Boolean)
      .join('\n');

  const sendWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    window.open(`${contacts.whatsappHref}?text=${encodeURIComponent(message())}`, '_blank', 'noopener,noreferrer');
  };

  // Telegram не умеет подставлять текст в личный чат, поэтому копируем текст и открываем чат
  const sendTelegram = async () => {
    try {
      await navigator.clipboard.writeText(message());
      setNote('Текст заявки скопирован. Вставьте его в чат Telegram.');
    } catch {
      setNote('Откроется чат Telegram — опишите задачу в сообщении.');
    }
    window.open(contacts.telegramHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <form id="raschet" onSubmit={sendWhatsApp} className="scroll-mt-28 border border-slate bg-graphite p-7 md:p-10" aria-labelledby="form-title">
      <h3 id="form-title" className="font-display text-[32px] leading-tight text-paper">Получить расчёт</h3>
      <p className="mt-2 text-[14.5px] text-mist">Заполните поля — сообщение откроется в WhatsApp или Telegram, останется только отправить.</p>

      <div className="mt-8 grid gap-7">
        <label className="grid gap-1">
          <span className="label">Вид работ</span>
          <select id="f-service" value={service} onChange={(e) => setService(e.target.value)} className="field cursor-pointer [&>option]:bg-graphite">
            {formServices.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="label">Площадь, м²</span>
            <input id="f-area" inputMode="numeric" value={area} onChange={(e) => setArea(e.target.value.replace(/[^\d.,]/g, ''))} placeholder="Например, 250" className="field" />
          </label>
          <label className="grid gap-1">
            <span className="label">Район или населённый пункт</span>
            <input id="f-place" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Новосибирск, Бердск…" className="field" />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="label">Комментарий</span>
          <textarea id="f-comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Состояние поверхностей, сроки, высота потолков" className="field resize-none" />
        </label>
      </div>

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        <button type="submit" className="btn-gold">
          <WhatsAppIcon className="h-[18px] w-[18px]" /> В WhatsApp
        </button>
        <button type="button" onClick={sendTelegram} className="btn-line">
          <TelegramIcon className="h-[18px] w-[18px]" /> В Telegram
        </button>
      </div>
      <p className="mt-4 min-h-[1.5em] text-[13px] text-gold-light" role="status">{note}</p>
      <p className="text-[12.5px] leading-relaxed text-mist/80">
        Сайт не сохраняет и не отправляет введённые сведения. После нажатия кнопки откроется выбранный вами мессенджер с готовым текстом — отправляете его вы сами. Не указывайте в комментарии лишние личные данные.
      </p>
    </form>
  );
}

function ContactRow({ href, icon, label, value, external }: { href: string; icon: ReactNode; label: string; value: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex items-center gap-5 border-b border-slate py-5 transition-colors hover:border-gold"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate text-gold transition-colors group-hover:border-gold">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="label block text-mist">{label}</span>
          <span className="mt-1 block break-words text-[17px] font-medium text-paper transition-colors group-hover:text-gold-light">{value}</span>
        </span>
        <ArrowUpRight className="shrink-0 text-mist transition-transform duration-500 ease-arch group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" size={18} strokeWidth={1.4} aria-hidden="true" />
      </a>
    </li>
  );
}

export default function Contacts({ requestedService }: { requestedService: string }) {
  return (
    <section id="kontakty" aria-labelledby="kontakty-title" className="py-24 md:py-36">
      <div className="container-site">
        <SectionHeading
          id="kontakty-title"
          label="Контакты"
          title={<>Обсудим <span className="italic text-gold-light">ваш проект</span></>}
          text="Профессиональная покраска и ремонт в Новосибирске и Новосибирской области."
        />

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <a href={contacts.phoneHref} className="group block">
              <span className="label text-mist">Телефон</span>
              <span className="mt-3 block font-display text-[clamp(2.6rem,6.5vw,4.6rem)] leading-none text-paper transition-colors group-hover:text-gold-light">
                {contacts.phoneDisplay}
              </span>
            </a>
            <a href={contacts.phoneHref} className="btn-gold mt-8">
              <Phone size={16} aria-hidden="true" /> Позвонить
            </a>

            <ul className="mt-12 border-t border-slate">
              <ContactRow href={contacts.whatsappHref} external icon={<WhatsAppIcon className="h-5 w-5" />} label="WhatsApp" value={contacts.phoneIntl} />
              <ContactRow href={contacts.telegramHref} external icon={<TelegramIcon className="h-5 w-5" />} label="Telegram — личная связь" value={contacts.phoneIntl} />
              <ContactRow href={contacts.telegramGroupHref} external icon={<TelegramIcon className="h-5 w-5" />} label="Telegram — группа о ремонте" value={contacts.telegramGroupName} />
              <ContactRow href={contacts.vkHref} external icon={<VkIcon className="h-5 w-5" />} label="ВКонтакте" value="vk.ru/id812225893" />
            </ul>

            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              <div className="flex gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <dt className="label text-mist">График работы</dt>
                  <dd className="mt-2 text-[15px] text-paper">{contacts.workHours.days}<br />{contacts.workHours.time}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <dt className="label text-mist">Время для связи</dt>
                  <dd className="mt-2 text-[15px] text-paper">{contacts.contactHours.days}<br />{contacts.contactHours.time}</dd>
                </div>
              </div>
              <div className="flex gap-4 sm:col-span-2">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <dt className="label text-mist">География</dt>
                  <dd className="mt-2 text-[15px] text-paper">{contacts.geography}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-12 grid max-w-[420px] grid-cols-2 gap-6">
              {[
                { src: images.qrTelegram, href: contacts.telegramGroupHref, label: 'Telegram-группа', alt: 'QR-код Telegram-группы PROREMONTCOM' },
                { src: images.qrVk, href: contacts.vkHref, label: 'ВКонтакте', alt: 'QR-код страницы ВКонтакте' },
              ].map((q) => (
                <a key={q.label} href={q.href} target="_blank" rel="noopener noreferrer" className="group block">
                  <img src={q.src} alt={q.alt} width={180} height={180} loading="lazy" className="aspect-square w-full bg-paper p-3 transition-transform duration-500 ease-arch group-hover:scale-[1.03]" />
                  <span className="mt-3 block text-[12px] uppercase tracking-[0.14em] text-mist group-hover:text-gold-light">{q.label}</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6">
            <QuoteForm requestedService={requestedService} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
