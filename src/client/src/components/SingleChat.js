import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import { InputGroup } from "@chakra-ui/input";
import { InputRightAddon } from "@chakra-ui/input";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Avatar } from "@chakra-ui/avatar";
import {
  nick,
  listChannel,
  createChannel,
  deleteChannel,
  joinChannel,
  leaveChannel,
  listUsersInChannel,
  privateMessage,
} from "./Commands";

const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const userId = decoded.id;

const SingleChat = ({ selectedChannelId }) => {
  const [channels, setChannels] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [channelName, setChannelName] = useState("");

  const getChannelName = async (channelId) => {
    try {
      await axios.get(`http://localhost:3000/getAll/Channel`).then((res) => {
        const data = res.data;
        if (data.message === "Data found") {
          for (let i = 0; i < data.result.length; i++) {
            if (data.result[i]._id === channelId) {
              setChannelName(data.result[i].Name); // Set the channel name here
              return;
            }
          }
        }
      });
    } catch (error) {
      console.error("Failed to get channel name:", error);
    }
  };

  const fetchUserName = async (id_User) => {
    try {
      const response = await fetch(`http://localhost:3000/getUser/${id_User}`);

      if (!response.ok) {
        console.error("HTTP error:", response.status);
        return;
      }

      if (response.headers.get("Content-Type").includes("application/json")) {
        const data = await response.json();

        if (data.message === "Data found" && data.data && data.data.Name) {
          const fullName = data.data.Name;
          return fullName;
        } else {
          console.error("No user found with this ID or user has no name");
        }
      } else {
        console.error("Response is not JSON:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChannelId) {
      console.log("selectedChannelId is null or undefined");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/Message/${selectedChannelId}`
      );
      const messagesWithUserName = await Promise.all(
        response.data.data.map(async (message) => {
          const userName = await fetchUserName(message.id_User);
          return { ...message, userName };
        })
      );
      setMessages(messagesWithUserName);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Connect to the server when the component mounts
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("chat message", (msg) => {
      if (msg.Contenu.includes("/nick")) {
        // Fonctionne
        const newNick = msg.Contenu.split(" ").slice(1).join(" ");
        nick(userId, newNick);
      }
      if (msg.Contenu.includes("/list")) {
        // Fonctionne
        listChannel();
      }
      if (msg.Contenu.includes("/create")) {
        // Fonctionne
        const newChannel = msg.Contenu.split(" ").slice(1).join(" ");
        createChannel(userId, newChannel);
      }
      if (msg.Contenu.includes("/delete")) {
        // Fonctionne
        const channelToDelete = msg.Contenu.split(" ").slice(1).join(" ");
        deleteChannel(channelToDelete);
      }
      if (msg.Contenu.includes("/join")) {
        // Fonctionne
        const channelToJoin = msg.Contenu.split(" ").slice(1).join(" ");
        joinChannel(userId, channelToJoin);
      }
      if (msg.Contenu.includes("/leave")) {
        // Fonctionne
        const channelToPart = msg.Contenu.split(" ").slice(1).join(" ");
        leaveChannel(userId, channelToPart);
      }
      if (msg.Contenu.includes("/users")) {
        const channelToSearch = msg.Contenu.split(" ").slice(1).join(" ");
        listUsersInChannel(channelToSearch);
      }
      if (msg.Contenu.includes("/msg")) {
        const arrayMessage = msg.Contenu.split(" ").slice(1);
        const idReceiver = arrayMessage[0];
        const message = arrayMessage.slice(1).join(" ");

        privateMessage(userId, idReceiver, message);
      }

      setMessages((messages) => [...messages, msg]);
    });

    setSocket(socket);

    // Disconnect from the server when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getChannelName(selectedChannelId);
  }, [selectedChannelId]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (message) {
      // console.log("Emitting chat message:", message);
      const msg = {
        Contenu: message,
        idUser: userId,
        idChannel: String(selectedChannelId),
      };
      socket.emit("notification", msg);
      socket.emit("chat message", msg);
      setMessage("");
      setTimeout(() => {
        fetchMessages();
      }, 100);
    }
  };

  return (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
        color={"black"}
      >
        # {channelName}
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
        />
        <>
          <ProfileModal user={"Test"} />
        </>
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        <Box overflow="auto" id="yourDivID" ref={messagesEndRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.id_User === userId ? "flex-end" : "flex-start",
                margin: "20px 0",
              }}
            >
              <Text
                bg={message.id_User === userId ? "red.300" : "white"}
                color={message.id_User === userId ? "white" : "black"}
                p={3}
                borderRadius="lg"
                maxW="70%"
                wordBreak="break-word"
              >
                <Avatar
                  size={"2xl"}
                  borderRadius={"full"}
                  boxSize={"35px"}
                  marginRight={"10px"}
                  name={message.userName}
                  className="avatar-name"
                ></Avatar>
                {message.Contenu}
                <Text
                  fontSize="xs"
                  textAlign="right"
                  color={message.id_User === userId ? "white" : "black"}
                >
                  {message.Logs ? message.Logs.split(" ")[1] : ""}
                </Text>
              </Text>
            </div>
          ))}
        </Box>
        <FormControl id="form" isRequired mt={3}>
          <form onSubmit={submitHandler}>
            <InputGroup>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                color={"black"}
                focusBorderColor="red.300"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <InputRightAddon
                bg={"red.300"}
                color={"black"}
                onClick={submitHandler}
                cursor={"pointer"}
              >
                <ArrowForwardIcon />
              </InputRightAddon>
            </InputGroup>
          </form>
        </FormControl>
      </Box>
    </>
  );
};

export default SingleChat;
