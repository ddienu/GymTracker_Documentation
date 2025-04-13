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
            loadSectionAdminTarget("clients", "/routines/addRoutine");
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

  //Eventos para abrir la ventana de edición de la rutina del cliente
  const editRoutineBtn = document.querySelector("#edit-routine");

  if( editRoutineBtn ){
    editRoutineBtn.addEventListener("click", function(event){
      event.preventDefault();
      sweetAlertDecition("¿Deseas editar la rutina del cliente?").then(response => {
        if(response){
          loadSectionAdminTarget("clients", "routines/editRoutine");
        }
      })
    })
  }

  //Eventos para editar la información de la rutina del cliente
  const routineNameEdited = document.querySelector("#exercise-edited-name");
  const setsEditedNumber = document.querySelector("#sets-edited-number");
  const editRoutineButton = document.querySelector("#update-routine-btn")
  const editRoutineForm = document.querySelector("#edit-routine-form");

  if( editRoutineButton ){
    editRoutineButton.addEventListener("click", function(event){
      event.preventDefault();
      if( routineNameEdited.value!= "" && setsEditedNumber.value!= ""){
        sweetAlertDecition("¿Desea actualizar la rutina?").then( (response) => {
          if(response){
            sweetAlertSuccess("Rutina actualizada con éxito", "#clients/clientRoutines");
            setTimeout(function(){
              const exerciseToEdit = document.querySelector("#exercise-to-edit");
              exerciseToEdit.textContent = `${routineNameEdited.value} - ${setsEditedNumber.value}`;
            }, 1650);
          }
        }
      )}else{
        if( routineNameEdited.value == ""){
          routineNameEdited.setCustomValidity("Este campo no puede estar vacío");
        }
        if( setsEditedNumber.value == ""){
          setsEditedNumber.setCustomValidity("Este campo no puede estar vacío");
        }
        editRoutineForm.reportValidity();
      }
    })
  }

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

  //Eventos para crear un nuevo plan alimentario
  const createNutritionPlan = document.querySelector("#save-nutrition-btn");
  const mealTarget = document.querySelector("#meal-target");
  const mealDescription = document.querySelector("#meal-description");
  const nutritionPlanForm = document.querySelector("#add-nutrition-form");
  const nutritionHour = document.querySelector("#hour-target");

  if( createNutritionPlan ){
    createNutritionPlan.addEventListener("click", function(event){
      event.preventDefault();
      if( mealTarget.value!= "" && mealDescription.value!= ""){
        sweetAlertDecition("¿Desea guardar el plan alimentario?").then(response => {
          if( response ){
            sweetAlertSuccess("Plan guardado con éxito", "#clients/nutrition/clientNutritionPlans")
            setTimeout( function(e) {
              const addNutritionPlanItem = document.querySelector("#add-routine-item");
              const newItem = document.createElement("tr");
              newItem.classList.add("border-t");
              newItem.innerHTML = `
                <td class="py-2 px-4">${mealTarget.value}</td>
                <td class="py-2 px-4">${nutritionHour.value}</td>
                <td class="py-2 px-4">${mealDescription.value}</td>
                <td class="py-2 px-4">
                  <a class="px-4 py-2 text-sm text-center text-white bg-yellow-500 hover:bg-yellow-700 rounded-lg font-semibold hover:scale-105" href="">Editar</a>
                  <a class="px-4 py-2 text-sm text-center text-white bg-red-500 hover:bg-red-700 rounded-lg font-semibold hover:scale-105" href="" id="delete-nutrition-plan">Eliminar</a>
                </td>
            `
            addNutritionPlanItem.appendChild(newItem);
            }, 1650);
          }
        })
      }else{
        mealTarget.setCustomValidity("Este campo no puede ir vacio");
        nutritionPlanForm.reportValidity();
      }
    })
  }

  //Eventos para editar un plan alimentario
  const editNutritionPlanForm = document.querySelector("#edit-nutrition-form");
  const editedMeal = document.querySelector("#meal-edited-target");
  const editedHour = document.querySelector("#hour-edited-target");
  const editedDescription = document.querySelector("#meal-edited-description");
  const editedNutritionPlanBtn = document.querySelector("#save-edited-routine-btn");

  if( editedNutritionPlanBtn ){
    editedNutritionPlanBtn.addEventListener("click", function(event) {
      event.preventDefault();
      if( editedMeal.value!= "" && editedHour.value!= "" && editedDescription.value!= ""){ 
        sweetAlertDecition("¿Desea actualizar el plan alimentario?").then(response => {
          if(response){
            sweetAlertSuccess("Plan alimentario actualizado con éxito", "#clients/nutrition/clientNutritionPlans");
            setTimeout(function(){
              const nutritionPlanToEdit = document.querySelector("#nutrition-plan-to-delete");
              nutritionPlanToEdit.childNodes[1].textContent = editedMeal.value;
              nutritionPlanToEdit.childNodes[3].textContent = editedHour.value;
              nutritionPlanToEdit.childNodes[5].textContent = editedDescription.value;
            }, 1650);
          }
        })
      }
    })
  }

  //Eventos para eliminar un plan alimentario
  const eraseNutritionPlanBtn = document.querySelector("#delete-nutrition-plan");

  if( eraseNutritionPlanBtn ){
    eraseNutritionPlanBtn.addEventListener("click", function(event){
      event.preventDefault();
      sweetAlertDecition("¿Desea eliminar el plan alimentario?").then( (response) => {
        if(response){
          sweetAlertSuccess("Plan alimentario eliminado correctamente", "#clients/nutrition/clientNutritionPlans");
          setTimeout(function(){
            const nutritionPlanToRemove = document.querySelector("#nutrition-plan-to-delete");
            nutritionPlanToRemove.parentNode.removeChild(nutritionPlanToRemove);
          }, 1650);
        }
      });
    })
  }

  //Eventos para crear un nuevo plan de fisioterapia
  const physiotherapyForm = document.querySelector("#add-physiotherapy-form");
  const physiotherapyAddBtn = document.querySelector("#save-physiotherapy-plan");
  const physiotherapyDay = document.querySelector("#physiotherapy-day");
  const physiotherapyExercise = document.querySelector("#physiotherapy-exercise");
  const physiotherapyReps = document.querySelector("#physiotherapy-reps");
  const physiotherapyDuration = document.querySelector("#physiotherapy-duration");

  if( physiotherapyAddBtn ){
    physiotherapyAddBtn.addEventListener("click", function(event) {
      event.preventDefault();
      if( physiotherapyDay.value!= "" && physiotherapyExercise.value!= "" && physiotherapyReps.value!= "" && physiotherapyDuration.value!= ""){ 
        sweetAlertDecition("¿Desea guardar el plan de fisioterapia?").then(response => { 
          if( response ){
            sweetAlertSuccess("Plan de fisioterapia guardado con éxito", "#clients/physiotherapy/physiotherapyPlans");
            setTimeout( function(event) {
              const addPhysiotherapyItem = document.querySelector("#physiotherapy-to-add");
              const newItem = document.createElement("tr");
              newItem.classList.add("border-t");
              newItem.innerHTML = `
                        <td class="py-2 px-4">${physiotherapyDay.value}</td>
                        <td class="py-2 px-4">${physiotherapyExercise.value}</td>
                        <td class="py-2 px-4">${physiotherapyReps.value}</td>
                        <td class="py-2 px-4">${physiotherapyDuration.value} minutos</td>
                        <td class="py-2 px-4">
                            <a class="w-full px-4 py-2 text-sm text-center text-white bg-yellow-500 hover:bg-yellow-700 rounded-lg font-semibold hover:scale-105" href="">Editar</a>
                            <a class="w-full px-4 py-2 text-sm text-center text-white bg-red-500 hover:bg-red-700 rounded-lg font-semibold hover:scale-105" id="erase-physiotherapy" href="">Eliminar</a>
                        </td>
              `
              addPhysiotherapyItem.appendChild(newItem);
            }, 1650)
          }
        })
      }
    })
  }

  //Eventos para mostrar la pantalla de edición luego de la alerta

  const editPhysioterapyPlanBtn = document.querySelector("#edit-physiotherapy-plan");

  if( editPhysioterapyPlanBtn ){
    editPhysioterapyPlanBtn.addEventListener("click", function(event) { 
      event.preventDefault();
      sweetAlertDecition("¿Desea editar el plan?").then( response => {
        if( response ){
          loadSectionAdminTarget("clients", "physiotherapy/editPhysiotherapyPlan"); 
        }
      })
    })
  }
  
  //Eventos para editar un plan de fisioterapia
  const updatePhysiotherapyBtn = document.querySelector("#save-updated-physiotherapy-plan");
  const updatedPhysiotherapyDay = document.querySelector("#edited-physiotherapy-day");
  const updatedPhysiotherapyExercise = document.querySelector("#edited-physiotherapy-exercise");
  const updatedPhysiotherapyReps = document.querySelector("#edited-physiotherapy-reps");
  const editedPhysiotherapyDuration = document.querySelector("#edited-physiotherapy-duration");

  if( updatePhysiotherapyBtn ){
    updatePhysiotherapyBtn.addEventListener("click", function(event) {
      event.preventDefault();
      if( updatedPhysiotherapyDay.value != "" && updatedPhysiotherapyExercise.value != "" && updatedPhysiotherapyReps.value != "" && editedPhysiotherapyDuration.value != ""){
          sweetAlertDecition("¿Desea actualizar el plan de fisioterapia?").then(response => {
            if( response ){
              sweetAlertSuccess("Plan de fisioterapia actualizado con éxito", "#clients/physiotherapy/physiotherapyPlans");
              setTimeout(function(){
                const updatedPlan = document.querySelector("#physiotherapy-to-erase");
                updatedPlan.childNodes[1].textContent = updatedPhysiotherapyDay.value;
                updatedPlan.childNodes[3].textContent = updatedPhysiotherapyExercise.value;
                updatedPlan.childNodes[5].textContent = updatedPhysiotherapyReps.value;
                updatedPlan.childNodes[7].textContent = editedPhysiotherapyDuration.value + " minutos";
              }, 1650);
            }
          })
      } 
    })
  }

  //Eventos para eliminar un plan de fisioterapia
  const erasePhysiotherapyBtn = document.querySelector("#erase-physiotherapy");

  if( erasePhysiotherapyBtn ){
    erasePhysiotherapyBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Desea eliminar el plan de fisioterapia?").then( (response) => {
        if(response){
          sweetAlertSuccess("Plan de fisioterapia eliminado correctamente", "#clients/physiotherapy/physiotherapyPlans");
          setTimeout(function(){
            const itemToErase = document.querySelectorAll("#physiotherapy-to-erase");
            itemToErase.forEach(item => 
              item.parentNode.removeChild(item));
          }, 1650);
        }
      });
    })
  }

  //Eventos para cargar la vista de adición de cita con alerta
  const addAppointmentBtn = document.querySelector("#new-appointment-btn");

  if( addAppointmentBtn) {
    addAppointmentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Desea agregar una nueva cita?").then( response => {
        if( response ){
          loadSectionAdminTarget("clients", "appointment/addAppointment");
        }
      })
    })
  }

  //Eventos para agendar una nueva cita
  const appointmentWith = document.querySelector("#appointment-with");
  const appointmentDate = document.querySelector("#appointment-date");
  const appointmentHour = document.querySelector("#appointment-hour");
  const saveAppointmentBtn = document.querySelector("#save-appointment-btn");

  if( saveAppointmentBtn) {
    saveAppointmentBtn.addEventListener("click", function(event) {
      if(appointmentWith.value != "" &&  appointmentDate.value != "" && appointmentHour.value != ""){
        sweetAlertSuccess("La cita ha sido agendada correctamente", "#clients/appointment/appointmentList");
        setTimeout(function(){
          const newAppointmentTarget = document.querySelector("#appointment-to-add");
          const newAppointmentItem = document.createElement("li");
          newAppointmentItem.classList.add("p-4", "flex", "justify-between", "items-center", "bg-gray-50");
          newAppointmentItem.innerHTML = `
                <div>
                    <p class="text-lg font-semibold">${appointmentWith.value}</p>
                    <p class="text-gray-600">Fecha: ${appointmentDate.value} - Hora: ${appointmentHour.value}</p>
                </div>
                <div>
                    <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 hover:scale-105">Reagendar</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:scale-105" id="cancel-appointment">Cancelar</button>
                </div>
          `
          newAppointmentTarget.appendChild(newAppointmentItem);
        }, 1650);
      }
    })
  }

  //Eventos para abrir los la pantalla de reagendamiento de citas con alerta
  const rescheduleAppointmentBtn = document.querySelector("#reschedule-appointment");

  if( rescheduleAppointmentBtn ){
    rescheduleAppointmentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Deseas reagendar la cita?").then( response => {
        if( response ){
          loadSectionAdminTarget("clients", "appointment/rescheduleAppointment");
        }
      })
    })
  }
  //Eventos para reagendar la cita del cliente
  const rescheduledAppointmentBtn = document.querySelector("#save-appointment-btn-rescheduled");
  const appointmentDateRescheduled = document.querySelector("#appointment-date-rescheduled");
  const appointmentHourRescheduled = document.querySelector("#appointment-hour-rescheduled");
  const rescheduleAppointmentForm = document.querySelector("#reschedule-appointment-form");

  if( rescheduledAppointmentBtn ){
    rescheduledAppointmentBtn.addEventListener("click", function(event) {
      if( appointmentDateRescheduled.value != "" && appointmentHourRescheduled.value != ""){
        sweetAlertDecition("¿Desea reagendar la cita?").then( response => {
          if( response ){
            sweetAlertSuccess("La cita ha sido reagendada correctamente", "#clients/appointment/appointmentList");
            setTimeout(function(){
              const appointmentToReschedule = document.querySelector("#appointment-to-rescheduled");
              appointmentToReschedule.textContent = `
              Fecha: ${appointmentDateRescheduled.value} - Hora: ${appointmentHourRescheduled.value}
              `
            }, 1650)
          }
        })
      }else{
        if( appointmentDateRescheduled.value === ""){
          appointmentDateRescheduled.setCustomValidity("Este campo debe diligenciarse");
          appointmentDateRescheduled.setCustomValidity("");
        }
        if( appointmentHourRescheduled.value === ""){
          appointmentHourRescheduled.setCustomValidity("Este campo no puede estar vacío");
          appointmentDateRescheduled.setCustomValidity("");
        }
        rescheduleAppointmentForm.reportValidity();       
      }
    })
  }

  //Eventos para cancelar una cita del cliente
  const cancelAppointment = document.querySelector("#cancel-appointment");

  if( cancelAppointment ){
    cancelAppointment.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Deseas cancelar la cita?").then( response => {
        if( response ){
          sweetAlertSuccess("La cita ha sido cancelada satisfactoriamente", "#clients/appointment/appointmentList");
          setTimeout( function(event) {
            const appointmentToCancel = document.querySelector("#appointment-to-cancel");
            appointmentToCancel.parentNode.removeChild(appointmentToCancel);
          }, 1650)
        }
      })
    })
  }

  //Eventos para abrir la vista para agregar un nuevo pago
  const addPaymentBtn = document.querySelector("#new-payment-btn");

  if( addPaymentBtn){
    addPaymentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Desea agregar un nuevo pago?").then(response => {
        if( response ){
          loadSectionAdminTarget("clients", "paymentHistory/addNewPayment");
        }
      })
    })
  }

  //Eventos para agregar un nuevo pago.
  const savePaymentBtn = document.querySelector("#save-payment-btn");
  const paymentDate = document.querySelector("#payment-date");
  const paymentAmount = document.querySelector("#payment-amount");
  const paymentMethod = document.querySelector("#payment-method");
  const paymentPlan = document.querySelector("#payment-plan");

  if( savePaymentBtn ){
    savePaymentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      if( paymentDate.value != "" && paymentMethod.value != ""){
        sweetAlertDecition("¿Desea guardar el nuevo pago?").then(response => {
          if( response ){
            sweetAlertSuccess("El pago ha sido guardado correctamente", "#clients/paymentHistory/paymentHistory");
            setTimeout(function(event) {
              const addPaymentTarget = document.querySelector("#add-payment-target");
              const newPaymentItem = document.createElement("tr");
              const [date, time] = paymentDate.value.split("T");
              newPaymentItem.classList.add("bg-white","hover:bg-gray-50","text-black");
              const amountFormated = parseInt(paymentAmount.value);
              newPaymentItem.innerHTML = `
                <td class="px-4 py-3">${date} ${time}</td>
                <td class="px-4 py-3">$${amountFormated.toLocaleString('es-CO')}</td>
                <td class="px-4 py-3">${paymentMethod.value}</td>
                <td class="px-4 py-3">${paymentPlan.value}</td>
                <td class="px-4 py-3 text-green-600 font-medium">Pagado</td>
                <td>
                  <div class="flex justify-evenly">
                      <button class="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 font-semibold hover:scale-105 text-sm">Editar</button>
                      <button class="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 font-semibold hover:scale-105 text-sm" id="cancel-payment-btn">Anular</button>
                  </div>
                </td>
                `
                addPaymentTarget.appendChild(newPaymentItem);
            }, 1650);
          }
        })
      }
    })
  }

  //Eventos para abrir la vista de edición del pago.
  const editPaymentBtn = document.querySelector("#edit-payment-btn");

  if( editPaymentBtn ){
    editPaymentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Desea editar el pago?").then(response => {
        if( response ){
          loadSectionAdminTarget("clients", "paymentHistory/editPayment");
        }
      })
    })
  }

  //Eventos para editar el pago
  const editedPaymentMethod = document.querySelector("#payment-method-edited");
  const editedStatusPayment = document.querySelector("#payment-status-edited");
  const editedPaymentBtn = document.querySelector("#save-edit-payment-btn");

  if( editedPaymentBtn ){
    editedPaymentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      if( editedPaymentMethod.value != "" && editedStatusPayment.value != ""){
        sweetAlertDecition("¿Desea guardar los cambios en el pago?").then(response => {
          if( response ){
            sweetAlertSuccess("Los cambios en el pago han sido guardados correctamente", "#clients/paymentHistory/paymentHistory");
            setTimeout(function(event) {
              const editedPaymentTarget = document.querySelector("#payment-to-update");              
              editedPaymentTarget.childNodes[5].textContent = editedPaymentMethod.value;
              editedPaymentTarget.childNodes[9].textContent = editedStatusPayment.value
              console.log(editedPaymentTarget.childNodes[5].textContent)
              console.log(editedPaymentTarget.childNodes[9].textContent)
              if( editedPaymentTarget.childNodes[9].textContent === "Rechazado"){
                editedPaymentTarget.childNodes[9].classList.add("text-red-600");
              }else if( editedPaymentTarget.childNodes[9].textContent === "Pendiente" ){
                editedPaymentTarget.childNodes[9].classList.add("text-yellow-600");
              }else{
                editedPaymentTarget.childNodes[9].classList.add("text-green-600");
              }
            }, 1650)
          }
        })
      }
    })
  }



  //Eventos para eliminar(anular) un pago
  const cancelPaymentBtn = document.querySelector("#cancel-payment-btn");

  if( cancelPaymentBtn ){
    cancelPaymentBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Desea anular el pago?").then(response => {
        if( response ){
          sweetAlertSuccess("El pago ha sido anulado satisfactoriamente", "#clients/paymentHistory/paymentHistory");
          setTimeout(function(event) {
            const paymentToCancelTarget = document.querySelector("#payment-to-modify");
            paymentToCancelTarget.textContent = "Anulado"
            paymentToCancelTarget.classList.replace('text-green-600', 'text-red-600')
          }, 1650)
        }
      })
    })
  }

  //EVENTOS DE TRAINER

  //Eventos para agregar un nuevo entrenador.
  const saveNewTrainerBtn = document.querySelector("#save-new-trainer");
  const newTrainerName = document.querySelector("#new-trainer-name");
  const newTrainerSpecialty = document.querySelector("#new-trainer-specialty");
  const newTrainerForm = document.querySelector("#new-trainer-form");

  if( saveNewTrainerBtn ){
    saveNewTrainerBtn.addEventListener("click", function(event) {
      console.log(newTrainerName.value)
      console.log(newTrainerSpecialty.value)
      event.preventDefault();
      if( newTrainerName.value !== "" && newTrainerSpecialty.value !== ""){
        sweetAlertDecition("¿Desea guardar el nuevo entrenador?").then(response => {
          if( response ){
            sweetAlertSuccess("El nuevo entrenador ha sido guardado con éxito", "#trainers/trainers")
            setTimeout(function(event) {
              const targetAddTrainer = document.querySelector("#target-add-trainer");
              const newItemTrainer = document.createElement("div");
              newItemTrainer.classList.add("bg-white", "shadow-xl", "rounded-2xl", "overflow-hidden", "transition-transform", "duration-300");
              const newTrainerNameInitials = newTrainerName.value.split(" ");
              newItemTrainer.innerHTML = `
              <div class="flex justify-center pt-6">
                <div class="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  ${newTrainerNameInitials[0].substring(0,1)}${newTrainerNameInitials[1].substring(0,1)}
                </div>
              </div>
              <div class="p-6 text-center">
                <h3 class="text-xl font-semibold mb-2">${newTrainerName.value}</h3>
                <p class="text-sm text-gray-600 mb-6">${newTrainerSpecialty.value}</p>
                <p class="flex justify-center text-sm" id="item-to-change-erase-trainer"><span class="font-bold">Estado: </span> Activo<span class="items-center"><img src="../assets/active-icon.svg" alt="Icono cliente activo" class="h-5 w-5" id="icon-to-change" ></span></p>
                <a class="bg-blue-600 text-white px-4 py-2 mt-6 rounded-lg hover:bg-blue-700 transition hover:scale-105 font-semibold hover:cursor-pointer block w-2/4 mx-auto" href="#trainers/moreInformation">
                 Más información
                </a>
              </div>
              `
              targetAddTrainer.appendChild(newItemTrainer);
            }, 1650)
          }
        })
      }else{
        if( newTrainerName.value === ""){
          // newTrainerName.setCustomValidity("Este campo no puede estar vacio");
          newTrainerForm.reportValidity();
        }
        if( newTrainerSpecialty.value === "" ){
          newTrainerSpecialty.setCustomValidity("Completa este campo");
          newTrainerForm.reportValidity();
        }    
        newTrainerForm.reportValidity();   
      }
    })
  }

  //Evento para abrir la vista de edición de entrenador
  const editTrainerBtn = document.querySelector("#edit-trainer");

  if( editTrainerBtn ){
    editTrainerBtn.addEventListener("click", function(event) {
      sweetAlertDecition("Desea editar la información del entrenador?").then(response => {
        if( response ){
          loadSectionAdminTarget("trainers", "editTrainer");
        }
      })
    })
  }

  //Eventos para editar el entrenador.
  const trainerEditedName = document.querySelector("#edit-trainer-name");
  const trainerEditedEmail = document.querySelector("#edit-trainer-email");
  const trainerEditedPhone = document.querySelector("#edit-trainer-phone");
  const trainerEditedSpecialty = document.querySelector("#edit-trainer-specialty");
  const trainerEditedExperience = document.querySelector("#edit-trainer-experience");
  const trainerEditedBiography = document.querySelector("#edit-trainer-bio");
  const saveEditedTrainerBtn = document.querySelector("#save-edit-trainer");

  if( saveEditedTrainerBtn ){
    saveEditedTrainerBtn.addEventListener("click", function(event){
      if( trainerEditedName.value !== "" && trainerEditedEmail.value !== "" && trainerEditedPhone.value !== "" && trainerEditedSpecialty.value !== "" && trainerEditedExperience.value !== "" && trainerEditedBiography.value !== ""){
        event.preventDefault();
        sweetAlertDecition("¿Desea editar la información del entrenador?").then(response => {
          if( response ){
            sweetAlertSuccess("La información del entrenador ha sido actualizada satisfactoriamente", "#trainers/moreInformation");
            setTimeout(function(event) {
              const initialsValueTarget = document.querySelector("#initials-to-edit-trainer");
              const nameValueTarget = document.querySelector("#name-to-edit-trainer");
              const emailValueTarget = document.querySelector("#email-to-edit-trainer");
              const phoneValueTarget = document.querySelector("#phone-to-edit-trainer");
              const experienceValueTarget = document.querySelector("#experience-to-edit-trainer");
              const specialtyValueTarget = document.querySelector("#specialty-to-edit-trainer");
              const biographyValueTarget = document.querySelector("#bio-to-edit-trainer");
              const initialsNameSplit = trainerEditedName.value.split(" ");
              
              initialsValueTarget.textContent = initialsNameSplit[0].substring(0,1)+initialsNameSplit[1].substring(0,1);
              nameValueTarget.textContent = " "+trainerEditedName.value;
              emailValueTarget.childNodes[1].textContent = " "+trainerEditedEmail.value;
              phoneValueTarget.childNodes[1].textContent = " "+trainerEditedPhone.value;
              experienceValueTarget.childNodes[1].textContent = " "+trainerEditedExperience.value;
              specialtyValueTarget.childNodes[1].textContent = " "+trainerEditedSpecialty.value;
              biographyValueTarget.childNodes[1].textContent = " "+trainerEditedBiography.value;
            }, 1650)
          }
        })
      }
    })
  }

  //Eventos para eliminar un entrenador
  const eraseTrainerBtn = document.querySelector("#erase-trainer");

  if( eraseTrainerBtn ){
    eraseTrainerBtn.addEventListener("click", function(event) {
      event.preventDefault();
      sweetAlertDecition("¿Está seguro que desea eliminar el entrenador?").then( response => {
        if( response ){
          sweetAlertSuccess("El entrenador ha sido eliminado satisfactoriamente", "#trainers/trainers");
          setTimeout(function() {
            const itemToChange = document.querySelector("#item-to-change-erase-trainer"); 
            const iconToChange = document.querySelector("#icon-to-change");
            itemToChange.childNodes[1].textContent = "Inactivo"
            iconToChange.src = "../assets/inactive-icon.svg";
          }, 1650)
        }
      })
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
