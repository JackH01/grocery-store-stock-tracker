import { useState } from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {ProductData} from "../page";

type DeleteButtonProps = {
    product: ProductData;
    handleDelete: (product: ProductData) => void;
}

export function DeleteButton({ product, handleDelete }: DeleteButtonProps) {
    const [isDeleteModalOpen, setDeleteModalOpen] = 
        useState<boolean>(false);

    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    }

    const handleModalDelete = () => {
        handleDelete(product);
        handleCloseDeleteModal();
    }

    const name = product.stocked ? product.name : 
        <span style={{ color: "red" }}>
            {product.name}
        </span>;

    return (
        <>
            <div>
                <Button
                    variant="outline-danger"
                    onClick={handleOpenDeleteModal}
                    aria-label="Delete product button"
                >
                    Delete
                </Button>
            </div>

            <Modal show={isDeleteModalOpen} onHide={handleCloseDeleteModal}>

                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete the following 
                        product? This CANNOT be undone.
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{name}</td>
                                <td>£{product.price}</td>
                                <td>{product.category.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleModalDelete}>
                        Delete
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}