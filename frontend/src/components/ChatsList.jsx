import { useEffect,useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  // const [toggle,setToggle] = useState(true);
  const {toggle,setToggle} = useChatStore();

  

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          // className={`bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors  ${toggle?"w-0":"flex"}`}
          className={`bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/30 transition-colors`}
          onClick={() => {
            setSelectedUser(chat);
            setToggle(!toggle);
            console.log(toggle,"this is toogle ");
            
          }}
        >
          <div className="flex items-center gap-3">
            {/* <div className={`w-80  bg-slate-800/50 backdrop-blur-sm ${(toggle)?"flex":"hidden"} flex-col`}></div> */}
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "avatar avatar-online" : "avatar avatar-offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;