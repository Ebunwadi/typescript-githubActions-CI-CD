import supertest from "supertest";
import User from "../models/User";
import server from '../server'

const email: any = "teteess@example.com"
const userInput = {
  email,
  userName: "Jansets Doe",
     password: "Password123",
  confirmPassword: "Password123",
};

const userPayload = {
    "status": "success",
  "data": {
    "name": userInput.userName,
    "email": email
  }
}

describe("user", () => {
  // user registration
 afterAll(async () => {
   const user = await User.findOne({ email: email })
   await user?.deleteOne()
  });
  describe("user registration", () => {
    describe("given the username and password are valid", () => {
      it("should return the user payload", async () => {
        // const createUserServiceMock = jest
        //   .spyOn(UserService, "createUser")
        //   // @ts-ignore
        //   .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(server)
          .post("/api/users/signup")
          .send(userInput);

        expect(statusCode).toBe(200);

        expect(body).toEqual(userPayload);

        // expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      }, 60000);
    })
  })
});