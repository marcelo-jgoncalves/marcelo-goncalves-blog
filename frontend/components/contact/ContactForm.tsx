'use client';

import { useState } from 'react';
import './ContactForm.css';

interface FormState {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  porte: string;
  area: string;
  mensagem: string;
}

const EMPTY_FORM: FormState = {
  nome: '',
  empresa: '',
  cargo: '',
  email: '',
  telefone: '',
  porte: '',
  area: '',
  mensagem: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: integração real fica para uma sessão futura — hoje não existe endpoint de contato.
// Substituir este envio simulado por um POST para uma Lambda nova, mantendo esta validação
// client-side como primeira barreira.
function submitContact(_form: FormState): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 250));
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [erro, setErro] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErro(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailOk = EMAIL_RE.test(form.email.trim());
    if (!form.nome.trim() || !form.empresa.trim() || !emailOk || !form.mensagem.trim()) {
      setErro(true);
      return;
    }
    setEnviando(true);
    await submitContact(form);
    setEnviando(false);
    setEnviado(true);
    setErro(false);
  };

  const novoEnvio = () => {
    setEnviado(false);
    setForm(EMPTY_FORM);
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
          <input value={form.nome} onChange={set('nome')} placeholder="Seu nome" required />
        </label>
        <label className="contact-field">
          <span>Empresa <span className="contact-required">*</span></span>
          <input value={form.empresa} onChange={set('empresa')} placeholder="Nome da empresa" required />
        </label>
        <label className="contact-field">
          <span>Cargo <span className="contact-optional">opcional</span></span>
          <input value={form.cargo} onChange={set('cargo')} placeholder="Seu cargo" />
        </label>
        <label className="contact-field">
          <span>E-mail <span className="contact-required">*</span></span>
          <input type="email" value={form.email} onChange={set('email')} placeholder="voce@empresa.com" required />
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
        />
      </label>

      {erro && (
        <div className="contact-error">
          Preencha nome, empresa, um e-mail válido e a mensagem para continuar.
        </div>
      )}

      <div className="contact-form-footer">
        <span className="contact-required-note">* campos obrigatórios</span>
        <button type="submit" className="btn" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Solicitar diagnóstico'} <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
