
"use client";

import { useState } from "react";
import Link from "next/link";

type PossibleResponse = {
  scenario: string;
  suggestedNextMove: string;
};

type Playbook = {
  situationSummary: string;
  objective: string;
  recommendedApproach: string;
  reasoning: string;
  recommendedMessage: string;
  alternativeMessage: string;
  possibleResponses: PossibleResponse[];
  sendReadiness: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  messageUpdates?: {
    recommendedMessage?: string;
    alternativeMessage?: string;
  };
};

export default function NewConversationPage() {
  const [thought, setThought] = useState("");
  const [recipient, setRecipient] = useState("Manager");
  const [format, setFormat] = useState("Slack message");
  const [tone, setTone] = useState("Professional");

  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [editedMessage, setEditedMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  async function createPlaybook() {
    if (!thought.trim() || loading) return;

    setLoading(true);
    setError("");
    setPlaybook(null);
    setChatHistory([]);
    setEditedMessage("");

    try {
      const response = await fetch("/api/sayless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          thought,
          recipient,
          format,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create your playbook.");
      }

      setPlaybook(data);
      setEditedMessage(data.recommendedMessage || data.message || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendChatMessage() {
    const message = chatInput.trim();

    if (!message || !playbook || chatLoading) return;

    const updatedHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", content: message },
    ];

    setChatHistory(updatedHistory);
    setChatInput("");
    setChatLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sayless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "refine",
          userMessage: message,
          playbook: {
            ...playbook,
            recommendedMessage: editedMessage,
          },
          chatHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to continue coaching.");
      }

      const updatedPlaybook: Playbook = data.playbook;

      const recommendedChanged =
        updatedPlaybook.recommendedMessage !== editedMessage;

      const alternativeChanged =
        updatedPlaybook.alternativeMessage !== playbook.alternativeMessage;

      setPlaybook(updatedPlaybook);
      setEditedMessage(updatedPlaybook.recommendedMessage);

      setChatHistory([
        ...updatedHistory,
        {
          role: "assistant",
          content: data.reply,
          messageUpdates:
            recommendedChanged || alternativeChanged
              ? {
                  ...(recommendedChanged && {
                    recommendedMessage: updatedPlaybook.recommendedMessage,
                  }),
                  ...(alternativeChanged && {
                    alternativeMessage: updatedPlaybook.alternativeMessage,
                  }),
                }
              : undefined,
        },
      ]);
    } catch (err) {
      setChatHistory(chatHistory);
      setChatInput(message);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your message. Please try again."
      );
    } finally {
      setChatLoading(false);
    }
  }

  async function copyMessage(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopiedText(message);

      setTimeout(() => {
        setCopied(false);
        setCopiedText("");
      }, 2000);
    } catch {
      setError(
        "Unable to copy automatically. Please select and copy the message."
      );
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-12">
      <Link
        href="/sayless"
        className="text-sm text-[#8d75bb] hover:text-[#6e559f]"
      >
        ← Back to overview
      </Link>

      <section className="mt-8">
        <p className="text-xs font-medium tracking-[0.18em] text-[#8d75bb]">
          SAYLESS / NEW CONVERSATION
        </p>

        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
          Let's think this through.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77736d]">
          Start with the situation, not the perfect words. Your coach will help
          you decide how to approach the conversation and what to say next.
        </p>
      </section>

      <section className="mt-9 rounded-3xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2eef8] text-sm font-medium text-[#8d75bb]">
            01
          </span>
          <h2 className="text-lg font-medium">Tell us what's happening</h2>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#77736d]">
          Explain the situation in your own words. What happened? What feels
          difficult? What would you like to achieve?
        </p>

        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          maxLength={5000}
          placeholder="For example: I need to tell my manager that my task is delayed because I'm waiting for required inputs. I've followed up twice, but I don't want to sound like I'm making excuses..."
          className="mt-5 min-h-44 w-full resize-y rounded-2xl border border-[#e9e5dd] bg-[#faf9f6] p-5 text-sm leading-7 outline-none transition focus:border-[#9b83c9]"
        />

        <p className="mt-2 text-right text-xs text-[#aaa49a]">
          {thought.length}/5000
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Who is involved?</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e9e5dd] bg-white p-3 text-sm outline-none focus:border-[#9b83c9]"
            >
              <option>Manager</option>
              <option>Teammate</option>
              <option>Client</option>
              <option>HR</option>
              <option>Recruiter</option>
              <option>Friend</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Conversation format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e9e5dd] bg-white p-3 text-sm outline-none focus:border-[#9b83c9]"
            >
              <option>Slack message</option>
              <option>Email</option>
              <option>Meeting update</option>
              <option>In-person conversation</option>
              <option>Phone call</option>
              <option>Documentation</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Preferred tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e9e5dd] bg-white p-3 text-sm outline-none focus:border-[#9b83c9]"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Assertive</option>
              <option>Concise</option>
              <option>Empathetic</option>
              <option>Diplomatic</option>
            </select>
          </div>
        </div>

        <button
          onClick={createPlaybook}
          disabled={!thought.trim() || loading}
          className="mt-8 w-full rounded-full bg-[#292720] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#514b40] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? "Thinking through your situation..."
            : "Build my conversation playbook ↗"}
        </button>

        {loading && (
          <p className="mt-4 text-center text-sm text-[#8d75bb]">
            Understanding the situation and exploring the best approach...
          </p>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      {playbook && (
        <section className="mt-10 space-y-5">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-[#8d75bb]">
              YOUR PERSONAL COACHING PLAN
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight">
              Your Conversation Playbook
            </h2>
            <p className="mt-2 text-sm text-[#77736d]">
              Your coach stays with you while you refine your approach.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e5dd] bg-white p-6">
            <p className="text-xs font-medium tracking-wider text-[#8d75bb]">
              01 / SITUATION
            </p>
            <h3 className="mt-3 font-medium">What's really happening</h3>
            <p className="mt-2 text-sm leading-7 text-[#77736d]">
              {playbook.situationSummary}
            </p>

            <div className="mt-5 border-t border-[#e9e5dd] pt-5">
              <h3 className="text-sm font-medium">Your objective</h3>
              <p className="mt-2 text-sm leading-7 text-[#77736d]">
                {playbook.objective}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9e5dd] bg-white p-6">
            <p className="text-xs font-medium tracking-wider text-[#8d75bb]">
              02 / STRATEGY
            </p>
            <h3 className="mt-3 text-lg font-medium">
              {playbook.recommendedApproach}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#77736d]">
              {playbook.reasoning}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e5dd] bg-white p-6">
            <p className="text-xs font-medium tracking-wider text-[#8d75bb]">
              03 / MESSAGE STUDIO
            </p>

            <h3 className="mt-3 text-lg font-medium">
              Recommended message
            </h3>

            <p className="mt-2 text-sm text-[#99948b]">
              Edit the message yourself or ask your coach to refine it below.
            </p>

            <textarea
              value={editedMessage}
              onChange={(e) => {
                setEditedMessage(e.target.value);
                setCopied(false);
                setCopiedText("");
              }}
              rows={Math.max(
                6,
                Math.min(14, editedMessage.split("\n").length + 2)
              )}
              className="mt-5 w-full resize-y rounded-xl border border-[#e9e5dd] bg-[#faf9f6] p-4 text-sm leading-7 outline-none focus:border-[#9b83c9]"
            />

            <button
              onClick={() => copyMessage(editedMessage)}
              className="mt-4 rounded-full bg-[#292720] px-5 py-3 text-sm font-medium text-white hover:bg-[#514b40]"
            >
              {copied && copiedText === editedMessage
                ? "Copied ✓"
                : "Copy recommended message"}
            </button>

            <div className="mt-7 border-t border-[#e9e5dd] pt-6">
              <h3 className="font-medium">Alternative message</h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#77736d]">
                {playbook.alternativeMessage}
              </p>

              <button
                onClick={() => copyMessage(playbook.alternativeMessage)}
                className="mt-3 text-sm font-medium text-[#8d75bb] hover:text-[#6e559f]"
              >
                {copied && copiedText === playbook.alternativeMessage
                  ? "Copied ✓"
                  : "Copy alternative ↗"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9e5dd] bg-white p-6">
            <p className="text-xs font-medium tracking-wider text-[#8d75bb]">
              04 / WHAT MIGHT HAPPEN NEXT
            </p>
            <h3 className="mt-3 text-lg font-medium">Possible responses</h3>

            <p className="mt-2 text-sm text-[#99948b]">
              These are possibilities to help you prepare, not predictions.
            </p>

            <div className="mt-5 space-y-4">
              {playbook.possibleResponses?.map((item, index) => (
                <div key={index} className="rounded-xl bg-[#faf9f6] p-5">
                  <p className="text-xs font-medium text-[#8d75bb]">
                    SCENARIO 0{index + 1}
                  </p>
                  <h4 className="mt-2 text-sm font-medium">
                    {item.scenario}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-[#77736d]">
                    <span className="font-medium text-[#24231f]">
                      Your next move:{" "}
                    </span>
                    {item.suggestedNextMove}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d9cbea] bg-[#f2eef8] p-6">
            <p className="text-xs font-medium tracking-wider text-[#8d75bb]">
              05 / BEFORE YOU SEND
            </p>
            <h3 className="mt-3 text-lg font-medium">
              Send-readiness review
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#514b60]">
              {playbook.sendReadiness}
            </p>
          </div>

          {/* Conversational coach */}
          <section className="overflow-hidden rounded-3xl border border-[#d9cbea] bg-white shadow-sm">
            <div className="border-b border-[#e9e5dd] bg-[#faf9f6] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2eef8] text-xl text-[#8d75bb]">
                  ✳
                </div>
                <div>
                  <h3 className="font-medium">Continue with your coach</h3>
                  <p className="mt-1 text-xs text-[#8d75bb]">
                    Your SayLess coaching session
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#77736d]">
                Add context, ask a question, or tell me what you'd like to
                change. I'll keep your playbook in mind.
              </p>
            </div>

            <div className="max-h-[600px] space-y-4 overflow-y-auto p-5 sm:p-6">
              {chatHistory.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d9cbea] bg-[#faf9f6] p-5">
                  <p className="text-sm font-medium">
                    What would you like to work on?
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Make the message more natural",
                      "What if my manager disagrees?",
                      "I want to add more context",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setChatInput(suggestion)}
                        className="rounded-full border border-[#e9e5dd] bg-white px-3 py-2 text-xs text-[#77736d] transition hover:border-[#9b83c9] hover:text-[#8d75bb]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[92%] space-y-3">
                    <div
                      className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${
                        message.role === "user"
                          ? "bg-[#8d75bb] text-white"
                          : "border border-[#e9e5dd] bg-[#faf9f6] text-[#24231f]"
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.role === "assistant" &&
                      message.messageUpdates && (
                        <div className="space-y-3">
                          {message.messageUpdates.recommendedMessage && (
                            <div className="rounded-2xl border border-[#d9cbea] bg-white p-4">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-semibold tracking-wide text-[#8d75bb]">
                                  UPDATED RECOMMENDED MESSAGE
                                </p>
                                <span className="rounded-full bg-[#f2eef8] px-2 py-1 text-[10px] text-[#8d75bb]">
                                  Updated
                                </span>
                              </div>

                              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#24231f]">
                                {message.messageUpdates.recommendedMessage}
                              </p>

                              <button
                                onClick={() =>
                                  copyMessage(
                                    message.messageUpdates!
                                      .recommendedMessage!
                                  )
                                }
                                className="mt-4 rounded-full bg-[#292720] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#514b40]"
                              >
                                {copied &&
                                copiedText ===
                                  message.messageUpdates.recommendedMessage
                                  ? "Copied ✓"
                                  : "Copy recommended message"}
                              </button>
                            </div>
                          )}

                          {message.messageUpdates.alternativeMessage && (
                            <div className="rounded-2xl border border-[#e9e5dd] bg-white p-4">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-semibold tracking-wide text-[#8d75bb]">
                                  UPDATED ALTERNATIVE MESSAGE
                                </p>
                                <span className="rounded-full bg-[#f2eef8] px-2 py-1 text-[10px] text-[#8d75bb]">
                                  Updated
                                </span>
                              </div>

                              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#24231f]">
                                {message.messageUpdates.alternativeMessage}
                              </p>

                              <button
                                onClick={() =>
                                  copyMessage(
                                    message.messageUpdates!
                                      .alternativeMessage!
                                  )
                                }
                                className="mt-4 rounded-full border border-[#d9cbea] px-4 py-2.5 text-xs font-medium text-[#8d75bb] transition hover:bg-[#f2eef8]"
                              >
                                {copied &&
                                copiedText ===
                                  message.messageUpdates.alternativeMessage
                                  ? "Copied ✓"
                                  : "Copy alternative message"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-[#e9e5dd] bg-[#faf9f6] px-4 py-3 text-sm text-[#8d75bb]">
                    Thinking it through...
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#e9e5dd] p-4 sm:p-5">
              <div className="flex items-end gap-3 rounded-2xl border border-[#e9e5dd] bg-[#faf9f6] p-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  rows={2}
                  maxLength={3000}
                  placeholder="Tell your coach what you'd like to change..."
                  className="min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-[#aaa49a]"
                />

                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || chatLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8d75bb] text-white transition hover:bg-[#765da8] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  ↗
                </button>
              </div>

              <p className="mt-2 px-2 text-xs text-[#aaa49a]">
                Enter to send · Shift + Enter for a new line
              </p>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}
