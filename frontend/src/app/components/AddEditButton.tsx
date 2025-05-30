import { useState } from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import {ProductData} from "../page";

type AddEditButtonProps = {
    product: ProductData;
    handleSubmit: (product: ProductData) => void;
    isAdd: boolean;
  }

export function AddEditButton({ product, handleSubmit, isAdd }: AddEditButtonProps) {
  const [isAddEditModalOpen, setAddEditModalOpen] = 
    useState<boolean>(false);

  const [currentProduct, setCurrentProduct] = 
    useState<ProductData>(product);

  const [addEditFormData, setAddEditFormData] = 
    useState<ProductData>(product)

  const handleOpenAddEditModal = () => {
    setAddEditModalOpen(true);
  }

  const handleCloseAddEditModal = () => {
    setAddEditModalOpen(false);
  }

  const handleFormSubmit = () => {
    setAddEditFormData(currentProduct);
    handleSubmit(addEditFormData);
    handleCloseAddEditModal();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;

    if (e.target.type === "checkbox") {
      const checkValue = e.target.checked;
      setCurrentProduct((prev) => ({ ...prev, [name]: checkValue }));
    } else {
      setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    }
  }

  return (
    <>
      <div>
        <Button 
          variant="outline-secondary" 
          onClick={handleOpenAddEditModal}
          aria-label={isAdd ? "Add product button" : "Edit product Button"}>
            {isAdd ? "Add Product" : "Edit"}
          </Button>
      </div>

      {isAdd && addEditFormData && addEditFormData.name && (
        <div className="msg-box msg-box--success">
          Added product: <b>{addEditFormData.name}</b>
          (Price <b>{addEditFormData.price}</b>, 
          Category: <b>{addEditFormData.category.name}</b>, 
          {addEditFormData.stocked ? "": "not "} in stock)
        </div>
      )}
      
      <Modal show={isAddEditModalOpen} onHide={handleCloseAddEditModal}>
        
        <Modal.Header closeButton>
          <Modal.Title>{isAdd ? "Add": "Edit"} a Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Product Name</Form.Label>
            <Form.Control 
              placeholder="E.g. Apple" 
              aria-label="Product name input" 
              defaultValue={addEditFormData.name}
              onChange={(event) => handleChange(event as any)}
              name="name"
              autoFocus/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Price</Form.Label>
            <InputGroup>
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control 
                type="number"
                min="0"
                step=".01"
                placeholder="0.99" 
                aria-label="Product price input"
                defaultValue={addEditFormData.price}
                onChange={(event) => handleChange(event as any)}
                name="price"/>
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select 
              defaultValue={addEditFormData.category.name} 
              aria-label="Product category select" 
              onChange={(event) => handleChange(event as any)}
              name="category">
              {/* TODO allow user to create category and read these
              from db */}
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Check 
              type="checkbox" 
              label="In stock" 
              defaultChecked={addEditFormData.stocked}
              aria-label="In stock checknox"
              onChange={(event) => handleChange(event as any)}
              name="instock"/>
          </Form.Group>
          
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  )
}