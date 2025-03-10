function loadSection(page) {
  fetch(`/components/${page}.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    })
    .catch((error) => console.error("Error al cargar la sección:", error));
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
  document.body.addEventListener("click", function (event) {
    const usernameElement = document.querySelector("#username");
    const passwordElement = document.querySelector("#password");
    if( usernameElement.value.trim() === ""){
        usernameElement.setCustomValidity("El campo de usuario no puede estar vacio");
    }else{
        usernameElement.setCustomValidity("");
    }

    if( passwordElement.value.trim() === ""){
        passwordElement.setCustomValidity("El campo de contraseña no puede estar vacio");
    }else{
        passwordElement.setCustomValidity("");
    }
    
    if (usernameElement.value.trim() != "" && passwordElement.value.trim() != "") {
      if (event.target.matches("#js-sign-in-button")) {
        event.preventDefault();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Iniciando sesión",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
        }).then(() => {
          window.location.href = "#index";
        });
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
}
document.addEventListener("DOMContentLoaded", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
window.addEventListener("popstate", () => {
  const section = window.location.hash.substring(1) || "index";
  loadSection(section);
});
