export const logOutEvent = () => {
    const loginList = document.getElementById("loginList");

    if (loginList.textContent === "logout") {
        loginList.addEventListener("click", () => {
            window.localStorage.removeItem("token");
            window.location.href = "index.html";
        })
    }
}