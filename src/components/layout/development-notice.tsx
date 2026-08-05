'use client';

import { Bug, Loader2, MessageSquare, X } from "lucide-react";
import { useState } from "react";

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

      const data = await response.json();

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
      <div className="shrink-0 bg-gradient-to-r from-amber-950/50 to-orange-950/50 border-b border-amber-500/30 px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">
                Still in Development
              </span>
            </div>
            <span className="text-xs text-amber-300/70 hidden sm:inline">
              — We're constantly improving. Your feedback helps us build a better experience.
            </span>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Report Bug / Feedback</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">
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
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          type === 'Bug Report'
                            ? 'bg-red-500/20 border-2 border-red-500/50 text-red-300'
                            : 'bg-zinc-800 border-2 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        🐛 Bug Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('Feature Request')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          type === 'Feature Request'
                            ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-300'
                            : 'bg-zinc-800 border-2 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        💡 Feature Request
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
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none"
                      placeholder="Describe the bug or your feedback..."
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
                        <span>Sending...</span>
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
