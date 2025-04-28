const routes: Record<string, any> = {
   "": "<landing-page-component></landing-page-component>",
   "instaff": "<home-component></home-component>",
   "employee-list": "<employee-list-component></employee-list-component>",
   "employee-filter-roles": "<employee-filter-roles-component></employee-filter-roles-component>",
   "employee-detail": "<employee-detail-component></employee-detail-component>",
   "employee-edit": "<employee-edit-component></employee-edit-component>",
   "role-list": "<role-list-component></role-list-component>",
   "manager-list": "<manager-list-component></manager-list-component>",
   "shift-list": "<shift-list-component></shift-list-component>",
   "shift-detail": "<shift-detail-component></shift-detail-component>",
   "add-employee": "<add-employee-component></add-employee-component>",
   "add-shift": "<add-shift-component></add-shift-component>",
   "edit-shift": "<edit-shift-component></edit-shift-component>",
   "shift-confirmation": "<shift-confirmation-component></shift-confirmation-component>",
}

function parseHash() {
   const [path, queryString] = location.hash.replace("#/", "").split("?")
   const params = new URLSearchParams(queryString || "")
   return { path, params }
}

export function navigate() {
   const { path, params } = parseHash()
   console.log("Navigating to path:", path, "with params:", Object.fromEntries(params))

   const app = document.querySelector("#app")
   if (!app) return

   app.innerHTML = ""

   const content = routes[path] || routes[""]
   app.innerHTML = content

   const firstChild = app.firstElementChild as HTMLElement
   if (!firstChild) return

   if (path === "shift-confirmation" && params.has("assignmentId")) {
      firstChild.setAttribute("assignment-id", params.get("assignmentId")!)
      console.log(params);
   }
}

window.addEventListener("load", navigate)
window.addEventListener("hashchange", navigate)