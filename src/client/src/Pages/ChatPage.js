import React from "react";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  return (
    <div style={{ width: "100%", color: "white" }}>
      <SideDrawer />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        <MyChats />
      </Box>
    </div>
  );
};

export default ChatPage;
