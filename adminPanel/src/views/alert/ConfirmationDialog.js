import React, { useEffect, useState } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';

const ConfirmDialog = (props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (props.openConfirmModal) {
            setVisible(true)
        }
    }, [props.openConfirmModal, visible])

    const accept = () => {
        setVisible(false)
        props.acceptConfirmation()
    };

    const reject = () => {
        setVisible(false)
        props.rejectConfirmation()
    };


    return (
        <div>
            <div className="card">
                <ConfirmPopup visible={visible} onHide={() => reject()} message="Are you sure you want to proceed?"
                    icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
            </div>
        </div>
    )
}
export default ConfirmDialog