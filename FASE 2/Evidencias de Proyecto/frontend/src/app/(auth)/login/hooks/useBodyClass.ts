import { useEffect } from "react";

export function useBodyClass(additionalClasses?: string[]) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const bodyClass = "servigenman-login";
    const htmlClass = "servigenman-login-root";
    const allClasses = [bodyClass, ...(additionalClasses || [])];

    allClasses.forEach((cls) => document.body.classList.add(cls));
    document.documentElement.classList.add(htmlClass);

    return () => {
      allClasses.forEach((cls) => document.body.classList.remove(cls));
      document.documentElement.classList.remove(htmlClass);
    };
  }, [additionalClasses]);
}
