import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FormControl, InputGroup } from "react-bootstrap";

const baseStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export const FileUploadDrop = ({ importState, setImportState }
                                   : { importState: string, setImportState: React.Dispatch<React.SetStateAction<string>> }) => {

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result;
                const result: string = binaryStr as string
                setImportState(result)
            }
            reader.readAsText(file)
        })

    }, [])
    const {
        getRootProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({ onDrop, accept: 'application/json' })

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    return (
        <div {...getRootProps()} style={style}>

            <InputGroup>
                {/*<input {...getInputProps()} />*/}
                <FormControl as="textarea" size={"sm"} rows={10}
                             placeholder={"Drag 'n' drop some files here and click on load"}
                             aria-label="Importfield"
                             value={importState}
                             onChange={(event) => {
                                 setImportState(event.target.value)
                             }}/>
            </InputGroup>

        </div>
    )

}
