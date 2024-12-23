const routes: Record<string, any> = {
   "": "<h1>Welcome to the App!</h1>",
   "employee-list": "<employee-list-component></employee-list-component>",
   "employee-filter-roles": "<employee-filter-roles-component></employee-filter-roles-component>",
   "employee-detail": "<employee-detail-component></employee-detail-component>",
   "role-list": "<role-list-component></role-list-component>",
   "manager-list": "<manager-list-component></manager-list-component>",
   "shift-list": "<shift-list-component></shift-list-component>",
   "shift-detail": "<shift-detail-component></shift-detail-component>",
   "add-employee": "<add-employee-component></add-employee-component>",
   "add-shift": "<add-shift-component></add-shift-component>do",
   "edit-shift": "<edit-shift-component></edit-shift-component>",
};

export function navigate() {
   const path = location.hash.replace("#/", "");
   console.log("Navigating to path:", path);

   const app = document.querySelector("#app");
   if (!app) return;

   app.innerHTML = "";

   const content = routes[path] || routes[""];
   app.innerHTML = content;
}