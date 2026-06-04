function showPopup(title, message, onConfirm, showCancel = true) {
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupMessage").textContent = message;  

    const overlay = document.getElementById("popupOverlay");
    const confirmBtn = document.getElementById("popupConfirmBtn");
    const cancelBtn = document.getElementById("popupCancelBtn");

    cancelBtn.style.display = showCancel ? "inline-block" : "none"; 

    confirmBtn.onclick = function() {
        closePopup(); 
        if (typeof onConfirm === "function") {
            onConfirm();
        }
    };
    overlay.style.display = "flex";
} 

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none"; 
}