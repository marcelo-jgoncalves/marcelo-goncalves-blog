'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './ContactForm.module.css';

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  companySize: string;
  area: string;
  message: string;
  website: string; // honeypot — never sent in the email
}

// Options and values for the "area" field — also used as a query string
// (?area=...) coming from the specific CTAs on the 4 pillar landings.
export const AREA_OPTIONS = [
  { value: 'automacao-integracao', label: 'Automação e Integração de Processos' },
  { value: 'inteligencia-artificial', label: 'Inteligência Artificial Aplicada' },
  { value: 'sistemas-plataformas', label: 'Sistemas e Plataformas Digitais' },
  { value: 'cloud-devops-confiabilidade', label: 'Cloud, DevOps e Confiabilidade' },
  { value: 'multiplas-areas', label: 'Mais de uma área' },
  { value: 'nao-sei', label: 'Ainda não sei' },
  { value: 'outro', label: 'Outro assunto' },
] as const;

const AREA_VALUES: readonly string[] = AREA_OPTIONS.map((o) => o.value);

const COMPANY_SIZE_OPTIONS = [
  { value: '1-10', label: '1 a 10 pessoas' },
  { value: '11-50', label: '11 a 50 pessoas' },
  { value: '51-200', label: '51 a 200 pessoas' },
  { value: '201-500', label: '201 a 500 pessoas' },
  { value: '501-plus', label: 'Mais de 500 pessoas' },
] as const;

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  company: '',
  role: '',
  phone: '',
  companySize: '',
  area: '',
  message: '',
  website: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 50;
const MESSAGE_MAX = 3000;
const MESSAGE_COUNTER_THRESHOLD = 2500;

type RequiredField = 'name' | 'email' | 'company' | 'area' | 'message';

const FIELD_ERROR_LABELS: Record<RequiredField, string> = {
  name: 'Seu nome',
  email: 'Seu e-mail',
  company: 'Empresa ou projeto',
  area: 'Qual área está mais relacionada ao desafio?',
  message: 'Conte o que está acontecendo hoje',
};

function validate(form: FormState): Partial<Record<RequiredField, string>> {
  const errors: Partial<Record<RequiredField, string>> = {};
  if (!form.name.trim()) errors.name = 'Informe seu nome.';
  if (!form.email.trim()) errors.email = 'Informe seu e-mail.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (!form.company.trim()) errors.company = 'Informe a empresa ou o projeto.';
  if (!form.area) errors.area = 'Selecione a área mais próxima do desafio.';
  if (!form.message.trim() || form.message.trim().length < MESSAGE_MIN) {
    errors.message = `Descreva o desafio com pelo menos ${MESSAGE_MIN} caracteres.`;
  } else if (form.message.length > MESSAGE_MAX) {
    errors.message = `A mensagem deve ter no máximo ${MESSAGE_MAX} caracteres.`;
  }
  return errors;
}

