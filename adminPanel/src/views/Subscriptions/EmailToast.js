
import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import "./toast.css";

export default function ExtendedToast(props) {
    const toast = useRef(null);

    // Function to handle closing the toast
    const handleClose = () => {
        props.handleClose(false);
    };

 
    

    // Effect to show the toast when "open" changes
    useEffect(() => {
        if (props.open) {
            toast.current.show({
                severity: props.severity,
                summary: props.summary ? props.summary : "Response",
                detail: props.message,
           
            });
        }
    }, [props.open, props.severity, props.summary, props.message]);

    return (
        <Toast
            ref={toast}
            onRemove={handleClose}
            onHide={handleClose}
        />
    );
}
