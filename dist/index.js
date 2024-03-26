"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("./models/userModel"));
const db_1 = require("./db");
require("./api");
//get one user by name
function getUserByName(userName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectDB)();
            const user = yield userModel_1.default.findOne({ Name: userName });
            if (user !== null) {
                console.log('User found:', user);
                return user;
            }
            else {
                console.log('User not found');
                console.log(user);
                console.log(userName);
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
        finally {
            yield (0, db_1.disconnectDB)();
        }
    });
}
// get all the users
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectDB)();
            const users = yield userModel_1.default.find();
            if (users !== null) {
                console.log('Users found:', users);
                return users;
            }
            else {
                console.log('Users not found');
                console.log(users);
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
        finally {
            yield (0, db_1.disconnectDB)();
        }
    });
}
// create a user
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectDB)();
            const newUser = yield userModel_1.default.create(user);
            if (newUser !== null) {
                console.log('User created:', newUser);
                return newUser;
            }
            else {
                console.log('User not created');
                console.log(newUser);
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
        finally {
            yield (0, db_1.disconnectDB)();
        }
    });
}
// update a user
function updateUser(userName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectDB)();
            const updateUser = yield userModel_1.default.findOneAndUpdate({ Name: userName }, data);
            if (updateUser !== null) {
                console.log('User update:', updateUser);
                return updateUser;
            }
            else {
                console.log('User not update');
                console.log(updateUser);
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
        finally {
            yield (0, db_1.disconnectDB)();
        }
    });
}
// delete a user
function deleteUser(userName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectDB)();
            const updateUser = yield userModel_1.default.deleteOne({ Name: userName });
            if (updateUser !== null) {
                console.log('User delete:', updateUser);
                return updateUser;
            }
            else {
                console.log('User not delete');
                console.log(updateUser);
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
        finally {
            yield (0, db_1.disconnectDB)();
        }
    });
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
