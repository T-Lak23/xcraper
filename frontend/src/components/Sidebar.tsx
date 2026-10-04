import { useNavigate } from "react-router";
import { Loader, Plus, SidebarIcon } from "lucide-react";
import type { Conversation } from "../types/conversation";

const Sidebar = ({
  isOpen,
  onClose,
  handleCreateConversation,
  isConversationLoading,
  conversationError,
  setErrorNull,
  conversations,
  handleLogout,
}: {
  isOpen: Boolean;
  onClose: () => void;
  isMobile: Boolean;

  isConversationLoading: Boolean;
  conversationError?: null | string;
  setErrorNull?: () => void;
  conversations: Conversation[];
  handleCreateConversation: () => Promise<void>;
  handleLogout: () => Promise<void>;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${isOpen ? "w-16 items-center" : "w-72"} bg-gray-900 h-screen p-4 flex flex-col gap-10 transition-all`}
    >
      <div className={`text-white flex items-center justify-between`}>
        {!isOpen && (
          <h1 className={`font-medium`}>{isOpen ? "X" : "Xcraper"}</h1>
        )}
        <SidebarIcon
          className="hover:opacity-90 cursor-pointer"
          onClick={onClose}
          size={18}
        />
      </div>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-700 text-white font-medium rounded-xl px-4 py-3 w-full hover:bg-red-700/85 transition-all cursor-pointer"
        >
          Logout
        </button>
        <button
          className={`bg-blue-700 text-white ${isOpen ? "p-3" : " font-medium px-4 py-3  text-sm w-full"} rounded-xl hover:bg-blue-600 cursor-pointer transition-all`}
          onClick={handleCreateConversation}
        >
          {isOpen ? <Plus size={16} /> : "New Chat"}
        </button>
      </div>

      {!isOpen && (
        <div
          className="overflow-y-auto  [scrollbar-width:thin] 
                    [scrollbar-color:#374151_transparent] 
                    [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:bg-gray-700 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    hover:[&::-webkit-scrollbar-thumb]:bg-gray-600"
        >
          <p className={`text-gray-500 font-medium text-sm pb-4 `}>
            Conversations
          </p>
          {isConversationLoading ? (
            <Loader />
          ) : conversations.length === 0 ? (
            "No Conversations Found."
          ) : (
            <div className="flex flex-col gap-2.5 overflow-y-auto">
              {conversations?.map((conversation) => (
                <div
                  key={conversation._id}
                  className="text-sm text-gray-200 bg-gray-800 rounded-xl w-full px-2 py-2.5 
              leading-tight cursor-pointer hover:bg-gray-800/80 transition-all"
                  onClick={() => navigate(`/chat/${conversation._id}`)}
                >
                  {conversation.title}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
