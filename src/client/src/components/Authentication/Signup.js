import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [Name, setName] = useState();
  const [Login, setLogin] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [Password, setPassword] = useState();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = (async) => {
    //check if all fields are filled

    if (!Name || !Login || !Password || !confirmpassword) {
      toast.error("Please fill all fields");
      return;
    } else {
      if (Password === confirmpassword) {
        axios
          .post("http://localhost:3000/create/User", {
            Name: Name,
            Login: Login,
            Password: Password,
          })
          .then((response) => {
            if (response.data.message === "Data created") {
              toast.success("User created successfully");
              //history.push("/chats");
            }
          })
          .catch((error) => {
            // An error occurred. Check if it's because the user already exists.
            if (
              error.response &&
              error.response.data.message === "Login already taken"
            ) {
              toast.error("User already exists");
            } else {
              // Some other error occurred. Display an error toast.
              toast.error("An error occurred");
            }
          });
      } else {
        toast.error("Passwords do not match");
      }
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="Name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="Login" isRequired>
        <FormLabel>Login</FormLabel>
        <Input
          placeholder="Enter Your Login"
          onChange={(e) => setLogin(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="Password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        bg={"red.400"}
        color={"white"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
