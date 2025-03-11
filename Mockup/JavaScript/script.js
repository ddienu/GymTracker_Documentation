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
function validatePassword(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}

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
  document
    .querySelector("#content")
    .addEventListener("input", function (event) {
      const usernameElement = document.querySelector("#username");
      const passwordElement = document.querySelector("#password");
      if (usernameElement) {
        if (usernameElement.value.trim() === "") {
          usernameElement.setCustomValidity(
            "El campo de usuario no puede estar vacio"
          );
        } else {
          usernameElement.setCustomValidity("");
        }
      }

      if (passwordElement) {
        if (passwordElement.value.trim() === "") {
          passwordElement.setCustomValidity(
            "El campo de contraseña no puede estar vacio"
          );
        } else {
          passwordElement.setCustomValidity("");
        }
      }

      if (usernameElement && passwordElement) {
        if (
          usernameElement.value.trim() != "" &&
          passwordElement.value.trim() != ""
        ) {
          if (event.target.matches("#js-sign-in-button")) {
            event.preventDefault();
            sweetAlertSuccess("Iniciando sesión", "#index");
          }
        }
      }
    });
});
function openPopup() {
  window.open(
    "../components/termsAndConditions.html",
    "Términos y condiciones",
    "width=600,height=400,top=100,left=100,resizable=no"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const signupPassword = document.querySelector("#signup-password");
    const confirmPasswordElement = document.querySelector("#confirmPassword");
    const signupButton = document.querySelector("#signup-button");
    let patternValidation;
    let equalsPasswords;

    if (signupPassword) {
      signupPassword.addEventListener("input", function (event) {
        event.preventDefault();
        const pattern =
          /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        const patternValidation = pattern.test(signupPassword.value);
        signupPassword.setCustomValidity( patternValidation ? "" : "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial")
      });
    }

    if (confirmPasswordElement) {
      confirmPasswordElement.addEventListener("input", function (event) {
        event.preventDefault();
        const arePasswordsEquals = validatePassword(
          signupPassword.value,
          confirmPasswordElement.value
        );
        if (arePasswordsEquals) {
          equalsPasswords = true;
          confirmPasswordElement.setCustomValidity("");
        } else {
          equalsPasswords = false;
          confirmPasswordElement.setCustomValidity(
            "Las contraseñan no coinciden"
          );
        }
      });
    }

    
    signupButton.addEventListener("click", function () {
      if (patternValidation === true && equalsPasswords === true) {
        sweetAlertSuccess("Cuenta creada exitosamente", "#index");
        document.querySelector("#signup-form").addEventListener("submit", function(event) {
          event.preventDefault();
          window.history.replaceState({}, document.title, window.location.pathname);
        })
      }
    });
    
  }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
window.addEventListener("popstate", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
