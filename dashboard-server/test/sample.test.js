const request = require("supertest"); // Import supertest
const express = require("express"); // Import express
const nock = require("nock");

// Create a mock app for testing
const app = express();

// Import the route you want to test
const router = require("../routes/offcial-website-server.routes"); // Update with the correct path

// Use the router in the app
app.use(router);

describe("Express Route Test", () => {
  it("should return 'OK' for GET /test", async () => {
    const res = await request(app).get("/test"); // Perform a GET request to /test
    expect(res.statusCode).toEqual(200); // Expect status 200 (OK)
    expect(res.body).toEqual("Hello, world!"); // Expect the response body to be "OK"
  });
});

// Load fixture data
const fixtureData = require("../fixtures/sampleData.json");

describe("Express Route with Intercept and Fixture", () => {
  // Example of an intercept using nock
  beforeEach(() => {
    // Intercept external API request (e.g., to http://localhost:4000/all_properties)
    nock("http://localhost:4000") // Base URL of the intercepted request
      .get("/all_properties") // Intercepts a GET request to /all_properties
      .reply(200, fixtureData); // Responds with fixtureData from the fixture file
  });

  afterEach(() => {
    // Clean up nock after each test to avoid interference between tests
    nock.cleanAll();
  });

  it("should test GET /test with intercepted external API call", async () => {
    // Test your /test endpoint
    const res = await request(app).get("/test");
    expect(res.statusCode).toEqual(200); // Test for a successful status
    expect(res.body).toEqual("OK"); // Test the response body for /test

    // Test the intercepted /all_properties endpoint
    const externalApiCall = await request(app).get("/all_properties");
    expect(externalApiCall.statusCode).toEqual(200); // Expect a successful status code for the external API call
    expect(externalApiCall.body).toEqual(fixtureData); // Check if the intercepted API returns the fixture data
  });
});
