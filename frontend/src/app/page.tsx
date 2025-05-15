// Tell next.js that this file is a client component - otherwise
// it will assume it is a server component and we can't use
// useState without getting an error.
"use client"
import { useState } from 'react';

interface Product {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
}

type ProductCategoryRowProps = {
  category: string;
}

type ProductRowProps = {
  product: Product;
}

type ProductTableProps = {
  products: Product[];
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
  products: Product[];
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

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
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

  return (
    <div>
      <SearchBar 
        filterText={filterText}
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

const PRODUCTS: Product[] = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}