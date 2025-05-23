// client/src/utils/checkIfAdmin.js
import { getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const checkIfAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;

  const token = await getIdTokenResult(user, true);
  return !!token.claims.admin;
};
