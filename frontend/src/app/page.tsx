// Tell next.js that this file is a client component - otherwise
// it will assume it is a server component and we can't use
// useState without getting an error.
"use client"
import { useState, Component } from 'react';
import axios from "axios";

import {AddEditButton} from "./components/AddEditButton";
import {DeleteButton} from "./components/DeleteButton";

import 'bootstrap/dist/css/bootstrap.min.css';

interface CategoryData {
  id?: number;
  name: string;
}

export interface ProductData {
  id?: number;
  category: CategoryData;
  price: number;
  stocked: boolean;
  name: string;
}



const emptyProduct: ProductData = {
  category: {name: "Fruits"},
  price: 0.01,
  stocked: false,
  name: "",
}

type ProductCategoryRowProps = {
  category: CategoryData;
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
        {category.name}
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

  function handleDelete(product: ProductData) {
    // TODO change when we link to nackend.
    console.log("Delete product: " + product.name);
  }

  return (
    <tr>
      <td>{name}</td>
      <td>£{product.price}</td>
      <td><AddEditButton
        product={product}
        handleSubmit={handleSubmit}
        isAdd={false}
      /></td>
      <td><DeleteButton
        product={product}
        handleDelete={handleDelete}
      /></td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }: ProductTableProps) {
  const rows: React.ReactElement[] = [];
  let lastCategory: CategoryData = {name: ""};

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
          key={product.category.id} />
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
  {category: {name: "Fruits"}, price:  1.00, stocked: true, name: "Apple"},
  {category: {name: "Fruits"}, price: 1.00, stocked: true, name: "Dragonfruit"},
  {category: {name: "Fruits"}, price: 2.49, stocked: false, name: "Passionfruit"},
  {category: {name: "Vegetables"}, price: 2.00, stocked: true, name: "Spinach"},
  {category: {name: "Vegetables"}, price: 4.99, stocked: false, name: "Pumpkin"},
  {category: {name: "Vegetables"}, price: 0.99, stocked: true, name: "Peas"}
];

type refreshProductListProps = {
  setProducts: (products: ProductData[]) => void;
}


// export default function App() {
//   // TODO turn into class, think I can leave all (or most) of
//   // functions as they are outside of the class?
//   // TODO leave this here, just create a new class like in the tutorial.
//   return <FilterableProductTable products={PRODUCTS} />;
// }

type AppStateProps = {
  categoryList: CategoryData[];
  productList: ProductData[];
}

class App extends Component {
  constructor(props: {}) { // TODO : {} might not work, jut see.
    super(props);
    this.state = {
      categoryList: [],
      productList: [],
    }
  };

  componentDidMount() {
    this.refreshCategoryList();
    this.refreshProductList();
  }

  // ---- HANDLING CATEGORIES ----
  refreshCategoryList = () => {
    axios
      .get("/api/product_categories/")
      .then((res) => this.setState({ categoryList: res.data }))
      .catch((err) => console.log(err));
  };

  handleCategorySubmit = (category: CategoryData) => {
    // If the id exists then we are editing, not creating
    if (category.id) {
      axios
        .put(`/api/product_categories/${category.id}/`, category)
        .then((res) => this.refreshCategoryList());
      return;
    }

    axios
      .post("/api/product_categories/", category)
      .then((res) => this.refreshCategoryList());
  };

  handleCategoryDelete = (category: CategoryData) => {
    axios
      .delete(`/api/product_categories/${category.id}/`)
      .then((res) => this.refreshCategoryList());
  }

  // ---- HANDLING PRODUCTS ----
  refreshProductList = () => {
    axios
      .get("/api/products/")
      .then((res) => this.setState({ productList: res.data }))
      .catch((err) => console.log(err));
  };

  handleProductSubmit = (product: ProductData) => {
    // If the id exists then we are editing, not creating
    if (product.id) {
      axios
        .put(`/api/products/${product.id}/`, product)
        .then((res) => this.refreshProductList());
      return;
    }

    axios
      .post("/api/products/", product)
      .then((res) => this.refreshProductList());
  };

  handleProductDelete = (product: ProductData) => {
    axios
      .delete(`/api/products/${product.id}/`)
      .then((res) => this.refreshProductList());
  }


  render() {
    // For some reason calling this.state.productList gives an error?
    // This is a bit of a hacky work around.
    const categories = (this.state as any).categoryList;
    const products = (this.state as any).productList;
    console.log(products);
    // TODO pass these through, along with this(?) so that we
    // can use the handle functions?
    return <FilterableProductTable products={products} />;
  }
  
}

export default App;