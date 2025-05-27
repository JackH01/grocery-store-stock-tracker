// Tell next.js that this file is a client component - otherwise
// it will assume it is a server component and we can't use
// useState without getting an error.
"use client"
import { useState } from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl"

import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControlProps } from 'react-bootstrap';

export interface ProductData {
  category: "Fruits" | "Vegetables";
  price: number;
  stocked: boolean;
  name: string;
}

const emptyProduct: ProductData = {
  category: "Fruits",
  price: 0.01,
  stocked: false,
  name: "",
}

type ProductCategoryRowProps = {
  category: string;
}

type ProductRowProps = {
  product: ProductData;
}

type ProductTableProps = {
  products: ProductData[];
  filterText: string;
  inStockOnly: boolean;
}

type SearchBarProps = {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (inStockOnly: boolean) => void;
}

type FilterableProductTableProps = {
  products: ProductData[];
}

type AddEditButtonProps = {
  product: ProductData;
  handleSubmit: (product: ProductData) => void;
  isAdd: boolean;
}

function ProductCategoryRow({ category }: ProductCategoryRowProps) {
  return (
    <tr>
      <th colSpan={2}>
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }: ProductRowProps) {
  const name = product.stocked ? product.name : 
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  function handleSubmit(product: ProductData) {
    // TODO change when we link to backend.
    console.log("Edit product: " + product.name);
}

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
      <td><AddEditButton
        product={product}
        handleSubmit={handleSubmit}
        isAdd={false}
      /></td>
    </tr>
  );
}

function AddEditButton({ product, handleSubmit, isAdd }: AddEditButtonProps) {
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
          Category: <b>{addEditFormData.category}</b>, 
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
              defaultValue={addEditFormData.category} 
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

function ProductTable({ products, filterText, inStockOnly }: ProductTableProps) {
  const rows: React.ReactElement[] = [];
  let lastCategory: string = "";

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) == -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ 
  filterText, 
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}: SearchBarProps) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText}
        placeholder="Search..." 
        onChange={ (e) => onFilterTextChange(e.target.value) }
      />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={ (e) => onInStockOnlyChange(e.target.checked) }
        />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }: FilterableProductTableProps) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  function handleSubmit(product: ProductData) {
    // TODO change when we link to backend.
    console.log("Add product: " + product.name);
  }

  return (
    <div>
      <SearchBar 
        filterText={filterText}
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <AddEditButton 
        product={emptyProduct}
        handleSubmit={handleSubmit}
        isAdd={true}/>
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

const PRODUCTS: ProductData[] = [
  {category: "Fruits", price:  1.00, stocked: true, name: "Apple"},
  {category: "Fruits", price: 1.00, stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: 2.49, stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: 2.00, stocked: true, name: "Spinach"},
  {category: "Vegetables", price: 4.99, stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: 0.99, stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}