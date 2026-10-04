import {
  ArrowRight,
  FileText,
  Globe,
  MessageSquare,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-semibold tracking-tight"
          >
            Xcraper
          </button>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
          </nav>

          <button
            onClick={() => navigate("/chat")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Start chatting
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_45%)]" />

          <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-28 lg:pb-32">
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-400">
              <Sparkles size={14} />
              <span>Chat with your information</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Ask questions.
              <br />
              <span className="text-slate-400">
                Get answers grounded in real information.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Xcraper lets you chat with PDFs, websites, search the web, or
              simply have a conversation with AI. Bring the information you need
              and start asking questions.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/chat")}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200 sm:w-auto"
              >
                Start chatting
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>

              <a
                href="#features"
                className="flex w-full items-center justify-center rounded-lg border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 sm:w-auto"
              >
                Explore features
              </a>
            </div>

            <div className="mx-auto mt-16 max-w-4xl rounded-xl border border-slate-800 bg-slate-900/70 p-2 shadow-2xl shadow-black/20">
              <div className="rounded-lg border border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="ml-3 h-2 w-32 rounded-full bg-slate-800" />
                </div>

                <div className="grid min-h-70 grid-cols-1 md:grid-cols-[180px_1fr]">
                  <div className="hidden border-r border-slate-800 p-4 md:block">
                    <div className="mb-5 h-2 w-20 rounded bg-slate-800" />
                    <div className="space-y-3">
                      <div className="h-8 rounded bg-slate-900" />
                      <div className="h-8 rounded bg-slate-900" />
                      <div className="h-8 rounded bg-slate-900" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-end p-5 sm:p-8">
                    <div className="mb-6 max-w-md self-end rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm text-slate-300">
                      Summarize the main points from this document.
                    </div>

                    <div className="max-w-lg rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-4 text-left">
                      <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                        <Sparkles size={13} />
                        Xcraper
                      </div>

                      <div className="space-y-2">
                        <div className="h-2 w-full rounded bg-slate-800" />
                        <div className="h-2 w-11/12 rounded bg-slate-800" />
                        <div className="h-2 w-3/4 rounded bg-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-slate-900 bg-slate-950"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-slate-500">
                WHAT YOU CAN DO
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                One chat. Different sources.
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Use the right source for the question instead of manually moving
                information between different tools.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<FileText size={21} />}
                title="Chat with PDFs"
                description="Upload a PDF and ask questions about its contents. Xcraper retrieves the relevant sections before generating an answer."
              />

              <FeatureCard
                icon={<Globe size={21} />}
                title="Chat with URLs"
                description="Paste a webpage and turn its content into something you can actually interact with. Ask, summarize, compare, or explore."
              />

              <FeatureCard
                icon={<Search size={21} />}
                title="Web search"
                description="Need information beyond your documents? Search the web and use fresh information to answer your question."
              />

              <FeatureCard
                icon={<MessageSquare size={21} />}
                title="Normal AI chat"
                description="Don't have a document or URL? Just ask. Xcraper also works as a straightforward AI assistant for everyday questions."
              />
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-slate-900 bg-slate-900/20"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  HOW IT WORKS
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Bring the context.
                  <br />
                  Ask the question.
                </h2>

                <p className="mt-5 max-w-md leading-7 text-slate-400">
                  Xcraper handles the retrieval step so you can focus on the
                  answer. Your question determines what information is needed.
                </p>
              </div>

              <div className="space-y-3">
                <Step
                  number="01"
                  icon={<Upload size={19} />}
                  title="Add your source"
                  description="Upload a PDF, provide a URL, or choose web search when you need external information."
                />

                <Step
                  number="02"
                  icon={<Search size={19} />}
                  title="Xcraper finds the context"
                  description="Relevant information is retrieved from your selected source instead of relying only on a general model response."
                />

                <Step
                  number="03"
                  icon={<MessageSquare size={19} />}
                  title="Ask naturally"
                  description="Ask follow-up questions, request summaries, or dig deeper into the information."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-900">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    BUILT FOR EXPLORATION
                  </p>

                  <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                    Stop switching between your documents, browser, and chat.
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                    Xcraper brings retrieval and conversation into one place,
                    making it easier to understand the information you're
                    already working with.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/chat")}
                  className="group flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                >
                  Try Xcraper
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-900">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your information is waiting.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Upload a document, paste a URL, search the web, or simply start a
              conversation.
            </p>

            <button
              onClick={() => navigate("/chat")}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Start chatting
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-medium text-slate-300">Xcraper</span>

          <span>Ask questions. Explore information. Understand more.</span>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-950 p-6 transition hover:border-slate-700 hover:bg-slate-900/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-medium">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
};

interface StepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step = ({ number, icon, title, description }: StepProps) => {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex shrink-0 flex-col items-center">
        <span className="text-xs font-medium text-slate-600">{number}</span>

        <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400">
          {icon}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-slate-200">{title}</h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default HomePage;
