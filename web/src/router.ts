const routes: Record<string, any> = {
   "": "<h1>Welcome to the App!</h1>", // Default route when the hash is empty
   "employee-list": "<employee-list-component></employee-list-component>",
   "role-list": "<role-list-component></role-list-component>",
   "manager-list": "<manager-list-component></manager-list-component>",
};

export function navigate() {
   const path = location.hash.replace("#/", ""); // Remove "#/" from the hash
   console.log("Navigating to path:", path); // Debugging log to check path

   const app = document.querySelector("#app");
   if (!app) return;

   app.innerHTML = ""; // Clear the previous content

   // If there's no hash or an empty hash, render the default route
   const content = routes[path] || routes[""]; // Default to home if no path matches
   app.innerHTML = content; // Update the innerHTML with the correct content
}