import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useConversationStore } from "../store/conversations.store";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useChat } from "../hook/useChat";
import { useMessagesStore } from "../store/messages.store";
import { File, Link, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { askQuestion, isGenerating, chatError } = useChat();

  const {
    createMessage,
    getMessages,
    messages,
    isMessageLoading,
    messageError,
    addMessage,
  } = useMessagesStore();

  const navigate = useNavigate();

  const {
    getConversation,
    createConversation,
    isConversationLoading,
    conversationError,
    setErrorNull,
    conversations,
  } = useConversationStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth < 900;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isGenerating]);

  useEffect(() => {
    getConversation();
  }, [getConversation]);

  useEffect(() => {
    if (!id) return;

    getMessages(id);
  }, [id, getMessages]);

  const handleCreateConversation = async () => {
    try {
      const conversation = await createConversation("New Conversation");

      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;

    setQuery(e.target.value);

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSendMessage = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || isGenerating || isMessageLoading) {
      return;
    }

    try {
      let conversationId = id;

      if (!conversationId) {
        const conversation = await createConversation(trimmedQuery);

        conversationId = conversation._id;

        navigate(`/chat/${conversationId}`);
      }

      if (messages.length === 0) {
        await createConversation(trimmedQuery, conversationId ?? id);
      }

      await createMessage(
        trimmedQuery,
        "human",
        conversationId ?? (id as string),
        file ?? undefined,
      );

      setFile(null);

      const aiResponse = await askQuestion({
        query: trimmedQuery,
        conversationId: conversationId ?? (id as string),
      });

      addMessage(aiResponse.message);

      setQuery("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {isMobile && (
        <div className="shrink-0">
          <Navbar
            conversations={conversations}
            handleCreateConversation={handleCreateConversation}
            isConversationLoading={isConversationLoading}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            handleLogout={handleLogout}
          />
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {!isMobile && (
          <Sidebar
            isOpen={isCollapsed}
            onClose={() => setIsCollapsed((prev) => !prev)}
            isMobile={isMobile}
            conversationError={conversationError}
            conversations={conversations}
            isConversationLoading={isConversationLoading}
            setErrorNull={setErrorNull}
            handleCreateConversation={handleCreateConversation}
            handleLogout={handleLogout}
          />
        )}

        {/* Main chat */}
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden bg-slate-950">
          <div className="mx-auto flex h-full min-h-0 min-w-0 w-full max-[95%] lg:max-w-10/12 flex-col">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {/* Messages */}
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-4 py-5 sm:px-6">
                {isMessageLoading && messages.length === 0 && (
                  <div className="flex justify-center py-10 text-sm text-slate-300">
                    Loading messages...
                  </div>
                )}

                {!isMessageLoading &&
                  messages.length === 0 &&
                  !isGenerating && (
                    <div className="flex min-h-full items-center justify-center py-20">
                      <div className="text-center">
                        <div className="text-gray-300">
                          Hey{" "}
                          <span className="text-white font-bold capitalize">
                            {user?.name}
                          </span>
                        </div>

                        <h1 className="text-xl font-semibold sm:text-2xl">
                          How can I help you?
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                          Ask a question, paste a URL, or chat with your
                          documents.
                        </p>
                      </div>
                    </div>
                  )}

                <div className="space-y-6">
                  {messages.map((message) => {
                    {
                      /* Human message */
                    }
                    if (message.role === "human") {
                      return (
                        <div
                          key={message._id}
                          className="flex min-w-0 justify-end"
                        >
                          <div className="max-w-[85%] min-w-0 sm:max-w-[75%]">
                            {/* Attachment */}
                            {message.attachments?.map((attachment) => {
                              if (typeof attachment.documentId === "string") {
                                return null;
                              }

                              return (
                                <div
                                  key={attachment._id}
                                  className="mb-2 flex min-w-0 max-w-full items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300"
                                >
                                  <File size={14} className="shrink-0" />

                                  <span className="min-w-0 truncate">
                                    {attachment.documentId.name}
                                  </span>
                                </div>
                              );
                            })}

                            {/* Human message */}
                            <div className="max-w-full break-all rounded-2xl rounded-br-md bg-slate-800 px-4 py-3 text-sm leading-6 text-slate-100 sm:text-[15px]">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    {
                      /* AI message */
                    }
                    if (message.role === "ai") {
                      return (
                        <div
                          key={message._id}
                          className="flex min-w-0 max-w-full justify-start"
                        >
                          <div className="  min-w-0 max-w-full overflow-hidden text-sm leading-7 text-slate-200 sm:text-[15px]">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="mb-4 mt-6 text-2xl font-semibold text-white">
                                    {children}
                                  </h1>
                                ),

                                h2: ({ children }) => (
                                  <h2 className="mb-3 mt-5 text-xl font-semibold text-white">
                                    {children}
                                  </h2>
                                ),

                                h3: ({ children }) => (
                                  <h3 className="mb-2 mt-4 text-lg font-semibold text-white">
                                    {children}
                                  </h3>
                                ),

                                p: ({ children }) => (
                                  <p className="mb-4 break-words last:mb-0">
                                    {children}
                                  </p>
                                ),

                                ul: ({ children }) => (
                                  <ul className="mb-4 list-disc space-y-1 pl-6">
                                    {children}
                                  </ul>
                                ),

                                ol: ({ children }) => (
                                  <ol className="mb-4 list-decimal space-y-1 pl-6">
                                    {children}
                                  </ol>
                                ),

                                li: ({ children }) => (
                                  <li className="break-words">{children}</li>
                                ),

                                strong: ({ children }) => (
                                  <strong className="font-semibold text-white">
                                    {children}
                                  </strong>
                                ),

                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="break-all text-blue-400 underline underline-offset-2 hover:text-blue-300"
                                  >
                                    {children}
                                  </a>
                                ),

                                blockquote: ({ children }) => (
                                  <blockquote className="my-4 border-l-4 border-slate-700 pl-4 text-slate-400">
                                    {children}
                                  </blockquote>
                                ),

                                table: ({ children }) => (
                                  <div className="my-4 w-full max-w-full overflow-x-auto">
                                    <table className="w-full min-w-[500px] border-collapse text-sm">
                                      {children}
                                    </table>
                                  </div>
                                ),

                                th: ({ children }) => (
                                  <th className="border border-slate-700 bg-slate-800 px-3 py-2 text-left font-medium">
                                    {children}
                                  </th>
                                ),

                                td: ({ children }) => (
                                  <td className="border border-slate-700 px-3 py-2 align-top">
                                    {children}
                                  </td>
                                ),

                                code: ({ className, children, ...props }) => {
                                  const isInline = !className;

                                  if (isInline) {
                                    return (
                                      <code
                                        className="break-words rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm"
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  }

                                  return (
                                    <pre className="my-4 max-w-full overflow-x-auto rounded-lg bg-slate-900 p-4">
                                      <code className="font-mono text-sm">
                                        {children}
                                      </code>
                                    </pre>
                                  );
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* AI thinking indicator */}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="text-sm leading-7 text-slate-500 sm:text-[15px]">
                        <span className="animate-pulse">Thinking...</span>
                      </div>
                    </div>
                  )}

                  {/* Auto-scroll target */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input area */}
              <div className="shrink-0 px-4 pb-4 pt-2 sm:px-6">
                <div className="relative w-full">
                  <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={handleChange}
                    placeholder="Type a message..."
                    rows={1}
                    disabled={isGenerating}
                    className="min-h-[44px] max-h-[160px] w-full resize-none overflow-y-auto rounded-lg bg-gray-800 p-3 pl-7 pr-12 text-white focus:outline-none"
                  />

                  <button
                    onClick={() => {
                      handleSendMessage();
                    }}
                    disabled={isGenerating}
                    className="absolute right-2.5 top-6 text-white disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>

                  <button
                    className={`absolute ${
                      file
                        ? "-top-6 left-1.5 rounded-xl bg-gray-600 px-2 py-1 text-[8px]"
                        : "left-2.5 top-6"
                    } flex items-center justify-center gap-1 text-white disabled:opacity-50`}
                  >
                    {!file ? (
                      <Link
                        onClick={() => {
                          fileRef.current?.click();
                        }}
                        size={14}
                      />
                    ) : (
                      <>
                        <File size={13} />
                        <span className="max-w-[120px] truncate">
                          {file.name}
                        </span>
                        <X onClick={() => setFile(null)} size={13} />
                      </>
                    )}
                  </button>
                  <input
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];

                      if (selectedFile) {
                        if (selectedFile.type !== "application/pdf") {
                          return toast.success("Only pdf is allowed");
                        }
                        setFile(selectedFile);
                      }
                    }}
                    ref={fileRef}
                    type="file"
                    className="hidden"
                  />
                </div>

                {chatError && (
                  <p className="mt-2 text-sm text-red-400">{chatError}</p>
                )}

                {messageError && (
                  <p className="mt-2 text-sm text-red-400">{messageError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
