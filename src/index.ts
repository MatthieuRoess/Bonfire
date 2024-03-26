import UserModel from './models/userModel';
import ChannelModel from './models/channelModel';
import MessageModel from './models/messageModel';
import { connectDB, disconnectDB } from './db';
import axios from 'axios';
import './api';

//get one user by name

async function getUserByName(userName: string) {
  try {
    await connectDB();
    const user = await UserModel.findOne({Name: userName});

    if (user !== null) {
      console.log('User found:', user);
      return user;
    } else {
      console.log('User not found');
      console.log(user);
      console.log(userName);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

// get all the users

async function getAllUsers() {
  try {
    await connectDB();
    const users = await UserModel.find();

    if (users !== null) {
      console.log('Users found:', users);
      return users;
    } else {
      console.log('Users not found');
      console.log(users);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

// create a user

async function createUser(user: any) {
  try {
    await connectDB();
    const newUser = await UserModel.create(user);

    if (newUser !== null) {
      console.log('User created:', newUser);
      return newUser;
    } else {
      console.log('User not created');
      console.log(newUser);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

// update a user

async function updateUser(userName : string,data: any) {
  try {
    await connectDB();
    const updateUser = await UserModel.findOneAndUpdate({Name: userName},data);

    if (updateUser !== null) {
      console.log('User update:', updateUser);
      return updateUser;
    } else {
      console.log('User not update');
      console.log(updateUser);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}


// delete a user

async function deleteUser(userName : string) {
  try {
    await connectDB();
    const updateUser = await UserModel.deleteOne({Name: userName});

    if (updateUser !== null) {
      console.log('User delete:', updateUser);
      return updateUser;
    } else {
      console.log('User not delete');
      console.log(updateUser);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

// const apiUrl = 'http://localhost:3000/login';

// axios.get(apiUrl)
//   .then(response => {
//     console.log('Réponse de l\'API :', response.data);
//   })
//   .catch(error => {
//     console.error('Erreur lors de la requête à l\'API :', error.message);
//   });

// const bcrypt = require('bcrypt');
// const password = 'LePlusBo';

// bcrypt.hash(password, 10, (err: Error | null, hash: string) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
////   Store hash in your password DB.
//   console.log(hash);
// });
