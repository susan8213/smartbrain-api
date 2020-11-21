require("dotenv").config();

const request = require("supertest");
const faker = require("faker");
const app = require("../app");
const client = require("../models/dbClient");

const now = new Date();
const user = {
  name: "testUser",
  email: "testUser@example.com",
  entries: 0,
  joined: now
};

afterEach(async () => {
  await client.raw('TRUNCATE "user", "user_secret" RESTART IDENTITY CASCADE');
});

afterAll(() => {
  client.destroy();
});

describe("User API", () => {
  describe("GET /users", () => {
    it("should get an array with one user object", async () => {
      await client("user").insert(user);

      const res = await request(app).get("/users");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject([
        { ...user, joined: now.toISOString(), id: 1 }
      ]);
    });
  });

  describe("GET /users/:id", () => {
    it("should get one user object", async () => {
      await client("user").insert(user);

      const res = await request(app).get("/users/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ ...user, joined: now.toISOString(), id: 1 });
    });

    it("should return empty with 404 status when the user's id does not exist", async () => {
      const userId = faker.random.number();

      const res = await request(app).get(`/users/${userId}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe("POST /users/register", () => {
    it("should return user object with 201 status", async () => {
      const body = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password()
      };

      const res = await request(app)
        .post("/users/register")
        .send(body);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("email", body.email);
      expect(res.body).toHaveProperty("name", body.name);
      expect(res.body).toHaveProperty("entries", 0);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("joined");
    });

    it("should return bad request when there's missing email of the request body", async () => {
      const body = {
        name: faker.name.findName(),
        password: faker.internet.password()
      };

      const res = await request(app)
        .post("/users/register")
        .send(body);

      expect(res.statusCode).toEqual(400);
    });

    it("should return bad request when the user's email is deuplicate", async () => {
      await client("user").insert(user);
      const body = {
        email: "testUser@example.com",
        name: faker.name.findName(),
        password: faker.internet.password()
      };

      const res = await request(app)
        .post("/users/register")
        .send(body);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("POST /users/signin", () => {
    it("should return user object with 200 status", async () => {
      const body = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password()
      };
      await request(app)
        .post("/users/register")
        .send(body);

      const res = await request(app)
        .post("/users/signin")
        .send({ email: body.email, password: body.password });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("email", body.email);
      expect(res.body).toHaveProperty("name", body.name);
      expect(res.body).toHaveProperty("entries", 0);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("joined");
    });

    it("should return bad request and error message when the password is incorrect", async () => {
      const body = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password()
      };
      await request(app)
        .post("/users/register")
        .send(body);

      const res = await request(app)
        .post("/users/signin")
        .send({ email: body.email, password: faker.internet.password() });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual("Email or Password is incorrect.");
    });

    it("should return bad request and error message when the email is incorrect", async () => {
      const body = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password()
      };
      await request(app)
        .post("/users/register")
        .send(body);

      const res = await request(app)
        .post("/users/signin")
        .send({ email: faker.internet.email(), password: body.password });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual("Email or Password is incorrect.");
    });
  });

  describe("PUT /users/:id/image", () => {
    it("should get increment entries", async () => {
      await client("user").insert(user);

      const res = await request(app).put("/users/1/image");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(1);
    });

    it("should return empty with 404 status when the user's id does not exist", async () => {
      const userId = faker.random.number();

      const res = await request(app).put(`/users/${userId}/image`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
