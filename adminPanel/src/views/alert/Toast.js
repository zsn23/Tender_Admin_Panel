import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import "./toast.css";

export default function ExtendedToast(props) {
    const toast = useRef(null);

    const handleClose = () => {
        props.handleClose(false);
    };
   
    let timeoutLife = (props.timeout === 1 && props.timeout !== undefined) ? "15000" : "3000";
    useEffect(() => {
        if (props.open) {
            toast.current.show({ severity: props.severity, summary: props.summary?props.summary:"Response", detail: props.message, life: timeoutLife });
        }
    }, [props.open]);

    return (
        <>
            <Toast
                ref={toast}
                onRemove={() => {
                  handleClose();
                }}
                onHide={() => {
                   handleClose();
                }}
            />
        </>
    );
}
