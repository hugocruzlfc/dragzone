import { useCallback, useState } from "react";
import { DropZone, FileList } from "./components";
import classNames from "classnames";

function App() {
  // Create "active" state for dropzone:
  const [isDropActive, setIsDropActive] = useState(false);
  // Create state for dropped files:
  const [files, setFiles] = useState<File[]>([]);

  // Create handler for dropzone's onDragStateChange:
  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  // Create handler for dropzone's onFilesDrop:
  const onFilesDrop = useCallback((files: File[]) => {
    setFiles(files);
  }, []);

  return (
    <div
      className={classNames("dropZoneWrapper", {
        dropZoneActive: isDropActive,
      })}
    >
      {/* Render the dropzone */}
      <DropZone
        onDragStateChange={onDragStateChange}
        onFilesDrop={onFilesDrop}
      >
        <h2>Drop your files here</h2>

        {files.length === 0 ? (
          <h3>No files to upload</h3>
        ) : (
          <h3>Files to upload: {files.length}</h3>
        )}

        {/* Render the file list */}
        <FileList files={files} />
      </DropZone>
    </div>
  );
}

export default App;
