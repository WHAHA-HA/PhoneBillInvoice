var UserController = require("./user.controller");
var expect    = require("chai").expect;

describe("UserController", function () {
  it("should have index", function () {
    expect(UserController.index).to.not.be.undefined;
  });
});
