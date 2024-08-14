// @ts-nocheck
import { MouseEvent, useEffect } from "react";

/**
 * A hook that allows jumping to the source code in VSCode by clicking on an element with the Ctrl key pressed.
 */
export function useJumpToVscodeSource() {
  const handleClick = (event: MouseEvent) => {
    if (event.ctrlKey && event.button === 0) {
      event.preventDefault();
      const element = event.target;
      let sourceTarget;

      if ("_reactRootContainer" in element) {
        sourceTarget = element._reactRootContainer._internalRoot.current.child;
      }

      for (const key in element) {
        if (key.startsWith("__reactInternalInstance$")) {
          sourceTarget = element[key];
        }

        if (key.startsWith("__reactFiber")) {
          sourceTarget = element[key];
        }
      }

      const { _debugSource, _debugOwner } = sourceTarget;
      const source = _debugSource || (_debugOwner && _debugOwner._debugSource);
      const { fileName } = source;

      const linkA = document.createElement("a")
      linkA.href = `vscode://file/${fileName}`;

      linkA.click();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
