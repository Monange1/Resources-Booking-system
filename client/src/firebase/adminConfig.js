// client/src/firebase/adminConfig.js

import { auth } from "./firebaseConfig";

// Function to check if the current user is an admin using Firebase custom claims
export const checkIfAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const idTokenResult = await user.getIdTokenResult();
    return !!idTokenResult.claims.admin; // true if 'admin' claim exists
  } catch (err) {
    console.error("Failed to check admin claim:", err);
    return false;
  }
};
