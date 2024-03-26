import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from "jwt-decode";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  function createGroup() {
    if (!search || !groupChatName) {
      toast.error("Please fill all the champ");
    } else {
      let allLogin = search.split(",").map((temp) => temp.trim());
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const idUserCurrent = decoded.id;
      let id_user = [];
      id_user.push(idUserCurrent);

      allLogin.forEach((login, index) => {
        axios
          .get("http://localhost:3000/get/User/" + encodeURIComponent(login))
          .then((response) => {
            id_user.push(response.data.data._id);
            if (id_user.length === allLogin.length +1) {
              const data = {
                Name: groupChatName,
                id_user: id_user,
              };

              axios
                .post("http://localhost:3000/create/Channel", data)
                .then((response) => {
                  console.log("Channel created:", response.data);
                  if (response.data.message === "Data created") {
                    const date = new Date();
                    const currentTime = date.toLocaleString();
                    const param = {
                      Contenu: "Welcome to " + response.data.data.Name,
                      id_User: "65ca261dcd5403010f02b270",
                      id_Channel: response.data.data._id,
                      Logs: currentTime,
                    };
                    axios.post("http://localhost:3000/create/Message", param);
                    onClose();
                    toast.success("Channel Created !");
                    setGroupChatName("");
                    setSearch("");
                  }
                  // Handle successful creation
                })
                .catch((error) => {
                  console.error("Error creating channel:", error);
                  toast.error("Something is wrong");
                  // Handle error
                });
            }
          })
          .catch((error) => {
            console.error("Error for search user:", error);
            toast.error("An user dont exist");
            // Handle error
          });
      });
    }
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                focusBorderColor="red.300"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                focusBorderColor="red.300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap"></Box>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={"red.300"}
              color={"black"}
              onClick={() => {
                createGroup();
              }}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
