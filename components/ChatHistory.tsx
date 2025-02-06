import Image from "next/image";

const ChatHistory = ({
  chats,
  onChatSelect,
  onClear,
}: {
  chats: string[];
  onChatSelect: (chat: string) => void;
  onClear: () => void;
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
        >
          <Image src="/img/trash.svg" alt="Clear history" width={16} height={16} />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {chats.length === 0 ? (
          <div className="text-center text-gray-500">No chat history</div>
        ) : (
          chats.map((chat, index) => (
            <button
              key={index}
              onClick={() => onChatSelect(chat)}
              className="mb-2 w-full rounded-lg p-3 text-left hover:bg-gray-100"
            >
              <p className="line-clamp-2 text-sm text-gray-700">{chat}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <Image src="/img/time-past.svg" alt="Time" width={12} height={12} />
                {new Date().toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;