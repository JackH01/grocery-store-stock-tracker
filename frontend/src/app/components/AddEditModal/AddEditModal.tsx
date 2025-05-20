import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";

export interface ProductData {
    category: "Fruits" | "Vegetables";
    price: number;
    stocked: boolean;
    name: string;
}

interface AddModalProps {
    isOpen: boolean;
    product: ProductData;
    onSubmit: (product: ProductData) => void;
    onClose: () => void;
}

const AddEditModal = ({
    isOpen,
    product,
    onClose,
    onSubmit,
}: AddModalProps) => {

    const [formData, setFormData] = useState<ProductData>(product);
    
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCheckChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: checked,
        }));
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData(product);
        onClose();
    };

    return (
        <Modal
            hasCloseBtn={true}
            isOpen={isOpen}
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        min="0"
                        step=".01"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required>
                            <option value="Fruits">Fruits</option>
                            <option value="Vegetables">Vegetables</option>
                        </select>
                </div>

                <div className="form-row">
                    <label htmlFor="stocked">Stocked</label>
                    <input
                        type="checkbox"
                        id="stocked"
                        name="stocked"
                        checked={formData.stocked}
                        onChange={handleCheckChange}
                    />
                </div>

                <div className="form-row">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditModal;