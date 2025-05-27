// Tell next.js that this file is a client component - otherwise
// it will assume it is a server component and we can't use
// useState without getting an error.
"use client"
import { useState } from 'react';

import {AddEditButton} from "./components/AddEditButton";

import 'bootstrap/dist/css/bootstrap.min.css';


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