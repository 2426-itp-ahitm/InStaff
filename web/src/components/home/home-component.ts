import { html, render } from "lit-html";

const dashboardTemplate = (handleClick) => {
   const cards = [
      {
         title: "Add Role",
         description: "Add new roles",
         icon: "➕",
         link: "#/add-role"
      },
      {
         title: "Add Shift",
         description: "Add new shifts",
         icon: "➕",
         link: "#/add-shift"
      },
      {
         title: "Edit Employees",
         description: "Edit employee details",
         icon: "👤",
         link: "#/edit-employees"
      },
      {
         title: "Employee List",
         description: "View all employees",
         icon: "👥",
         link: "#/employee-list"
      },
      {
         title: "Calendar",
         description: "Check schedules",
         icon: "📅",
         link: "#/shift-list"
      },
      {
         title: "Message Employees",
         description: "Communicate with employees",
         icon: "🗣️",
         link: "#/message-employees"
      },
   ];

   const cardTemplates = cards.map(
      (card) => html`


      <div class="">
         <div class="card" style="min-width: 20vw" @click="${() => handleClick(card.link)}">
            <div class="card-content">
               <div class="content">
                  <div class="is-flex is-align-items-bottom" style="">   
                     <p class="title ml-auto mr-2">${card.icon}</p>
                     <p class="title mr-auto">${card.title}</p>
                  </div>
                  <p class="subtitle">${card.description}</p>
               </div>
            </a>
         </div>
      </div>
      `
   );

   return html`
   <div class="container has-text-centered mb-6 mt-6">
      <h1 class="title is-2">Alexander's Company</h1>
      <p class="subtitle is-4">Manager: Alexander Hahn</p>
   </div>
   
   <div class="grid-container">
      ${cardTemplates}
   </div>
   `;
};

class HomeComponent extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   async connectedCallback() {
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      const handleClick = (link) => {
         window.location.href = link;
      };

      render(dashboardTemplate(handleClick), this.shadowRoot);
   }
}

customElements.define("home-component", HomeComponent);