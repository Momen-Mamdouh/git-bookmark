
  export const storageKey = "color-mode";
  const htmlEl = document.documentElement;

    const applyTheme = (theme) => {
        htmlEl.setAttribute("data-bs-theme", theme);
    };

    export const getSystemPreference = () =>{
        return  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    export const setTheme = (theme) => {
        localStorage.setItem(storageKey, theme);
        applyTheme(theme);
    };

    export const toggleMode = (toggleBtn)=>{
        toggleBtn.addEventListener("click", (e)=>{
            const currentEleChild = e.currentTarget.children[0];
            const isSun = currentEleChild.getAttribute("data-icon") === "sun";

            currentEleChild.setAttribute("data-icon", isSun ? "moon" : "sun");
            htmlEl.setAttribute("data-bs-theme", isSun ? "dark" : "light");
            setTheme( isSun ? "dark" : "light");

        });
    };


