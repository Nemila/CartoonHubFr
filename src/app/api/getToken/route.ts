import axios from "axios";
import random from "crypto";
import { NextRequest } from "next/server";

let csrfToken: undefined | string = "";
let sessionToken: undefined | string = "";
let lastGenerated = 0;
const TOKEN_LIFETIME = 12 * 60 * 60 * 1000;

const setCsrf = async (force: boolean) => {
  const currentTime = Date.now();
  if (currentTime - lastGenerated > TOKEN_LIFETIME || force) {
    console.log("Changing...");
    try {
      const randomEmail = `${random.randomInt(0, 999999999999)}@teleg.eu`;
      const randomUsername = `${random.randomInt(0, 999999999999)}`;

      const response = await axios.post(
        "https://darkiworld2.com/register",
        {
          email: randomEmail,
          username: randomUsername,
          password: "nigefu@teleg.eu",
          password_confirmation: "nigefu@teleg.eu",
        },
        { withCredentials: true },
      );

      csrfToken = response.headers["set-cookie"]
        ?.find((cookie) => cookie.startsWith("XSRF-TOKEN"))
        ?.split(";")[0]
        .split("=")[1];
      sessionToken = response.headers["set-cookie"]
        ?.find((cookie) => cookie.startsWith("darkiworld_session"))
        ?.split(";")[0]
        .split("=")[1];

      lastGenerated = currentTime;
      console.log("New token generated");
    } catch (error) {
      console.error("Error generating tokens:", (error as Error).message);
    }
  }
  return { xsrf: csrfToken, session: sessionToken };
};

export const GET = async (req: NextRequest) => {
  const force = req.nextUrl.searchParams.get("force");
  const tokens = await setCsrf(Boolean(force));
  return Response.json(tokens);
};
