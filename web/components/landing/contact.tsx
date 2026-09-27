"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSOLIDATE_OPTIONS, ROLE_OPTIONS } from "@/lib/landing-content";
import { Eyebrow, Reveal, Section, focusRing } from "./primitives";

type Field = "email" | "firm" | "role";
type Values = Record<Field, string> & { interests: string[] };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.email.trim()) e.email = "Enter your work email.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address like name@firm.com.";
  if (!v.firm.trim()) e.firm = "Enter the name of your firm.";
  if (!v.role) e.role = "Select the role closest to yours.";
  return e;
}

const inputCls =
  "mt-1.5 block h-11 w-full rounded-md border bg-canvas px-3 text-[15px] text-ink placeholder:text-ink-3 focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

/** Short lead form: three required fields and one optional choice (CONTACT-001/002). */
export function Contact() {
  const [values, setValues] = useState<Values>({ email: "", firm: "", role: "", interests: [] });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement | null>>>({});

  const set = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const toggle = (opt: string) =>
    setValues((v) => ({ ...v, interests: v.interests.includes(opt) ? v.interests.filter((i) => i !== opt) : [...v.interests, opt] }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const first = (["email", "firm", "role"] as Field[]).find((f) => found[f]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    // TODO(landing-contact): no lead-capture endpoint exists yet. Wire this to the API
    // before release; until then the form validates and confirms client-side only.
    setSent(true);
  };

  const fieldProps = (f: Field) => ({
    id: `contact-${f}`,
    name: f,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `contact-${f}-error` : undefined,
    className: cn(inputCls, errors[f] ? "border-danger" : "border-line-strong"),
  });

  const error = (f: Field) =>
    errors[f] && (
      <p id={`contact-${f}-error`} className="mt-1.5 text-[13px] text-danger">
        {errors[f]}
      </p>
    );

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow index="10">Contact</Eyebrow>
          <h2 id="contact-title" className="mt-4 text-h2 font-semibold">
            Request a walkthrough.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
            Tell us where your investment data lives today. We&apos;ll show you how it maps onto one governed record, deployed inside your own
            environment.
          </p>
          <ul className="mt-8 space-y-3 text-[15px] text-ink-2">
            {["A walkthrough of the ontology and IBOR on sample data", "A review of your sources and reporting obligations", "A scoped pilot and deployment path"].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.06}>
          <div className="rounded-xl border border-line bg-subtle p-5 md:p-8">
            {sent ? (
              <div role="status" className="flex min-h-[360px] flex-col items-start justify-center">
                <CheckCircle2 aria-hidden className="size-6 text-ok" />
                <p className="mt-4 text-xl font-semibold tracking-tight">Thanks — your request is ready.</p>
                <p className="mt-2 max-w-md text-[15px] text-ink-2">
                  We&apos;ll follow up at <span className="font-medium text-ink">{values.email}</span> to arrange a walkthrough.
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="space-y-5">
                <p className="text-[13px] text-ink-3">
                  All fields marked <span aria-hidden>*</span>
                  <span className="sr-only">with an asterisk</span> are required.
                </p>
                <div>
                  <label htmlFor="contact-email" className="text-sm font-medium text-ink">
                    Work email <span aria-hidden className="text-accent">*</span>
                  </label>
                  <input
                    {...fieldProps("email")}
                    ref={(el) => {
                      refs.current.email = el;
                    }}
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@firm.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  {error("email")}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-firm" className="text-sm font-medium text-ink">
                      Firm <span aria-hidden className="text-accent">*</span>
                    </label>
                    <input
                      {...fieldProps("firm")}
                      ref={(el) => {
                        refs.current.firm = el;
                      }}
                      type="text"
                      autoComplete="organization"
                      required
                      value={values.firm}
                      onChange={(e) => set("firm", e.target.value)}
                    />
                    {error("firm")}
                  </div>
                  <div>
                    <label htmlFor="contact-role" className="text-sm font-medium text-ink">
                      Role <span aria-hidden className="text-accent">*</span>
                    </label>
                    <select
                      {...fieldProps("role")}
                      ref={(el) => {
                        refs.current.role = el;
                      }}
                      required
                      value={values.role}
                      onChange={(e) => set("role", e.target.value)}
                    >
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
                <fieldset>
                  <legend className="text-sm font-medium text-ink">What are you looking to consolidate?</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CONSOLIDATE_OPTIONS.map((opt) => {
                      const on = values.interests.includes(opt);
                      return (
                        <label
                          key={opt}
                          className={cn(
                            "cursor-pointer rounded-md border px-3 py-2 text-[13px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                            on ? "border-accent bg-accent-soft text-accent" : "border-line-strong bg-canvas text-ink-2 hover:border-ink-3",
                          )}
                        >
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(opt)} />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-[13px] leading-relaxed text-ink-3">
                    Business contact details only. We will use this information only to respond to your request.
                  </p>
                  <button
                    type="submit"
                    className={cn("inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover", focusRing)}
                  >
                    Request walkthrough
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
