export const isRunningStandalone = () => {
    return (window.matchMedia('(display-mode: minimal-ui)').matches);
}