// TODO: replace with a real POST once the contact Lambda (SES + honeypot +
// rate limit) exists — today this is just the local mock.
// Target contract: ContactRequest with { name, email, company, role?,
// phone?, companySize?, area, message, website?, context } → 200 { success,
// referenceId } | 400/429/500.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept as the target contract's param shape until the real POST replaces this mock
function submitContact(_form: FormState): Promise<{ referenceId: string }> {
  return new Promise((resolve) => setTimeout(() => resolve({ referenceId: 'local-mock' }), 250));
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const areaParam = searchParams.get('area') || '';
  const areaInicial = AREA_VALUES.includes(areaParam) ? areaParam : '';

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, area: areaInicial });
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const errorKeys = Object.keys(errors) as RequiredField[];
  const hasErrors = errorKeys.length > 0;

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    // Progressive validation: only corrects the summary after the 1st submit attempt.
    if (hasErrors && key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as RequiredField];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: if filled, fakes success without sending anything.
    if (form.website) {
      setEnviado(true);
      setReferenceId('');
      return;
    }

    const found = validate(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setEnviando(true);
    const result = await submitContact(form);
    setEnviando(false);
    setEnviado(true);
    setReferenceId(result.referenceId);
    setErrors({});
  };

  const novoEnvio = () => {
    setEnviado(false);
    setForm({ ...EMPTY_FORM, area: areaInicial });
    setErrors({});
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  if (enviado) {
    return (
      <div className={`contact-form-card ${styles.contactFormCard} ${styles.contactSuccess}`} role="status">
        <div className={styles.contactSuccessIcon} aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3>Mensagem recebida.</h3>
        <p>Obrigado pelo contato. Vamos analisar as informações e retornar em até um dia útil.</p>
        {referenceId && <p className={styles.contactReference}>Referência: {referenceId}</p>}
        <div className={styles.contactSuccessActions}>
          <Link className="btn" href="/">Voltar à página inicial</Link>
          <button type="button" className={styles.contactSuccessAgain} onClick={novoEnvio}>
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={`contact-form-card ${styles.contactFormCard}`} onSubmit={handleSubmit} noValidate>
      <p className={styles.contactRequiredHint}>Campos marcados com <span className={styles.contactRequired}>*</span> são obrigatórios.</p>

      {hasErrors && (
        <div ref={summaryRef} className={styles.contactErrorSummary} role="alert" tabIndex={-1}>
          <p className={styles.contactErrorSummaryTitle}>Revise os campos indicados.</p>
          <ul>
            {errorKeys.map((key) => (
              <li key={key}><a href={`#field-${key}`}>{FIELD_ERROR_LABELS[key]}</a></li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot — invisible, out of tab order, never sent in the email. */}
      <label className={styles.contactHoneypot} aria-hidden="true">
        Não preencha este campo
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={set('website')}
        />
      </label>

      <div className={styles.contactFormGrid}>
        <label className={styles.contactField} htmlFor="field-name">
          <span>Seu nome <span className={styles.contactRequired}>*</span></span>
          <input
            id="field-name"
            ref={firstFieldRef}
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
            placeholder="Como podemos chamar você?"
            maxLength={100}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'error-name' : undefined}
          />
          {errors.name && <span id="error-name" className={styles.contactFieldError}>{errors.name}</span>}
        </label>

        <label className={styles.contactField} htmlFor="field-email">
          <span>Seu e-mail <span className={styles.contactRequired}>*</span></span>
          <input
            id="field-email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            placeholder="voce@empresa.com.br"
            maxLength={254}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email && <span id="error-email" className={styles.contactFieldError}>{errors.email}</span>}
        </label>

        <label className={styles.contactField} htmlFor="field-company">
          <span>Empresa ou projeto <span className={styles.contactRequired}>*</span></span>
          <input
            id="field-company"
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={set('company')}
            placeholder="Nome da empresa ou iniciativa"
            maxLength={120}
            required
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? 'error-company' : undefined}
          />
          {errors.company && <span id="error-company" className={styles.contactFieldError}>{errors.company}</span>}
        </label>

        <label className={styles.contactField} htmlFor="field-role">
          <span>Sua função <span className={styles.contactOptional}>opcional</span></span>
          <input
            id="field-role"
            name="role"
            autoComplete="organization-title"
            value={form.role}
            onChange={set('role')}
            placeholder="Ex.: Sócio, Operações, Tecnologia"
            maxLength={120}
          />
        </label>

        <label className={styles.contactField} htmlFor="field-phone">
          <span>Telefone ou WhatsApp <span className={styles.contactOptional}>opcional</span></span>
          <input
            id="field-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="(31) 99999-9999"
            maxLength={30}
          />
        </label>

        <label className={styles.contactField} htmlFor="field-companySize">
          <span>Tamanho da empresa <span className={styles.contactOptional}>opcional</span></span>
          <select id="field-companySize" name="companySize" value={form.companySize} onChange={set('companySize')}>
            <option value="">Selecione, se quiser</option>
            {COMPANY_SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className={`${styles.contactField} ${styles.contactFieldWide}`} htmlFor="field-area">
        <span>Qual área está mais relacionada ao desafio? <span className={styles.contactRequired}>*</span></span>
        <select
          id="field-area"
          name="area"
          value={form.area}
          onChange={set('area')}
          required
          aria-invalid={!!errors.area}
          aria-describedby={errors.area ? 'error-area' : undefined}
        >
          <option value="">Selecione uma opção</option>
          {AREA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.area && <span id="error-area" className={styles.contactFieldError}>{errors.area}</span>}
      </label>

      <label className={`${styles.contactField} ${styles.contactFieldWide}`} htmlFor="field-message">
        <span>Conte o que está acontecendo hoje <span className={styles.contactRequired}>*</span></span>
        <textarea
          id="field-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={set('message')}
          placeholder="Descreva o processo, sistema ou dificuldade, quem é afetado e o resultado que você gostaria de alcançar."
          maxLength={MESSAGE_MAX}
          required
          aria-invalid={!!errors.message}
          aria-describedby={[errors.message ? 'error-message' : null, 'message-helper', form.message.length >= MESSAGE_COUNTER_THRESHOLD ? 'message-counter' : null].filter(Boolean).join(' ') || undefined}
        />
        <span id="message-helper" className={styles.contactHelper}>Não inclua senhas, chaves de acesso, dados bancários, informações médicas ou documentos confidenciais.</span>
        {form.message.length >= MESSAGE_COUNTER_THRESHOLD && (
          <span id="message-counter" className={styles.contactCounter}>{form.message.length}/{MESSAGE_MAX}</span>
        )}
        {errors.message && <span id="error-message" className={styles.contactFieldError}>{errors.message}</span>}
      </label>

      <p className={styles.contactPrivacyNote}>
        Ao enviar, você declara ciência de que os dados informados serão usados para responder à solicitação e conduzir os próximos passos, conforme o{' '}
        <a href="/politica-de-privacidade">Aviso de Privacidade</a>.
      </p>

      <div className={styles.contactFormFooter}>
        <button type="submit" className="btn" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar mensagem'}
        </button>
      </div>
    </form>
  );
}
