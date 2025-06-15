import React from "react";
import { requireAuthUser } from "../../../api/server/auth";

async function TestWhoAmi() {
  const user = await requireAuthUser();
  console.log("User details:", user);

  return <div>TestWhoAmi</div>;
}

export default TestWhoAmi;
