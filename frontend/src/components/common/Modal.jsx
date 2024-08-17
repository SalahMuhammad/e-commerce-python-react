import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

export default function MyModal({ title, children, onSubmit }) {
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("../");
    };

    return (
        <>
            <Modal show={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        الغاء
                    </Button>
                    <Button variant="primary" onClick={onSubmit} disabled={disabled}>
                        {disabled && (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        )}{" "}
                        <span>{!disabled ? "حفظ" : "جار التحميل..."}</span>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export function MyModal2({ title, children, show, onHide }) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
}
