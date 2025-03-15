function loadSectionAdmin(page){
    fetch(`/componentsAdmin/${page}.html`)
       .then(response => response.text())
       .then(html => document.getElementById("admin-content").innerHTML = html)
       .catch(error => console.error("Error al cargar la sección:", error));
}

function loadSectionAdminTarget(role, page){
  fetch(`/componentsAdmin/${role}/${page}.html`)
  .then(response => response.text())
  .then(html => document.getElementById("admin-content").innerHTML = html)
  .catch(error => console.error("Error al cargar la sección:", error));
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".nav-link")) {
      event.preventDefault();
      const section = event.target.getAttribute("href").substring(1);
      loadSectionAdmin(section);
      window.history.pushState({}, "", `#${section}`);
    }
  });

  const observer = new MutationObserver(() => {
    console.log("Nueva sección cargada. Asignando eventos.");
    attachEventListeners();
  });
  
  observer.observe(document.getElementById("admin-content"), {
    childList: true,
    subtree: true,
  });

  function attachEventListeners() {
    console.log("Eventos adjuntados");

    //Evento para obtener más información del cliente.
    const moreInformationBtn = document.querySelector("#more-information-client");

    if( moreInformationBtn ) {
        moreInformationBtn.addEventListener("click", function(event){
          event.preventDefault();
          loadSectionAdminTarget("clients", "moreInformation");
        });
    };

    //Evento para añadir un nuevo cliente
    const addNewClientBtn = document.querySelector("#new-client");

    if( addNewClientBtn ){
        addNewClientBtn.addEventListener("click", function(event) {
            event.preventDefault();
            //Lógica que se va a implementar para cuando el administrador de clic en el botón de añadir un nuevo cliente
        })
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const section = window.location.hash.substring(1) || "index";
    loadSectionAdmin(section);
  });
  
  // Manejar cambios de historial con popstate
  window.addEventListener("popstate", () => {
    const section = window.location.hash.substring(1) || "index";
    loadSectionAdmin(section);
  });
  