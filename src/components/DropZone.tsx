import React, { useCallback, useEffect, useRef, useState } from "react";

export interface DropZoneProps {
  onDragStateChange?: (isDragActive: boolean) => void;
  onDrag?: () => void;
  onDragIn?: () => void;
  onDragOut?: () => void;
  onDrop?: () => void;
  onFilesDrop?: (files: File[]) => void;
  children?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = React.memo(
  ({
    onDragStateChange,
    onFilesDrop,
    onDrag,
    onDragIn,
    onDragOut,
    onDrop,
    children,
  }) => {
    // Create state to keep track when dropzone is active/non-active:
    const [isDragActive, setIsDragActive] = useState(false);

    // Prepare ref for dropzone element:
    const dropZoneRef = useRef<null | HTMLDivElement>(null);

    // Create helper method to map file list to array of files:
    const mapFileListToArray = (files: FileList) => {
      const array = [];

      for (let i = 0; i < files.length; i++) {
        array.push(files.item(i));
      }

      return array;
    };

    useEffect(() => {
      onDragStateChange?.(isDragActive);
    }, [isDragActive]);

    // Attach listeners to dropzone on mount:
    useEffect(() => {
      const tempZoneRef = dropZoneRef?.current;
      if (tempZoneRef) {
        tempZoneRef.addEventListener("dragenter", handleDragIn);
        tempZoneRef.addEventListener("dragleave", handleDragOut);
        tempZoneRef.addEventListener("dragover", handleDrag);
        tempZoneRef.addEventListener("drop", handleDrop);
      }

      // Remove listeners from dropzone on unmount:
      return () => {
        tempZoneRef?.removeEventListener("dragenter", handleDragIn);
        tempZoneRef?.removeEventListener("dragleave", handleDragOut);
        tempZoneRef?.removeEventListener("dragover", handleDrag);
        tempZoneRef?.removeEventListener("drop", handleDrop);
      };
    }, []);

    // Create handler for dragenter event:
    const handleDragIn = useCallback(
      (event: DragEvent) => {
        // Prevent default events:
        event.preventDefault();
        event.stopPropagation();
        // Invoke any optional method passed as "onDragIn()":
        onDragIn?.();

        // Check if there are files dragging over the dropzone:
        if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
          // If so, set active state to "true":
          setIsDragActive(true);
        }
      },
      [onDragIn]
    );

    // Create handler for dragleave event:
    const handleDragOut = useCallback(
      (event: DragEvent) => {
        // Prevent default events:
        event.preventDefault();
        event.stopPropagation();
        // Invoke any optional method passed as "onDragOut()":
        onDragOut?.();

        // Set active state to "false":
        setIsDragActive(false);
      },
      [onDragOut]
    );

    // Create handler for dragover event:
    const handleDrag = useCallback(
      (event: DragEvent) => {
        // Prevent default events:
        event.preventDefault();
        event.stopPropagation();
        // Invoke any optional method passed as "onDrag()":
        onDrag?.();

        // Set active state to "true" if it is not active:
        if (!isDragActive) {
          setIsDragActive(true);
        }
      },
      [isDragActive, onDrag]
    );

    // Create handler for drop event:
    const handleDrop = useCallback(
      (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        // Prevent default events:

        // Set active state to false:
        setIsDragActive(false);
        // Invoke any optional method passed as "onDrop()":
        onDrop?.();

        // If there are any files dropped:
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
          const files = mapFileListToArray(event.dataTransfer.files) as File[];

          onFilesDrop?.(files);

          // Clear transfer data to prepare dropzone for another use:
          event.dataTransfer.clearData();
        }
      },
      [onDrop, onFilesDrop]
    );

    return <div ref={dropZoneRef}>{children}</div>;
  }
);

DropZone.displayName = "DropZone";
