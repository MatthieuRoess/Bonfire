import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../api';
import { afterAll } from '@jest/globals';
import { disconnectDB } from '../db';

afterAll(async () => {
  await disconnectDB();
});

describe('GET /get/:table/:name', () => {
  it('should return a user when the table is User and the user exists', async () => {
    const table = 'User';
    const name = 'Matthieu'; 

    const res = await request(app).get(`/get/${table}/${name}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data found');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('Login', name);
  });

  it('should return a 404 status code when the table is User and the user does not exist', async () => {
    const table = 'User';
    const name = 'nonExistentUser';

    const res = await request(app).get(`/get/${table}/${name}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'No data found');
  });

});

describe('GET /getUser/:id_User', () => {
  it('should return a user when the user exists', async () => {
    const id_User = '65af7c84b83cda9822172cb4'; 

    const res = await request(app).get(`/getUser/${id_User}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data found');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('_id', id_User);
  });

  it('should return a 404 status code when the user does not exist', async () => {
    const id_User = '65af7c84b83cda9822172cb9';

    const res = await request(app).get(`/getUser/${id_User}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'No data found');
  });

});


describe('GET /getAll/:table/:id_user', () => {
  it('should return channels when the table is "Channel" and the user has channels', async () => {
    const table = 'Channel';
    const id_user = '65af7c84b83cda9822172cb4';

    const res = await request(app).get(`/getAll/${table}/${id_user}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data found');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should return a 404 status code when the table is "Channel" and the user has no channels', async () => {
    const table = 'Channel';
    const id_user = '65af7c84b83cda9822172cb9';

    const res = await request(app).get(`/getAll/${table}/${id_user}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'No data found');
  });

  it('should return a 400 status code when the table is invalid', async () => {
    const table = 'InvalidTable';
    const id_user = 'testUserId';

    const res = await request(app).get(`/getAll/${table}/${id_user}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid table');
  });

});

describe('GET /getLatestMessage/:id_Channel', () => {
  it('should return the latest message when the channel has messages', async () => {
    const id_Channel = '65af85a17f054b82e7b8fdd0'; 

    const res = await request(app).get(`/getLatestMessage/${id_Channel}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data found');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data).toHaveLength(1);
    // Add more assertions here...
  });

  it('should return a 404 status code when the channel has no messages', async () => {
    const id_Channel = '65af85a17f054b82e7b8fdd4';

    const res = await request(app).get(`/getLatestMessage/${id_Channel}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'No data found');
  });

});

describe('POST /login', () => {
  it('should return a token when the username and password are correct', async () => {
    const Login = 'Matthieu'; 
    const Password = 'Matthieu'; 

    const res = await request(app)
      .post('/login')
      .send({ Login, Password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  
  });

  it('should return a 401 status code when the username or password is incorrect', async () => {
    const Login = 'testUser';
    const Password = 'wrongPassword';

    const res = await request(app)
      .post('/login')
      .send({ Login, Password });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid username or password');
  });

});



describe('POST /create/:table', () => {
  it('should create a user when the table is "User" and the login is not taken', async () => {
    const table = 'User';
    const data = { Login: 'testUser2', Password: 'testPassword' }; 

    const res = await request(app)
      .post(`/create/${table}`)
      .send(data);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data created');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('Login', data.Login);
  });

  it('should return a 400 status code when the table is "User" and the login is taken', async () => {
    const table = 'User';
    const data = { Login: 'Matthieu', Password: 'Matthieu' }; 

    const res = await request(app)
      .post(`/create/${table}`)
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Login already taken');
  });

  it('should return a 400 status code when the table is invalid', async () => {
    const table = 'InvalidTable';
    const data = { Login: 'testUser', Password: 'testPassword' };

    const res = await request(app)
      .post(`/create/${table}`)
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid table');
  });

});


describe('PUT /update/:table/:id', () => {
  it('should update a user when the table is "User" and the id is valid', async () => {
    const table = 'User';
    const id = '65b7aa34346a083db18d5f59';
    const data = { Login: 'newTestUser', Password: 'newTestPassword' };

    const res = await request(app)
      .put(`/update/${table}/${id}`)
      .send(data);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data updated');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('Login', data.Login);
  
  });

  it('should return a 404 status code when the table is "User" and the id is invalid', async () => {
    const table = 'User';
    const id = '65b7aa34346a083db18d5f56';
    const data = { Login: 'newTestUser', Password: 'newTestPassword' };

    const res = await request(app)
      .put(`/update/${table}/${id}`)
      .send(data);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Data not found');
  });

  it('should return a 400 status code when the table is invalid', async () => {
    const table = 'InvalidTable';
    const id = 'testUserId';
    const data = { Login: 'newTestUser', Password: 'newTestPassword' };

    const res = await request(app)
      .put(`/update/${table}/${id}`)
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid table');
  });

});


describe('DELETE /delete/:table/:id', () => {
  it('should delete a user when the table is "User" and the id is valid', async () => {
    const table = 'User';
    const id = '65cb89dfd2821f977cc482a0'; 

    const res = await request(app).delete(`/delete/${table}/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data deleted');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('_id', id);
  });

  it('should return a 404 status code when the table is "User" and the id is invalid', async () => {
    const table = 'User';
    const id = '65cb860f715fd4e58a83fa88';

    const res = await request(app).delete(`/delete/${table}/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Data not found');
  });

  it('should return a 400 status code when the table is invalid', async () => {
    const table = 'InvalidTable';
    const id = 'testUserId';

    const res = await request(app).delete(`/delete/${table}/${id}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid table');
  }, 10000);

});


describe('GET /getAllUser/:table/:id', () => {
  it('should return user ids when the table is "Channel" and the id is valid', async () => {
    const table = 'Channel';
    const id = '65af85a17f054b82e7b8fdd0'; 

    const res = await request(app).get(`/getAllUser/${table}/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data found');
    expect(res.body).toHaveProperty('id_User');
  });

  it('should return a 404 status code when the table is "Channel" and the id is invalid', async () => {
    const table = 'Channel';
    const id = '65af85a17f054b82e7b8fdd5';

    const res = await request(app).get(`/getAllUser/${table}/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'No data found');
  });

  it('should return a 400 status code when the table is invalid', async () => {
    const table = 'InvalidTable';
    const id = 'testChannelId';

    const res = await request(app).get(`/getAllUser/${table}/${id}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid table');
  });


});


describe('GET /getAll/:table', () => {
  it('should return all channels when the table is "Channel"', async () => {
    const table = 'Channel';

    const res = await request(app).get(`/getAll/${table}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Data found');
    expect(res.body).toHaveProperty('result');

  });


  it('should return a 400 status code when the table is invalid', async () => {
    const table = 'InvalidTable';

    const res = await request(app).get(`/getAll/${table}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid table');
  });

});