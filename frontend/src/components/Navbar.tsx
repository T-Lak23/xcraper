import { useNavigate } from "react-router";
import type { Conversation } from "../types/conversation";
// import { Loader } from "./ui/Loader";
import { Loader, Menu, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const Navbar = ({
  setIsMobileOpen,
  isMobileOpen,
  handleCreateConversation,
  isConversationLoading,
  conversations,
  handleLogout,
}: {
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
  isMobileOpen: Boolean;
  handleCreateConversation: () => void;
  isConversationLoading: Boolean;
  conversations: Conversation[];
  handleLogout: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-950 p-3 sticky top-0 z-50">
      <div className="grid grid-cols-3 items-center w-full">
        <div className="justify-self-start">
          <button
            onClick={() => setIsMobileOpen((prev: boolean) => !prev)}
            className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>

        <h1 className="text-white text-center font-bold">Xcraper</h1>

        <div></div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 z-50 w-72 bg-gray-900 h-screen p-4 flex flex-col gap-10 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-white flex items-center justify-between">
          <h1 className="font-medium">Xcraper</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white font-medium rounded-xl px-4 py-3 w-full hover:bg-red-700/85 transition-all cursor-pointer"
          >
            Logout
          </button>

          <button
            className="bg-blue-700 text-white font-medium px-4 py-3 text-sm w-full rounded-xl hover:bg-blue-600 cursor-pointer transition-all"
            onClick={handleCreateConversation}
          >
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <p className="text-gray-500 font-medium text-sm pb-4">
            Conversations
          </p>
          {isConversationLoading ? (
            <Loader className="animate-spin text-white" />
          ) : conversations.length === 0 ? (
            <p className="text-gray-400 text-sm">No Conversations Found.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {conversations?.map((conversation) => (
                <div
                  key={conversation._id}
                  className="text-sm text-gray-200 bg-gray-800 rounded-xl w-full px-3 py-2.5 leading-tight cursor-pointer hover:bg-gray-800/80 transition-all"
                  onClick={() => {
                    navigate(`/chat/${conversation._id}`);
                    setIsMobileOpen(false);
                  }}
                >
                  {conversation.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
