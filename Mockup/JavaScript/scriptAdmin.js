function loadSectionAdmin(page) {
  fetch(`/componentsAdmin/${page}.html`)
    .then((response) => response.text())
    .then((html) => (document.getElementById("admin-content").innerHTML = html))
    .catch((error) => console.error("Error al cargar la sección:", error));
}

function loadSectionAdminTarget(role, page) {
  history.pushState({ role, page }, "", `#${role}/${page}`);
  fetch(`/componentsAdmin/${role}/${page}.html`)
    .then((response) => response.text())
    .then((html) => (document.getElementById("admin-content").innerHTML = html))
    .catch((error) => console.error("Error al cargar la sección:", error));
}

//Alerta cuando es satisfactorio
function sweetAlertSuccess(message, windowLocation) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 1500,
  }).then(() => {
    window.location.href = windowLocation;
  });
}

//Alerta para decisión
async function sweetAlertDecition(message) {
  const result = await Swal.fire({
    title: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "No",
  });

  return result.isConfirmed;
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

  if (moreInformationBtn) {
    moreInformationBtn.addEventListener("click", function (event) {
      event.preventDefault();
      loadSectionAdminTarget("clients", "moreInformation");
    });
  }

  //Evento para mostrar el formulario para añadir un nuevo cliente
  const addNewClientBtn = document.querySelector("#new-client");

  if (addNewClientBtn) {
    addNewClientBtn.addEventListener("click", function (event) {
      event.preventDefault();
      sweetAlertDecition("¿Deseas agregar un nuevo cliente?").then((result) => {
        console.log(result);
        if (result) {
          loadSectionAdminTarget("clients", "addClient");
        }
      });
    });
  }

  //Evento para guardar un nuevo cliente
  const newClientForm = document.querySelector("#new-client-form");
  const createClientBtn = document.querySelector("#create-client-button");

  if (newClientForm && createClientBtn) {
    createClientBtn.addEventListener("click", function (event) {
      event.preventDefault();
      if (newClientForm.reportValidity()) {
        sweetAlertSuccess("Cliente creado con exito", "#clients");
        setTimeout(function () {
          const newClientItem = document.createElement("li");
          newClientItem.classList.add(
            "flex",
            "items-center",
            "p-4",
            "hover:bg-gray-50",
            "transition"
          );

          newClientItem.innerHTML = `
            <img src="../assets/male-client.svg" alt="Cliente" class="w-12 h-12 rounded-full">
            <div class="ml-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Juan Gómez</h3>
                <p><span class="font-bold">Plan:</span></p>
                <p class="flex"><span class="font-bold">Estado: </span> Activo<span class="flex items-center"><img src="../assets/active-icon.svg" alt="Icono cliente activo" class="h-5 w-5"></span></p>
            </div>
            <button class="bg-blue-600 text-[#E6ED07] px-4 py-2 rounded-lg hover:bg-blue-700 transition hover:scale-105 font-semibold">
                Más información
            </button>
            `;

          // Agregar el nuevo cliente a la lista
          clientList.appendChild(newClientItem);
        }, 1600);
      }
    });
  }

  //Evento para editar información del cliente
  const updateClientBtn = document.querySelector("#update-client-btn");

  if (updateClientBtn) {
    updateClientBtn.addEventListener("click", function (event) {
      event.preventDefault();
      //Lógica para editar información del cliente
      sweetAlertDecition("¿Desea editar la información del cliente?").then(
        (response) => {
          if (response) {
            loadSectionAdminTarget("clients", "updateClient");
          }
        }
      );
    });
  }

  //Evento para confirmar la edición de información del cliente
  const updatedClientInfo = document.querySelector("#updated-client-btn");
  const updatedClientInfoForm = document.querySelector("#update-client-form");
  const clientEmailUpdated = document.querySelector("#client-email-value");

  if (updatedClientInfo) {
    clientEmailUpdated.addEventListener("input", function () {
      const emailValue = clientEmailUpdated.value;
      updatedClientInfo.addEventListener("click", function (event) {
        event.preventDefault();
        if (updatedClientInfoForm.reportValidity()) {
          sweetAlertDecition("¿Deseas actualizar la información?").then(
            (response) => {
              if (response) {
                sweetAlertSuccess(
                  "Información del cliente actualizada",
                  "#clients/moreInformation"
                );
                setTimeout(function () {
                  const clientEmail = document.querySelector("#client-email");
                  clientEmail.childNodes[1].textContent =
                    " " + emailValue.toString();
                }, 1650);
              }
            }
          );
        }
      });
    });
  }

  //Evento para eliminar cliente "Desactivar"
  const deactivateButton = document.querySelector("#deactivate-client-btn");

  if (deactivateButton) {
    deactivateButton.addEventListener("click", function (event) {
      event.preventDefault();
      sweetAlertDecition("¿Deseas eliminar el cliente?").then((response) => {
        if (response) {
          sweetAlertSuccess("Cliente eliminado correctamente", "#clients");
          setTimeout(function () {
            const statusClientIcon = document.querySelector("#status-client");
            const statusClientDescription = document.querySelector(
              "#status-cliente-desc"
            );
            if (statusClientIcon) {
              statusClientDescription.childNodes[2].textContent = "Inactivo";
              statusClientIcon.src = "../assets/inactive-icon.svg";
            }
          }, 1600);
        }
      });
    });
  }

  //Evento para mostrar la alerta al administrador si desea añadir una nueva rutina
  const addRoutineBtn = document.querySelector("#add-routine-btn");

  if (addRoutineBtn) {
    addRoutineBtn.addEventListener("click", function (event) {
      event.preventDefault();
      sweetAlertDecition("¿Deseas añadir una nueva rutina al cliente?").then(
        (response) => {
          if (response) {
            loadSectionAdminTarget("clients", "addRoutine");
          }
        }
      );
    });
  }

  //Eventos para añadir rutina al cliente
  const routineDay = document.querySelector("#routine-day-selected");
  const routineCategory = document.querySelector("#routine-category");
  const saveRoutineBtn = document.querySelector("#save-routine-btn");
  const addRoutineForm = document.querySelector("#add-routine-form");
  const routineDificulty = document.querySelector("#routine-dificulty");
  const exerciseName = document.querySelector("#exercise-name");
  const exerciseSetsNumber = document.querySelector("#sets-number");
  const exerciseRepsNumber = document.querySelector("#reps-number");

  if (saveRoutineBtn) {
    saveRoutineBtn.addEventListener("click", function (event) {
      event.preventDefault();
      if ( exerciseName.value != "" && exerciseSetsNumber.value != "" && exerciseRepsNumber.value != "") {
        sweetAlertDecition("¿Desea guardar la nueva rutina?").then(
          (response) => {
            if (response) {
              sweetAlertSuccess(
                "Rutina creada con exito",
                "#clients/clientRoutines"
              );
              setTimeout(function (e) {
                const addRoutineItem = document.createElement("div");
                addRoutineItem.classList.add(
                  "bg-red-50",
                  "p-4",
                  "rounded-lg",
                  "shadow",
                  "mb-4",
                  "mt-4",
                  "flex",
                  "justify-between",
                  "items-center"
                );

                let exercisesHTML = "<ul class='mt-2 text-gray-700'>";
                exercisesHTML += `<li class="ml-6 list-disc">${exerciseName.value} - ${exerciseSetsNumber.value} series x ${exerciseRepsNumber.value} repeticiones</li>`;
                exercisesHTML += "</ul>";

                let colorText;
                if (routineDificulty.value == "Principiante") {
                  colorText = "text-green-400";
                } else if (routineDificulty.value == "Intermedio") {
                  colorText = "text-yellow-400";
                } else {
                  colorText = "text-red-400";
                }

                const routineContent = document.createElement("div");
                routineContent.classList.add("flex-1"); 
                routineContent.innerHTML = `
                  <h3 class="text-xl font-semibold text-red-700">${routineDay.value} - ${routineCategory.value}</h3>
                  <h3 class="text-lg font-semibold ${colorText}">Dificultad: ${routineDificulty.value}</h3>
                  ${exercisesHTML}
                `;

                const buttonsContainer = document.createElement("div");
                buttonsContainer.classList.add("flex", "gap-2");

                const editButton = document.createElement("button");
                editButton.classList.add(
                  "py-2",
                  "px-4",
                  "text-sm",
                  "text-white",
                  "bg-yellow-500",
                  "hover:bg-yellow-700",
                  "hover:scale-105",
                  "rounded-lg"
                );
                editButton.textContent = "Editar";

                const deleteButton = document.createElement("button");
                deleteButton.classList.add(
                  "py-2",
                  "px-4",
                  "text-sm",
                  "text-white",
                  "bg-red-700",
                  "hover:bg-red-800",
                  "hover:scale-105",
                  "rounded-lg"
                );
                deleteButton.textContent = "Eliminar";

                buttonsContainer.appendChild(editButton);
                buttonsContainer.appendChild(deleteButton);

                addRoutineItem.appendChild(routineContent);
                addRoutineItem.appendChild(buttonsContainer);

                routineList.appendChild(addRoutineItem);
              }, 1650);
            }
          }
        );
      } else {
        if( exerciseName.value == ""){
          exerciseName.setCustomValidity("Este campo no puede estar vacío");
        }
        if( exerciseRepsNumber.value == ""){
          exerciseRepsNumber.setCustomValidity("Este campo no puede estar vacío");
        }else {
          exerciseSetsNumber.setCustomValidity("Este campo no puede estar vacío");
        }
        addRoutineForm.reportValidity();
      }
    });
  }

  //Eventos para editar la rutina del cliente

  //Eventos para eliminar la rutina del cliente
  const eraseRoutineBtn = document.querySelector("#erase-routine");

  if( eraseRoutineBtn ){
    eraseRoutineBtn.addEventListener("click", function(event){
      event.preventDefault();
      sweetAlertDecition("¿Desea eliminar la rutina?").then( (response) => {
        if(response){
          sweetAlertSuccess("Rutina eliminada correctamente", "#clients/clientRoutines");
          setTimeout(function(){
            const routineToRemove = document.querySelector("#routine-to-erase");
            routineToRemove.parentNode.removeChild(routineToRemove);
          }, 1650);
        }
      });
    });
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
