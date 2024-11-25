import { html, render } from "lit-html";

const dashboardTemplate = () => {
   const cards = [
      {
         title: "Remove Shift",
         description: "Remove existing shifts",
         icon: "➖",
         action: () => alert("Navigating to Remove Shift"),
      },
      {
         title: "Add Shift",
         description: "Add new shifts",
         icon: "➕",
         action: () => alert("Navigating to Add Shift"),
      },
      {
         title: "Edit Employees",
         description: "Edit employee details",
         icon: "👤",
         action: () => alert("Navigating to Edit Employees"),
      },
      {
         title: "Employee List",
         description: "View all employees",
         icon: "👥",
         action: () => alert("Navigating to Employee List"),
      },
      {
         title: "Calendar",
         description: "Check schedules",
         icon: "📅",
         action: () => alert("Navigating to Calendar"),
      },
      {
         title: "Message Employees",
         description: "Communicate with employees",
         icon: "💬",
         action: () => alert("Navigating to Message Employees"),
      },
   ];

   const cardTemplates = cards.map(
      (card) => html`
         <div class="card" @click=${card.action}>
            <div class="icon">${card.icon}</div>
            <h3>${card.title}</h3>
            <p>${card.description}</p>
         </div>
      `
   );

   return html`
      <header>
         <h1>Alexander's Company</h1>
         <p class="manager">Manager: Alexander Hahn</p>
      </header>
      <main>
         <section class="dashboard">
            ${cardTemplates}
         </section>
      </main>
   `;
};

class HomeComponent extends HTMLElement {
   connectedCallback() {
      render(dashboardTemplate(), this);
   }
}

customElements.define("home-component", HomeComponent);
