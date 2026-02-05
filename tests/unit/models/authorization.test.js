import { InternalServerError } from "infra/errors.js";
import authorization from "models/authorization.js";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.can(createUser);
      }).toThrow(InternalServerError);
    });

    test("with unknow `feature`", () => {
      const createUser = {
        features: [],
      };

      expect(() => {
        authorization.can(createUser, "unknow:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid `user` and know `feature`", () => {
      const createUser = {
        features: ["create:user"],
      };

      expect(authorization.can(createUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.filterOutput(createUser);
      }).toThrow(InternalServerError);
    });

    test("with unknow `feature`", () => {
      const createUser = {
        features: [],
      };

      expect(() => {
        authorization.filterOutput(createUser, "unknow:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid `user`, know `feature` but no resource", () => {
      const createUser = {
        features: ["read:user"],
      };

      expect(() => {
        authorization.filterOutput(createUser, "read:user");
      }).toThrow(InternalServerError);
    });

    test("with valid `user`, know `feature` and `resource`", () => {
      const createUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
        email: "resource@resource.com",
        password: "resource",
      };

      const results = authorization.filterOutput(
        createUser,
        "read:user",
        resource,
      );

      expect(results).toEqual({
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      });
    });
  });
});
