function loadSection(page) {
    fetch(`/components/${page}.html`)
        .then(response => 
            response.text()
            )
        .then(html => {
            document.getElementById("content").innerHTML = html;
        })
        .catch(error => console.error("Error al cargar la sección:", error));
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); 
        const section = this.getAttribute('href').substring(1); 
        loadSection(section); 
        window.history.pushState({}, "", `#${section}`); 
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const section = window.location.hash.substring(1) || 'inicio';
    loadSection(section);
});

window.addEventListener("popstate", () => {
    const section = window.location.hash.substring(1) || 'inicio';
    loadSection(section);
});

