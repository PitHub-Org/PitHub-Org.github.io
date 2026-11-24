(() => {
    "use strict";

    const root = document.documentElement;
    const THEME_KEY = "pithub-theme";

    /* =========================================
       1. THEME INITIALIZATION
    ========================================= */

    const themeButtons = document.querySelectorAll(".theme-toggle");

    const preferredTheme = window.matchMedia(
        "(prefers-color-scheme: light)"
    ).matches ? "light" : "dark";

    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(THEME_KEY);

            return savedTheme === "light" || savedTheme === "dark"
                ? savedTheme
                : preferredTheme;
        } catch (error) {
            return preferredTheme;
        }
    }

    /* =========================================
       2. SET THEME
    ========================================= */

    function setTheme(theme, animate = false) {

        // Prevent invalid theme values
        if (theme !== "light" && theme !== "dark") {
            theme = "dark";
        }

        // Apply transition only for manual theme changes
        if (animate) {
            root.classList.add("theme-transition");
        } else {
            root.classList.remove("theme-transition");
        }

        // Apply theme before updating other elements
        root.dataset.theme = theme;

        // Update theme icons and accessibility labels
        themeButtons.forEach((button) => {

            const icon = button.querySelector(".theme-icon");

            if (icon) {
                icon.src = theme === "dark"
                    ? "/assets/logo/dark-mode.png"
                    : "/assets/logo/light-mode.png";
            }

            const label = theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode";

            button.setAttribute("aria-label", label);
            button.title = label;
        });
    }

    /* =========================================
       3. LOAD SAVED THEME
    ========================================= */

    const initialTheme = getSavedTheme();

    setTheme(initialTheme, false);

    /* =========================================
       4. THEME SWITCHING
    ========================================= */

    themeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const currentTheme = root.dataset.theme;

            const nextTheme = currentTheme === "dark"
                ? "light"
                : "dark";

            // Save selected theme
            try {
                localStorage.setItem(THEME_KEY, nextTheme);
            } catch (error) {
                console.warn("Unable to save theme preference.", error);
            }

            // Apply theme with smooth transition
            setTheme(nextTheme, true);

        });

    });

    /* =========================================
       5. SYNCHRONIZE THEME ACROSS TABS
    ========================================= */

    window.addEventListener("storage", (event) => {

        if (event.key === THEME_KEY) {

            const updatedTheme =
                event.newValue === "light" ? "light" : "dark";

            setTheme(updatedTheme, true);

        }

    });

    /* =========================================
       6. MOBILE NAVIGATION
    ========================================= */

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (menuButton && nav) {

        menuButton.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    }

})();