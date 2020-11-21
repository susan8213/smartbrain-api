require("dotenv").config();

const request = require("supertest");
const faker = require("faker");
const app = require("../app");

describe("Detector API", () => {
  describe("POST /detect/face", () => {
    it("should have detection result", async () => {
      const imageUrl = faker.image.imageUrl();

      const res = await request(app)
        .post("/detect/face")
        .send({ url: imageUrl });

      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeNull();
    });

    it("should return bad request when the url is not an image", async () => {
      const imageUrl = faker.internet.url();

      const res = await request(app)
        .post("/detect/face")
        .send({ url: imageUrl });

      expect(res.statusCode).toEqual(400);
      expect(res.body).not.toBeNull();
    });
  });
});
