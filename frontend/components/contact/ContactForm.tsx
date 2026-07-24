'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './ContactForm.css';

interface FormState {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  porte: string;
  area: string;
  interesse: string;
  mensagem: string;
}

// Mesmos slugs das 4 landing pages de pilar (frontend/app/<slug>/page.tsx) — usados
// como valor de ?assunto= no link de cada landing para /contato, e como value do
// <select> aqui. Ver docs/analise-funil-ctas-servicos.md, achado 5.
export const INTERESSE_OPTIONS = [
  { value: 'engenharia-de-software', label: 'Engenharia de Software' },
  { value: 'cloud-devops', label: 'Cloud & DevOps' },
  { value: 'integracao-automacao', label: 'Integração & Automação' },
  { value: 'inteligencia-artificial', label: 'Inteligência Artificial' },
  { value: 'outro', label: 'Ainda não sei / outro assunto' },
] as const;

const INTERESSE_VALUES: readonly string[] = INTERESSE_OPTIONS.map((o) => o.value);

const EMPTY_FORM: FormState = {
  nome: '',
  empresa: '',
  cargo: '',
  email: '',
  telefone: '',
  porte: '',
  area: '',
  interesse: '',
  mensagem: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELD_LABELS: Record<'nome' | 'empresa' | 'email' | 'mensagem', string> = {
  nome: 'Nome',
  empresa: 'Empresa',
  email: 'E-mail válido',
  mensagem: 'Como podemos ajudar',
};

// TODO: integração real fica para uma sessão futura — hoje não existe endpoint de contato.
// Substituir este envio simulado por um POST para uma Lambda nova, mantendo esta validação
// client-side como primeira barreira.
function submitContact(_form: FormState): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 250));
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const assuntoParam = searchParams.get('assunto') || '';
  const interesseInicial = INTERESSE_VALUES.includes(assuntoParam) ? assuntoParam : '';

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, interesse: interesseInicial });
  const [camposInvalidos, setCamposInvalidos] = useState<Set<keyof typeof REQUIRED_FIELD_LABELS>>(new Set());
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const erro = camposInvalidos.size > 0;

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setCamposInvalidos((prev) => {
      if (!prev.has(key as keyof typeof REQUIRED_FIELD_LABELS)) return prev;
      const next = new Set(prev);
      next.delete(key as keyof typeof REQUIRED_FIELD_LABELS);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailOk = EMAIL_RE.test(form.email.trim());
    const invalidos = new Set<keyof typeof REQUIRED_FIELD_LABELS>();
    if (!form.nome.trim()) invalidos.add('nome');
    if (!form.empresa.trim()) invalidos.add('empresa');
    if (!emailOk) invalidos.add('email');
    if (!form.mensagem.trim()) invalidos.add('mensagem');
    if (invalidos.size > 0) {
      setCamposInvalidos(invalidos);
      return;
    }
    setEnviando(true);
    await submitContact(form);
    setEnviando(false);
    setEnviado(true);
    setCamposInvalidos(new Set());
  };

  const novoEnvio = () => {
    setEnviado(false);
    setForm(EMPTY_FORM);
    setCamposInvalidos(new Set());
  };

  if (enviado) {
    return (
      <div className="contact-form-card contact-success">
        <div className="contact-success-icon" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3>Solicitação recebida.</h3>
        <p>Obrigado pelo contato. Analisaremos as informações e retornaremos em até um dia útil.</p>
        <button type="button" className="btn btn-petrol" onClick={novoEnvio}>
          Enviar nova solicitação
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-grid">
        <label className="contact-field">
          <span>Nome <span className="contact-required">*</span></span>
          <input
            value={form.nome}
            onChange={set('nome')}
            placeholder="Seu nome"
            required
            aria-invalid={camposInvalidos.has('nome')}
            aria-describedby={camposInvalidos.has('nome') ? 'contact-form-error' : undefined}
          />
        </label>
        <label className="contact-field">
          <span>Empresa <span className="contact-required">*</span></span>
          <input
            value={form.empresa}
            onChange={set('empresa')}
            placeholder="Nome da empresa"
            required
            aria-invalid={camposInvalidos.has('empresa')}
            aria-describedby={camposInvalidos.has('empresa') ? 'contact-form-error' : undefined}
          />
        </label>
        <label className="contact-field">
          <span>Cargo <span className="contact-optional">opcional</span></span>
          <input value={form.cargo} onChange={set('cargo')} placeholder="Seu cargo" />
        </label>
        <label className="contact-field">
          <span>E-mail <span className="contact-required">*</span></span>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="voce@empresa.com"
            required
            aria-invalid={camposInvalidos.has('email')}
            aria-describedby={camposInvalidos.has('email') ? 'contact-form-error' : undefined}
          />
        </label>
        <label className="contact-field">
          <span>Telefone <span className="contact-optional">opcional</span></span>
          <input value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" />
        </label>
        <label className="contact-field">
          <span>Nº de colaboradores <span className="contact-optional">opcional</span></span>
          <select value={form.porte} onChange={set('porte')}>
            <option value="">Selecione</option>
            <option value="1-10">1 a 10</option>
            <option value="11-50">11 a 50</option>
            <option value="51-200">51 a 200</option>
            <option value="200+">Mais de 200</option>
          </select>
        </label>
        <label className="contact-field">
          <span>Área de interesse <span className="contact-optional">opcional</span></span>
          <select value={form.interesse} onChange={set('interesse')}>
            <option value="">Selecione</option>
            {INTERESSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="contact-field contact-field-wide">
        <span>Área de atuação <span className="contact-optional">opcional</span></span>
        <input value={form.area} onChange={set('area')} placeholder="Ex.: varejo, saúde, indústria, serviços…" />
      </label>

      <label className="contact-field contact-field-wide">
        <span>Como podemos ajudar? <span className="contact-required">*</span></span>
        <textarea
          rows={5}
          value={form.mensagem}
          onChange={set('mensagem')}
          placeholder="Conte um pouco sobre sua empresa, seus desafios ou o objetivo do projeto."
          required
          aria-invalid={camposInvalidos.has('mensagem')}
          aria-describedby={camposInvalidos.has('mensagem') ? 'contact-form-error' : undefined}
        />
      </label>

      {erro && (
        <div id="contact-form-error" className="contact-error" role="alert" aria-live="assertive">
          Preencha corretamente: {Array.from(camposInvalidos).map((campo) => REQUIRED_FIELD_LABELS[campo]).join(', ')}.
        </div>
      )}

      <p className="contact-privacy-note">
        Utilizaremos seus dados para analisar sua solicitação e entrar em contato. Saiba mais em nosso{' '}
        <a href="/politica-de-privacidade">Aviso de Privacidade</a>.
      </p>

      <div className="contact-form-footer">
        <span className="contact-required-note">* campos obrigatórios</span>
        <button type="submit" className="btn" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Solicitar diagnóstico'}
        </button>
      </div>
    </form>
  );
}
