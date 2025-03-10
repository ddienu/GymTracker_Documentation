//Method to load the section from the components directory
function loadSection(page) {
  fetch(`/components/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    })
    .catch((error) => console.error("Error al cargar la sección:", error));
}

//Method to validate the passwords
function validatePassword(password, confirmPassword){
  if( password === confirmPassword) {
    document.getElementById("signup-password").setCustomValidity("");
    document.getElementById("confirmPassword").setCustomValidity("");
    return true;
  }else{
    document.getElementById("signup-password").setCustomValidity("Las contraseñas no coinciden");
    document.getElementById("confirmPassword").setCustomValidity("Las contraseñas no coinciden");
    return false;
  }
};

function sweetAlertSuccess(message, windowLocation){
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

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const section = this.getAttribute("href").substring(1);
    loadSection(section);
    window.history.pushState({}, "", `#${section}`);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#SignInAncor").forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      const section = this.getAttribute("href").substring(1);
      loadSection(section);
      window.history.pushState({}, "", `#${section}`);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#RegisterAncor").forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      const section = this.getAttribute("href").substring(1);
      loadSection(section);
      window.history.pushState({}, "", `#${section}`);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#content").addEventListener("input", function (event) {
      const usernameElement = document.querySelector("#username");
      const passwordElement = document.querySelector("#password");
      if (usernameElement) {
        if (usernameElement.value.trim() === "") {
          usernameElement.setCustomValidity("El campo de usuario no puede estar vacio");
        } else {
          usernameElement.setCustomValidity("");
        }
      }

      if (passwordElement) {
        if (passwordElement.value.trim() === "") {
          passwordElement.setCustomValidity("El campo de contraseña no puede estar vacio");
        } else {
          passwordElement.setCustomValidity("");
        }
      }

      if (usernameElement && passwordElement) {
        if (usernameElement.value.trim() != "" && passwordElement.value.trim() != "") {
          if (event.target.matches("#js-sign-in-button")) {
            event.preventDefault();
            sweetAlertSuccess("Iniciando sesión", "#index");
          }
        }
      }
    });
});
function openPopup(){
  window.open(
    '../components/termsAndConditions.html', 
    'Términos y condiciones', 
    'width=600,height=400,top=100,left=100,resizable=no'
  );
};

// Event to validate passwords
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector("#content").addEventListener('input', function(event) {
    const signupPassword = document.querySelector("#signup-password").value;
    const confirmPasswordElement = document.querySelector("#confirmPassword").value;
    if( signupPassword && confirmPasswordElement){
      if( validatePassword(signupPassword, confirmPasswordElement) ) { 
        document.querySelector("#signup-button").addEventListener("click", function(event) {
          event.preventDefault();
          sweetAlertSuccess("Cuenta creada exitosamente", '#index');
        })
      }
    }
    })
  });
document.addEventListener("DOMContentLoaded", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
window.addEventListener("popstate", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
