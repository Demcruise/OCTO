"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOCUS_OPTIONS, ROLE_OPTIONS } from "@/lib/landing-content";
import { Eyebrow, Reveal, Section, focusRing } from "./primitives";

type Field = "email" | "firstName" | "firm" | "role";
type Values = Record<Field | "focus" | "message", string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED: Field[] = ["email", "firstName", "firm", "role"];

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.email.trim()) e.email = "Enter your work email.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address like name@firm.com.";
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.firm.trim()) e.firm = "Enter the name of your firm.";
  if (!v.role) e.role = "Select the role closest to yours.";
  return e;
}

const inputCls =
  "mt-1.5 block w-full border bg-canvas px-3 text-[15px] text-ink placeholder:text-ink-3 focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelCls = "text-sm font-medium text-ink";

/** Focused request-access form (PAL-047). Frontend-only: confirms locally until a lead endpoint exists. */
export function Contact() {
  const [values, setValues] = useState<Values>({ email: "", firstName: "", firm: "", role: "", focus: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement | null>>>({});

  const set = (field: keyof Values, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const first = REQUIRED.find((f) => found[f]);
    if (first) return refs.current[first]?.focus();
    // TODO(landing-contact): no lead-capture endpoint exists yet; PAL-047 allows a local success state until one does.
    setSent(true);
  };

  const fieldProps = (f: Field) => ({
    id: `contact-${f}`,
    name: f,
    required: true,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `contact-${f}-error` : undefined,
    className: cn(inputCls, "h-11", errors[f] ? "border-danger" : "border-line-strong"),
    ref: (el: HTMLInputElement | HTMLSelectElement | null) => {
      refs.current[f] = el;
    },
  });

  const error = (f: Field) =>
    errors[f] && (
      <p id={`contact-${f}-error`} className="mt-1.5 text-[13px] text-danger">
        {errors[f]}
      </p>
    );
  const req = <span aria-hidden className="text-accent"> *</span>;

  return (
    <Section id="contact" tone="subtle" labelledBy="contact-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow index="21">Request access</Eyebrow>
          <h2 id="contact-title" className="mt-6 text-h2 font-medium">
            See OCTO on your own portfolio questions.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Tell us who you are and what you invest in. We&apos;ll walk you through OCTO on sample data and scope a pilot inside your environment.
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.06}>
          <div className="border border-line-strong bg-canvas p-5 md:p-8">
            {sent ? (
              <div role="status" className="flex min-h-[420px] flex-col items-start justify-center">
                <CheckCircle2 aria-hidden className="size-6 text-ok" />
                <p className="mt-4 text-2xl font-medium tracking-tight">Request received.</p>
                <p className="mt-2 text-[15px] text-ink-2">We&apos;ll follow up with the next steps.</p>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="space-y-5">
                <p className="text-[13px] text-ink-3">
                  Fields marked <span aria-hidden>*</span>
                  <span className="sr-only">with an asterisk</span> are required.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className={labelCls}>
                      Work email{req}
                    </label>
                    <input {...fieldProps("email")} type="email" autoComplete="email" placeholder="name@firm.com" value={values.email} onChange={(e) => set("email", e.target.value)} />
                    {error("email")}
                  </div>
                  <div>
                    <label htmlFor="contact-firstName" className={labelCls}>
                      First name{req}
                    </label>
                    <input {...fieldProps("firstName")} type="text" autoComplete="given-name" value={values.firstName} onChange={(e) => set("firstName", e.target.value)} />
                    {error("firstName")}
                  </div>
                  <div>
                    <label htmlFor="contact-firm" className={labelCls}>
                      Firm{req}
                    </label>
                    <input {...fieldProps("firm")} type="text" autoComplete="organization" value={values.firm} onChange={(e) => set("firm", e.target.value)} />
                    {error("firm")}
                  </div>
                  <div>
                    <label htmlFor="contact-role" className={labelCls}>
                      Role{req}
                    </label>
                    <select {...fieldProps("role")} value={values.role} onChange={(e) => set("role", e.target.value)}>
                      <option value="" disabled>
                        Select a role
                      </option>
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    {error("role")}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-focus" className={labelCls}>
                    Investment focus <span className="font-normal text-ink-3">(optional)</span>
                  </label>
                  <select id="contact-focus" name="focus" value={values.focus} onChange={(e) => set("focus", e.target.value)} className={cn(inputCls, "h-11 border-line-strong")}>
                    <option value="">Select a strategy</option>
                    {FOCUS_OPTIONS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelCls}>
                    What should we look at together? <span className="font-normal text-ink-3">(optional)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    maxLength={600}
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    className={cn(inputCls, "resize-y border-line-strong py-2.5")}
                  />
                </div>
                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-[13px] leading-relaxed text-ink-3">Business contact details only. We use them only to respond to your request.</p>
                  <button type="submit" className={cn("inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover", focusRing)}>
                    Request access
                    <ArrowRight aria-hidden className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
