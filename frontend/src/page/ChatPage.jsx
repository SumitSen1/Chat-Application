import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/borderAnimated.Component";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
// import { use, useState } from "react";

function ChatPage() {
  const {toggle,setToggle} = useChatStore();
  const {activeTab,selectedUser} = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-screen sm:h-[800px] p-1 ">
       <BorderAnimatedContainer>
        {/* <button onClick={()=>{setToggle(!toggle)}}>CLick</button> */}
        {/* LeftSide */}
        <div className={`w-80  bg-slate-800/50 backdrop-blur-sm ${(toggle)?"flex":"hidden"} sm:flex flex-col`}>
          <ProfileHeader/>
          <ActiveTabSwitch/>  

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList/> : <ContactList/>}
          </div>
        </div>
        {/* RightSide */}
        <div className="flex-1 sm:flex flex-col bg-slate-900/50 backdrop-blur-sm overflow-y-scroll">
          {selectedUser ? <ChatContainer/> : <NoConversationPlaceholder/>}
        </div>
       </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage
