'use client';

import { Bug, Lightbulb, Loader2, MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FeedbackType = 'Bug Report' | 'Feature Request';

type DevelopmentNoticeProps = {
  userEmail?: string | null;
};

export function DevelopmentNotice({ userEmail }: DevelopmentNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('Feature Request');
  const [message, setMessage] = useState('');
  const [userEmailInput, setUserEmailInput] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) {
        wasOpen.current = false;
        triggerRef.current?.focus();
      }
      return;
    }

    wasOpen.current = true;
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          message,
          userEmail: userEmailInput || undefined,
          pageUrl: window.location.href,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setMessage('');
        setUserEmailInput('');
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="shrink-0 border-b border-white/10 bg-[#141a15] px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bug className="size-3.5 text-emerald-300" aria-hidden="true" />
              <span className="text-xs font-medium text-zinc-200">
                In active development
              </span>
            </div>
            <span className="hidden text-xs text-zinc-500 sm:inline">
              Feedback helps shape what comes next.
            </span>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            ref={triggerRef}
            className="inline-flex min-h-8 shrink-0 items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-zinc-100"
          >
            <MessageSquare className="size-3.5" aria-hidden="true" />
            <span>Share feedback</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
            ref={dialogRef}
            className="relative w-full max-w-md rounded-lg border border-white/10 bg-[#171d18] shadow-2xl overscroll-contain max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsOpen(false)}
              ref={closeRef}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Close feedback dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h2 id="feedback-dialog-title" className="text-xl font-semibold text-zinc-100 mb-2">
                Send Feedback
              </h2>
              <p className="text-sm text-zinc-400 mb-6">
                Found a bug or have a suggestion? Let us know!
              </p>

              {submitStatus === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                  <p className="text-emerald-400 font-medium">Thank you! Your feedback has been sent.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setType('Bug Report')}
                        aria-pressed={type === 'Bug Report'}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          type === 'Bug Report'
                            ? 'bg-rose-500/10 border border-rose-400/40 text-rose-200'
                              : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <Bug className="mr-2 inline size-4" aria-hidden="true" />
                        Bug report
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('Feature Request')}
                        aria-pressed={type === 'Feature Request'}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          type === 'Feature Request'
                            ? 'bg-emerald-400/10 border border-emerald-300/40 text-emerald-200'
                              : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <Lightbulb className="mr-2 inline size-4" aria-hidden="true" />
                        Feature request
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
                      placeholder="Describe the bug or your feedback…"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                      Your Email (optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={userEmailInput}
                      onChange={(e) => setUserEmailInput(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                      placeholder="your@email.com"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      So we can follow up with you if needed
                    </p>
                  </div>

                  {submitStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400">
                        Failed to send feedback. Please try again.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !message}
                    className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      'Send Feedback'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
