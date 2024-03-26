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
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import io from "socket.io-client";

const Login = () => {
  const [show, setShow] = useState(false);
  const [Login, setLogin] = useState();
  const [Password, setPassword] = useState();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = (async) => {
    //check if all fields are filled
    if (!Login || !Password) {
      toast.error("Please fill all fields");
      return;
    } else {
      axios
        .post("http://localhost:3000/login", {
          Login: Login,
          Password: Password,
        })
        .then((response) => {
          const data = response.data;
          if (data.message === "Login successful") {
            localStorage.setItem("token", data.token);
            const socket = io("http://localhost:3000");
            socket.on("connect", () => {
              console.log("Connected to Socket.IO");
            });
            history.push("/chats");
          }
        })
        .catch((error) => {
          // Handle error
          if (
            error.response &&
            error.response.data.message === "Invalid username or password"
          ) {
            toast.error("Invalid username or password");
          } else {
            console.error("An error occurred:", error);
          }
        });
    }
  };

  //Guest account
  const submitHandlerGuest = (async) => {
    if (localStorage.getItem("guestAccount")) {
      //Récupération des informations du compte guest
      let guestAccount = JSON.parse(localStorage.getItem("guestAccount"));

      axios
        .post("http://localhost:3000/login", {
          Login: guestAccount.Login,
          Password: guestAccount.Password,
        })
        .then((response) => {
          const data = response.data;
          if (data.message === "Login successful") {
            localStorage.setItem("token", data.token);
            const socket = io("http://localhost:3000");
            socket.on("connect", () => {
              console.log("Connected to Socket.IO");
            });
            history.push("/chats");
          }
        })
        .catch((error) => {
          // Handle error
          if (
            error.response &&
            error.response.data.message === "Invalid username or password"
          ) {
            toast.error("Invalid username or password");
          } else {
            console.error("An error occurred:", error);
          }
        });
    }
    if (!localStorage.getItem("guestAccount")) {
      //Génération d'un compte guest
      let Name = "Guest" + Math.floor(Math.random() * 1000000);
      let Login = Math.random().toString(36).slice(-8);
      let Password = Math.random().toString(36).slice(-8);

      //Création d'un objet 'guestAccount' pour stocker les informations du compte guest
      let guestAccount = { Name, Login, Password };

      console.log(guestAccount);

      axios
        .post("http://localhost:3000/create/User", {
          Name: Name,
          Login: Login,
          Password: Password,
        })
        .then((response) => {
          const data = response.data;
          if (data.message === "Data created") {
            //Enregistrement du compte guest dans le localStorage
            localStorage.setItem("guestAccount", JSON.stringify(guestAccount));
            toast.success("Guest account created");
            // history.push("/chats");
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
    }
  };

  return (
    <VStack spacing={"5px"}>
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

      <Button
        bg={"orange.400"}
        color={"white"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        variant={"solid"}
        bg={"red.400"}
        color={"white"}
        width="100%"
        onClick={submitHandlerGuest}
      >
        Get Guest Account
      </Button>
    </VStack>
  );
};

export default Login;
