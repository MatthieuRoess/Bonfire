import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { useEffect } from "react";

const Chatbox = ({ fetchAgain, setFetchAgain, selectedChannelId }) => {

  return (
    <Box
      display={"flex"}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} selectedChannelId={selectedChannelId} />
    </Box>
  );
};

export default Chatbox;
