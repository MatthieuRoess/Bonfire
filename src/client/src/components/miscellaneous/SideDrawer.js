import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import io from "socket.io-client";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState(["No notifications yet!"]);

  async function fetchChannelName(idChannel) {
    try {
      const response = await axios.get(
        `http://localhost:3000/getChannel/${idChannel}`
      );
      const nomChannel = response.data;
      return nomChannel.data.Name;
    } catch (error) {
      console.error("Erreur lors de la récupération du nom du canal:", error);
    }
  }

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("notification", async (data) => {
      const nomChannel = await fetchChannelName(data.idChannel);
      const { Contenu } = data;
      const notification = `${Contenu} - ${nomChannel}`;
      setNotifications((oldNotifications) => {
        if (
          oldNotifications.length === 1 &&
          oldNotifications[0] === "No notifications yet!"
        ) {
          return [notification];
        } else {
          return [...oldNotifications, notification];
        }
      });
    });

    // Effet de nettoyage pour fermer la connexion socket
    return () => {
      socket.disconnect();
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  const [User, setUser] = useState();

  const handleDelete = (indexToDelete) => {
    setNotifications((oldNotifications) => {
      const newNotifications = oldNotifications.filter((_, index) => index !== indexToDelete);
      if (newNotifications.length === 0) {
        return ["No notifications yet!"];
      } else {
        return newNotifications;
      }
    });
  };

  const handleFunction = () => {};

  const handleSearch = (async) => {
    axios
      .get(`http://localhost:3000/get/User/${search}`, {})
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        // Handle error
        if (error.response && error.response.data.message === "No data found") {
          toast.error("User not found");
          setUser(false);
        } else {
          console.error("An error occurred:", error);
        }
      });
  };

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const userName = decoded.name;

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip
          label={"Search Users to chat"}
          hasArrow
          placement={"bottom-end"}
        >
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} px={2}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} color={"black"}>
          Bonfire
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} color={"black"} margin={1} />
            </MenuButton>
            <MenuList color={"black"}>
              {notifications.map((notification, index) => (
                <MenuItem key={index}>
                  {notification}
                  {notification !== "No notifications yet!" && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={"sm"} cursor={"pointer"} name={userName}></Avatar>
            </MenuButton>
            <MenuList color={"black"}>
              <ProfileModal>
                {/* user={user} */}
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement={"left"} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                focusBorderColor="red.300"
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {User && (
              <Box
                onClick={handleFunction}
                cursor="pointer"
                bg="#E8E8E8"
                _hover={{
                  background: "red.300",
                  color: "white",
                }}
                w="100%"
                display="flex"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"
              >
                <Avatar
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={User.data.Name}
                />
                <Box>
                  <Text>{User.data.Name}</Text>
                  <Text fontSize="xs">
                    <b>Login : </b>
                    {User.data.Login}
                  </Text>
                </Box>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
