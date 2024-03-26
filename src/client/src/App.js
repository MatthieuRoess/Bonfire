import { Route, Redirect } from "react-router-dom";
import "./App.css";
import Form from "./Pages/Form";
import ChatPage from "./Pages/ChatPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import io from "socket.io-client";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Form} exact />
      <Route 
        path="/chats" 
        render={() => 
          localStorage.getItem("token") ? <ChatPage /> : <Redirect to='/' />
        }  
      />
      <ToastContainer />
    </div>
  );
}

export default App;