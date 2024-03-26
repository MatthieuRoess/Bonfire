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
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const api_1 = __importDefault(require("../api"));
const globals_2 = require("@jest/globals");
const db_1 = require("../db");
(0, globals_2.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.disconnectDB)();
}));
(0, globals_1.describe)('GET /get/:table/:name', () => {
    (0, globals_1.it)('should return a user when the table is User and the user exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const name = 'Matthieu';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/get/${table}/${name}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data found');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toHaveProperty('Login', name);
    }));
    (0, globals_1.it)('should return a 404 status code when the table is User and the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const name = 'nonExistentUser';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/get/${table}/${name}`);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'No data found');
    }));
});
(0, globals_1.describe)('GET /getUser/:id_User', () => {
    (0, globals_1.it)('should return a user when the user exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const id_User = '65af7c84b83cda9822172cb4';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getUser/${id_User}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data found');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toHaveProperty('_id', id_User);
    }));
    (0, globals_1.it)('should return a 404 status code when the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const id_User = '65af7c84b83cda9822172cb9';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getUser/${id_User}`);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'No data found');
    }));
});
(0, globals_1.describe)('GET /getAll/:table/:id_user', () => {
    (0, globals_1.it)('should return channels when the table is "Channel" and the user has channels', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'Channel';
        const id_user = '65af7c84b83cda9822172cb4';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAll/${table}/${id_user}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data found');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toBeInstanceOf(Array);
    }));
    (0, globals_1.it)('should return a 404 status code when the table is "Channel" and the user has no channels', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'Channel';
        const id_user = '65af7c84b83cda9822172cb9';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAll/${table}/${id_user}`);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'No data found');
    }));
    (0, globals_1.it)('should return a 400 status code when the table is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'InvalidTable';
        const id_user = 'testUserId';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAll/${table}/${id_user}`);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid table');
    }));
});
(0, globals_1.describe)('GET /getLatestMessage/:id_Channel', () => {
    (0, globals_1.it)('should return the latest message when the channel has messages', () => __awaiter(void 0, void 0, void 0, function* () {
        const id_Channel = '65af85a17f054b82e7b8fdd0';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getLatestMessage/${id_Channel}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data found');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toBeInstanceOf(Array);
        (0, globals_1.expect)(res.body.data).toHaveLength(1);
        // Add more assertions here...
    }));
    (0, globals_1.it)('should return a 404 status code when the channel has no messages', () => __awaiter(void 0, void 0, void 0, function* () {
        const id_Channel = '65af85a17f054b82e7b8fdd4';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getLatestMessage/${id_Channel}`);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'No data found');
    }));
});
(0, globals_1.describe)('POST /login', () => {
    (0, globals_1.it)('should return a token when the username and password are correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const Login = 'Matthieu';
        const Password = 'Matthieu';
        const res = yield (0, supertest_1.default)(api_1.default)
            .post('/login')
            .send({ Login, Password });
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Login successful');
        (0, globals_1.expect)(res.body).toHaveProperty('user');
        (0, globals_1.expect)(res.body).toHaveProperty('token');
    }));
    (0, globals_1.it)('should return a 401 status code when the username or password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const Login = 'testUser';
        const Password = 'wrongPassword';
        const res = yield (0, supertest_1.default)(api_1.default)
            .post('/login')
            .send({ Login, Password });
        (0, globals_1.expect)(res.status).toBe(401);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid username or password');
    }));
});
(0, globals_1.describe)('POST /create/:table', () => {
    (0, globals_1.it)('should create a user when the table is "User" and the login is not taken', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const data = { Login: 'testUser2', Password: 'testPassword' };
        const res = yield (0, supertest_1.default)(api_1.default)
            .post(`/create/${table}`)
            .send(data);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data created');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toHaveProperty('Login', data.Login);
    }));
    (0, globals_1.it)('should return a 400 status code when the table is "User" and the login is taken', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const data = { Login: 'Matthieu', Password: 'Matthieu' };
        const res = yield (0, supertest_1.default)(api_1.default)
            .post(`/create/${table}`)
            .send(data);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Login already taken');
    }));
    (0, globals_1.it)('should return a 400 status code when the table is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'InvalidTable';
        const data = { Login: 'testUser', Password: 'testPassword' };
        const res = yield (0, supertest_1.default)(api_1.default)
            .post(`/create/${table}`)
            .send(data);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid table');
    }));
});
(0, globals_1.describe)('PUT /update/:table/:id', () => {
    (0, globals_1.it)('should update a user when the table is "User" and the id is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const id = '65b7aa34346a083db18d5f59';
        const data = { Login: 'newTestUser', Password: 'newTestPassword' };
        const res = yield (0, supertest_1.default)(api_1.default)
            .put(`/update/${table}/${id}`)
            .send(data);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data updated');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toHaveProperty('Login', data.Login);
    }));
    (0, globals_1.it)('should return a 404 status code when the table is "User" and the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const id = '65b7aa34346a083db18d5f56';
        const data = { Login: 'newTestUser', Password: 'newTestPassword' };
        const res = yield (0, supertest_1.default)(api_1.default)
            .put(`/update/${table}/${id}`)
            .send(data);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data not found');
    }));
    (0, globals_1.it)('should return a 400 status code when the table is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'InvalidTable';
        const id = 'testUserId';
        const data = { Login: 'newTestUser', Password: 'newTestPassword' };
        const res = yield (0, supertest_1.default)(api_1.default)
            .put(`/update/${table}/${id}`)
            .send(data);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid table');
    }));
});
(0, globals_1.describe)('DELETE /delete/:table/:id', () => {
    (0, globals_1.it)('should delete a user when the table is "User" and the id is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const id = '65cb89dfd2821f977cc482a0';
        const res = yield (0, supertest_1.default)(api_1.default).delete(`/delete/${table}/${id}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data deleted');
        (0, globals_1.expect)(res.body).toHaveProperty('data');
        (0, globals_1.expect)(res.body.data).toHaveProperty('_id', id);
    }));
    (0, globals_1.it)('should return a 404 status code when the table is "User" and the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'User';
        const id = '65cb860f715fd4e58a83fa88';
        const res = yield (0, supertest_1.default)(api_1.default).delete(`/delete/${table}/${id}`);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data not found');
    }));
    (0, globals_1.it)('should return a 400 status code when the table is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'InvalidTable';
        const id = 'testUserId';
        const res = yield (0, supertest_1.default)(api_1.default).delete(`/delete/${table}/${id}`);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid table');
    }), 10000);
});
(0, globals_1.describe)('GET /getAllUser/:table/:id', () => {
    (0, globals_1.it)('should return user ids when the table is "Channel" and the id is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'Channel';
        const id = '65af85a17f054b82e7b8fdd0';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAllUser/${table}/${id}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data found');
        (0, globals_1.expect)(res.body).toHaveProperty('id_User');
    }));
    (0, globals_1.it)('should return a 404 status code when the table is "Channel" and the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'Channel';
        const id = '65af85a17f054b82e7b8fdd5';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAllUser/${table}/${id}`);
        (0, globals_1.expect)(res.status).toBe(404);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'No data found');
    }));
    (0, globals_1.it)('should return a 400 status code when the table is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'InvalidTable';
        const id = 'testChannelId';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAllUser/${table}/${id}`);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid table');
    }));
});
(0, globals_1.describe)('GET /getAll/:table', () => {
    (0, globals_1.it)('should return all channels when the table is "Channel"', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'Channel';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAll/${table}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Data found');
        (0, globals_1.expect)(res.body).toHaveProperty('result');
    }));
    (0, globals_1.it)('should return a 400 status code when the table is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const table = 'InvalidTable';
        const res = yield (0, supertest_1.default)(api_1.default).get(`/getAll/${table}`);
        (0, globals_1.expect)(res.status).toBe(400);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Invalid table');
    }));
});
