import axios from "axios";
import { toast } from "react-toastify";

// Function to update user's name | Good
function nick(idUser, name) {
  try {
    axios
      .put(`http://localhost:3000/update/User/${idUser}`, {
        Name: name,
      })
      .then((response) => {
        const data = response.data;
        if (data.message === "Data updated") {
          toast.success("Name updated");
        }
      });
  } catch (error) {
    // Handle error
    console.error("An error occurred:", error);
  }
}

// Function to list all channels | Good
async function listChannel() {
  try {
    axios.get("http://localhost:3000/getAll/Channel").then((response) => {
      const data = response.data;
      if (data.message === "Data found") {
        toast.success("Channels found");
        for (let i = 0; i < data.result.length; i++) {
          toast(data.result[i].Name);
        }
      }
    });
  } catch (error) {
    // Handle error
    console.error("An error occurred:", error);
  }
}

// Function to create a channel | Good
async function createChannel(idUser, name) {
  try {
    axios
      .post(`http://localhost:3000/create/Channel`, {
        Name: name,
        id_user: idUser,
      })
      .then((response) => {
        const data = response.data;
        if (data.message === "Data created") {
          toast.success("Channel created");
        }

        axios
          .post(`http://localhost:3000/create/Message`, {
            id_User: idUser,
            id_Channel: response.data.data._id,
            Contenu: "Welcome to the channel!",
          })
          .then((response) => {
            const data = response.data;
            if (data.message === "Data created") {
              toast.success("Message sent");
            }
          });
      });
  } catch (error) {
    // Handle error
    console.error("An error occurred:", error);
  }
}

// Function to delete a channel | Good
async function deleteChannel(idChannel) {
  try {
    axios
      .delete(`http://localhost:3000/delete/Channel/${idChannel}`)
      .then((response) => {
        const data = response.data;
        if (data.message === "Data deleted") {
          toast.success("Channel deleted");
        }
      });
  } catch (error) {
    // Handle error
    console.error("An error occurred:", error);
  }
}

// Function to join a channel | Good
async function joinChannel(id, name) {
  try {
    // Fetch channel data
    const response = await axios.get(
      `http://localhost:3000/get/Channel/${name}`
    );
    const channelData = response.data.data;

    // Add the new user ID to the existing list
    channelData.id_user.push(id);

    axios.put(`http://localhost:3000/update/Channel/${channelData._id}`, {
      id_user: channelData.id_user,
    });

    // Display success message
    toast.success("User added to channel successfully!");
  } catch (error) {
    // Handle error
    console.error("An error occurred:", error);
  }
}

// Function to leave a channel | Good
async function leaveChannel(id, name) {
  try {
    // Fetch channel data
    const response = await axios.get(
      `http://localhost:3000/get/Channel/${name}`
    );
    const channelData = response.data.data;

    // Remove the user ID from the existing list
    channelData.id_user = channelData.id_user.filter((userId) => userId !== id);

    axios.put(`http://localhost:3000/update/Channel/${channelData._id}`, {
      id_user: channelData.id_user,
    });

    // Display success message
    toast.success("User removed from channel successfully!");
  } catch (error) {
    // Handle error
    console.error("An error occurred:", error);
  }
}

// Function to list all users in a channel | Good
async function listUsersInChannel(name) {
  try {
    const response = await axios.get(
      `http://localhost:3000/get/Channel/${name}`
    );
    const data = response.data;
    if (data.message === "Data found") {
      data.data.id_user.forEach((element) => {
        axios
          .get(`http://localhost:3000/getUser/${element}`)
          .then((response) => {
            const data = response.data;
            if (data.message === "Data found") {
              toast(data.data.Name);
            }
          });
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Function to send a message | Good
async function privateMessage(idSender, idReceiver, message) {
  let NameSender = "";
  let NameReceiver = "";
  let channelName = ""; // Déplacez la déclaration ici

  try {
    axios
      .get(`http://localhost:3000/getUser/${idReceiver}`)
      .then((response) => {
        const data = response.data;
        if (data.message === "Data found") {
          NameReceiver = data.data.Name;
        }

        axios
          .get(`http://localhost:3000/getUser/${idSender}`)
          .then((response) => {
            const data = response.data;
            if (data.message === "Data found") {
              NameSender = data.data.Name;
            }

            // Maintenant que nous avons les noms des expéditeurs et des destinataires,
            // construisons le nom du canal
            channelName =
              "Private Channel of " + NameSender + " and " + NameReceiver;

            try {
              axios
                .post(`http://localhost:3000/create/Channel`, {
                  Name: channelName,
                  id_user: [idSender, idReceiver],
                })
                .then((response) => {
                  const data = response.data;
                  if (data.message === "Data created") {
                    const idChannel = response.data.data._id;
                    toast.success("Channel created");

                    axios
                      .post(`http://localhost:3000/create/Message`, {
                        id_User: idSender,
                        id_Channel: idChannel,
                        Contenu: message,
                      })
                      .then((response) => {
                        const data = response.data;
                        if (data.message === "Data created") {
                          toast.success("Message sent");
                        }
                      });
                  }
                });
            } catch (error) {
              // Handle error
              console.error("An error occurred:", error);
            }
          });
      });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

export {
  nick,
  listChannel,
  createChannel,
  deleteChannel,
  joinChannel,
  leaveChannel,
  listUsersInChannel,
  privateMessage,
};
