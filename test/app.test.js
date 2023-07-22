const spotify = require("../controllers/spotify");
const request = require("supertest");
const express = require("express");

// artist route tests
describe("GET /spotify/artist", () => {
  const app = express();
  app.use("/", spotify);

  describe("given the id", () => {
    it("should retrun 200", async () => {
      const res = await request(app).get("/artist/06HL4z0CvFAxyc27GXpf02");
      expect(res.status).toBe(200);
    });

    it("should have json as content-type", async () => {
      const res = await request(app).get("/artist/06HL4z0CvFAxyc27GXpf02");
      expect(res.type).toBe("application/json");
    });

    it("should return a json object", async () => {
      const res = await request(app).get("/artist/06HL4z0CvFAxyc27GXpf02");
      expect(typeof res.body).toBe("object");
    });
  })

  describe("given an invalid id", () => {
    it("should return 400", async () => {
      const res = await request(app).get("/artist/06HL4z0CvFAxyc");
      expect(res.status).toBe(400);
    });
  })

});


