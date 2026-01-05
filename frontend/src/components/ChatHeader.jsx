import { XIcon, House } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  // const [toggle, setToggle] = useState(true);
  const {toggle,setToggle} = useChatStore();


  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);
  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1 sticky top-0 z-10 h-20"
    >
      <div className="flex items-center space-x-3">
        <div
          className={`avatar ${
            isOnline ? "avatar avatar-online" : "avatar avatar-offline"
          }`}
        >
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-sm">
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        <House 
        className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        onClick={()=>{setToggle(!toggle)}}
        />
      </button>
      {/* <div className={`w-80  bg-slate-800/50 backdrop-blur-sm ${(toggle)?"flex":"hidden"} flex-col`}>//
        </div> */}
      <button onClick={() => setSelectedUser(null) } className="hidden sm:block">
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer " />
      </button>
    </div>
  );
}

export default ChatHeader;
