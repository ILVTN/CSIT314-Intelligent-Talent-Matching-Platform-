function getLoggedInUser() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
    }
}

function protectPage(requiredRole) {
    const user = getLoggedInUser();

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        if (user.role === "candidate") {
            window.location.replace("candidate-dashboard.html");
        } else if (user.role === "employer") {
            window.location.replace("employer-dashboard.html");
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.replace("login.html");
        }
    }
}

function redirectIfAlreadyLoggedIn() {
    const user = getLoggedInUser();

    if (!user) {
        return;
    }

    if (user.role === "candidate") {
        window.location.replace("candidate-dashboard.html");
    } else if (user.role === "employer") {
        window.location.replace("employer-dashboard.html");
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("login.html");
}

window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});