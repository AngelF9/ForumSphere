import { auth } from "../../Firebase"; // Import the initialized auth instance

export const sendAuthenticatedRequest = async () => {
  try {
    // Ensure user is signed in before attempting to get token
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    // Get the ID token for the currently signed-in user
    const idToken = await user.getIdToken(true);
    console.log("ID Token:", idToken);

    // Send a request to the backend with the ID token
    const response = await fetch("http://localhost:3001/api/protected-route", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Add any other data you want to send in the request
      }),
    });

    // Handle the response
    const responseData = await response.json();
    console.log("Response from backend:", responseData);
  } catch (error) {
    console.error("Error during authenticated request:", error);
  }
};
