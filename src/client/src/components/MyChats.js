import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState, createContext } from "react";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatBox from "./ChatBox";

export const SelectedChannelContext = createContext();

function MyChats() {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const  userId = decoded.id;
  const [allChannels, setAllChannels] = useState([]);
  const [otherArray, setOtherArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  useEffect(() => {
    // console.log(selectedChannelId);
  }, [selectedChannelId]);

  async function getChannelMessage() {
    try {
      const response = await axios.get("http://localhost:3000/getAll/Channel/" + userId);
      const temp = response.data.data;
      const newAllChannels = [];
      const newOtherArray = [];
      const userName = [];
  
      for (const channel of temp) {
        newAllChannels.push(channel.Name);
        const result = await axios.get("http://localhost:3000/getLatestMessage/" + channel._id);
        newOtherArray.push(result.data.data);
        const anotherResult = await axios.get("http://localhost:3000/getUser/" + result.data.data[0].id_User);
        userName.push(anotherResult.data.data.Login);
      }
  
      setUserName(userName);
      setAllChannels(newAllChannels);
      setOtherArray(newOtherArray);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getChannelMessage();
  }, []);

  useEffect(() => {
    // console.log(selectedChannelId);
  }, [selectedChannelId]);

  if (isLoading){
    return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',width:'100vw' }}>
    <div style={{
      border: '16px solid #f3f3f3',
      borderRadius: '50%',
      borderTop: '16px solid #3498db',
      width: '120px',
      height: '120px',
      animation: 'spin 2s linear infinite'
    }} />
    <style jsx global>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>);
  }
  else{
    return (
      <SelectedChannelContext.Provider value={selectedChannelId}>
        <Box
          display={{ base: "none", md: "flex" }}
          flexDir="column"
          alignItems="center"
          p={3}
          bg="white"
          w={{ base: "100%", md: "31%" }}
          borderRadius="lg"
          borderWidth="1px"
        >
          <Box
            pb={3}
            px={3}
            fontSize={{ base: "28px", md: "30px" }}
            color={"black"}
            display="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            My Chats
            <GroupChatModal>
              <Button
                display="flex"
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                rightIcon={<AddIcon />}
              >
                New Group Chat
              </Button>
            </GroupChatModal>
          </Box>
          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {!isLoading &&
              allChannels.map((channel, index) => {
                return (
                  <Box
                    key={channel._id}
                    onClick={() => {
                      setSelectedChannelId(otherArray[index][0].id_Channel);
                      // console.log(otherArray[index][0].id_Channel);
                    }}
                    cursor="pointer"
                    bg={"#E8E8E8"}
                    color={"black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    my={1}
                  >
                    <Text>{channel}</Text>
                    <Text fontSize="xs">
                      <b>{userName[index][0]} : </b>
                      {otherArray[index][0].Contenu}
                    </Text>
                  </Box>
                );
              })}
          </Box>
        </Box>
        <ChatBox selectedChannelId={selectedChannelId} />
      </SelectedChannelContext.Provider>
    );
  }
  
  }
  
export default MyChats;
