"use client";

import { useEffect, useState } from "react";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import { CATEGORIES, defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof CATEGORIES)[number] | ""
  >("");

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
    );
    setStatus("error");
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...draft, id: p.id } : p)),
      );
      setEditingProduct(null);
    } else {
      setProducts((prev) => [{ ...draft, id: Date.now() }, ...prev]);
    }
  }

  function deleteProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main>
      <h1 className="page-title">รายการสินค้า</h1>

      <div className="controls-container">
        <ProductSearchForm onSearch={loadProducts} />
        <ProductForm
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </div>

      <section aria-live="polite">
        {status === "loading" && <div className="status-msg status-loading">กำลังโหลดข้อมูลสินค้า...</div>}
        {status === "error" && <div className="status-msg status-error" role="alert">{errorMessage}</div>}
        {status === "ready" && products.length === 0 && (
          <div className="status-msg status-empty">ไม่พบสินค้าที่ตรงกับเงื่อนไข</div>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>รูปภาพ</th>
                  <th>ชื่อสินค้า</th>
                  <th style={{ width: "90px" }}>ราคา ($)</th>
                  <th style={{ width: "90px" }}>คงเหลือ</th>
                  <th style={{ width: "160px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span>หมวดหมู่</span>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          const category = e.target.value as (typeof CATEGORIES)[number] | "";
                          setSelectedCategory(category);
                          void loadProducts({
                            ...defaultQuery,
                            category: category || undefined,
                          });
                        }}
                        style={{ height: "30px", fontSize: "0.8rem", padding: "2px 6px" }}
                      >
                        <option value="">ทั้งหมด</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th style={{ width: "120px", textAlign: "center" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        className="thumb-img"
                        src={item.thumbnail}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://dummyjson.com/image/80?text=No+Image";
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.title}</td>
                    <td>{item.price.toLocaleString()}</td>
                    <td>{item.stock}</td>
                    <td>
                      <span className="badge">{item.category}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-edit-outline"
                          onClick={() => setEditingProduct(item)}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          className="btn-danger-outline"
                          onClick={() => deleteProduct(item.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}