// Método para cargar secciones dinámicamente
function loadSection(page) {
  fetch(`/components/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    })
    .catch((error) => console.error("Error al cargar la sección:", error));
}

// Método para validar contraseñas
function validatePassword(password, confirmPassword) {
  return password === confirmPassword;
}

// Mostrar alertas de éxito
function sweetAlertSuccess(message, windowLocation) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 2000,
  }).then(() => {
    window.location.href = windowLocation;
  });
}

// Mostrar alertas fallidas
function sweetAlertFailed(message, windowLocation) {
  Swal.fire({
    position: "center",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 2000,
  }).then(() => {
    window.location.href = windowLocation;
  });
}

// Delegación de eventos para los enlaces de navegación
document.addEventListener("click", function (event) {
  if (event.target.matches(".nav-link, #SignInAncor, #RegisterAncor")) {
    event.preventDefault();
    const section = event.target.getAttribute("href").substring(1);
    loadSection(section);
    window.history.pushState({}, "", `#${section}`);
  }
});

// MutationObserver para detectar cuando se carga nuevo contenido en #content
const observer = new MutationObserver(() => {
  console.log("Nueva sección cargada. Asignando eventos.");
  attachEventListeners();
});

observer.observe(document.getElementById("content"), {
  childList: true,
  subtree: true,
});

// Función para asignar eventos a elementos dinámicos
function attachEventListeners() {
  console.log("Eventos adjuntados");

  // Validación de contraseñas dentro del inicio de sesión
  document
    .getElementById("content")
    .addEventListener("input", function (event) {
      const usernameElement = document.querySelector("#username");
      const passwordElement = document.querySelector("#password");
      let permitLogin;
      if (usernameElement) {
        usernameElement.setCustomValidity(
          usernameElement.value.trim() === ""
            ? "El campo de usuario no puede estar vacío"
            : ""
        );
        permitLogin = usernameElement.value === "" ? false : true;
      }
      if (passwordElement) {
        passwordElement.setCustomValidity(
          passwordElement.value.trim() === ""
            ? "El campo de contraseña no puede estar vacío"
            : ""
        );
        permitLogin = passwordElement.value === "" ? false : true;
      }

      //Manejo del evento del botón de inicio de sesión
      const signInButton = document.querySelector("#js-sign-in-button");
      if (signInButton) {
        signInButton.addEventListener("click", function (e) {
          if (permitLogin) {
            sweetAlertSuccess("Iniciando sesión", "#index");
          }
        });
      }
    });

  // Manejo del formulario de registro y validaciones de la contraseña
  const signupPassword = document.querySelector("#signup-password");
  const confirmPasswordElement = document.querySelector("#confirmPassword");
  const signupButton = document.querySelector("#signup-button");
  const formElement = document.querySelector("#signup-form");

  //Valida que la contraseña cumpla con la expresión regular
  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      const patternValidation = pattern.test(signupPassword.value);
      signupPassword.setCustomValidity(
        patternValidation
          ? ""
          : "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial"
      );
      // formElement.reportValidity();
    });
  }

  //Valida que la confirmación de la contraseña sea igual a la ingresada.
  if (confirmPasswordElement) {
    confirmPasswordElement.addEventListener("input", function () {
      confirmPasswordElement.setCustomValidity(
        validatePassword(signupPassword.value, confirmPasswordElement.value)
          ? ""
          : "Las contraseñas no coinciden"
      );
    });
  }

  //Crea el evento en el botón de crear cuenta y muestra la alerta en caso de ser exitoso
  if (signupButton) {
    signupButton.addEventListener("click", function (event) {
      if (!signupPassword.checkValidity() || !confirmPasswordElement.checkValidity()) {
        event.preventDefault();
        formElement?.reportValidity();
      } else {
        event.preventDefault();
        sweetAlertSuccess("Cuenta creada exitosamente", "#profile");
        window.history.replaceState({},document.title,window.location.pathname);
      }
    });
  }

  //Manejo de reinicio de contraseña
  const resetPassword = document.querySelector("#reset-password");
  if (resetPassword) {
    resetPassword.addEventListener("click", function (event) {
      event.preventDefault();
      const email = document.querySelector("#email").value;
      const forgotPasswordForm = document.querySelector("#forgotpassword-form");
      if (forgotPasswordForm.reportValidity()) {
        if (email === "noexiste@noexiste.com") {
          sweetAlertFailed("El correo no existe", "#forgotPassword");
        } else {
          sweetAlertSuccess("Reiniciaste tu contraseña", "#index");
          window.history.replaceState({},document.title,window.location.pathname);
        }
      }
    });
  }

  //Manejo del botón para mostrar y ocultar contraseña en el registro.
  const showPasswordImage = document.querySelector("#lock-password");
  const passwordInput = document.querySelector("#signup-password");

  if (showPasswordImage) {
    showPasswordImage.addEventListener("click", function (event) {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
      if (showPasswordImage.src.endsWith("lockPassword.svg")) {
        showPasswordImage.src = "../assets/showPassword.svg";
        showPasswordImage.title = "Ocultar contraseña";
        showPasswordImage.id = "show-password";
      } else {
        showPasswordImage.src = "../assets/lockPassword.svg";
        showPasswordImage.title = "Mostrar contraseña";
        showPasswordImage.id = "lock-password";
      }
    });
  }

  //Manejo del formulario de registro de perfil
  const formButton = document.querySelector("#create-profile-button");
  const profileForm = document.querySelector("#profile-form");

  if(formButton) {
    formButton.addEventListener("click", function(event) {
      event.preventDefault();
      if( profileForm.reportValidity()){
        sweetAlertSuccess("Tu perfil ha sido creado exitosamente", "#GymTrackerAdmin");
        window.history.replaceState({},document.title,window.location.pathname);
        // window.location.href = "GymTrackerAdmin.html";
      }else{
        profileForm.reportValidity();
      }
    })
  }
}

//Función para mostrar el popup con los términos y condiciones
function openPopup() {
  window.open(
    "../components/termsAndConditions.html",
    "Términos y condiciones",
    "width=600,height=400,top=100,left=100,resizable=no"
  );
}

// Cargar la sección según la URL inicial
document.addEventListener("DOMContentLoaded", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});

// Manejar cambios de historial con popstate
window.addEventListener("popstate", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
