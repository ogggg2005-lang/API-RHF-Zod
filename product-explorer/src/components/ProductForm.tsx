"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      price: undefined,
      stock: undefined,
      thumbnail: "https://dummyjson.com/image/150",
      category: undefined,
    },
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        thumbnail: editing.thumbnail,
        category: editing.category,
      });
    } else {
      reset({
        title: "",
        price: undefined,
        stock: undefined,
        thumbnail: "https://dummyjson.com/image/150",
        category: undefined,
      });
    }
  }, [editing, reset]);

  function submitProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <div className="panel-card">
      <h2 className="panel-title">{editing ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
      <form onSubmit={handleSubmit(submitProduct)} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">ชื่อสินค้า</label>
            <input
              id="title"
              {...register("title")}
              placeholder="ระบุชื่อสินค้า"
              aria-invalid={!!errors.title}
            />
            <span className="error-text">{errors.title?.message}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="form-group">
              <label htmlFor="price">ราคา ($)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
              />
              <span className="error-text">{errors.price?.message}</span>
            </div>

            <div className="form-group">
              <label htmlFor="stock">จำนวนคงเหลือ</label>
              <input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                aria-invalid={!!errors.stock}
              />
              <span className="error-text">{errors.stock?.message}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">หมวดหมู่</label>
            <select id="category" {...register("category")} aria-invalid={!!errors.category}>
              <option value="">-- เลือกหมวดหมู่ --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="error-text">{errors.category?.message}</span>
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">URL รูปภาพ</label>
            <input
              id="thumbnail"
              type="url"
              {...register("thumbnail")}
              aria-invalid={!!errors.thumbnail}
            />
            <span className="error-text">{errors.thumbnail?.message}</span>
          </div>

          <div className="btn-group">
            <button
              type="submit"
              className="btn-primary"
              disabled={!isDirty || !isValid}
              style={{ flex: 1 }}
            >
              {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={onCancel}>
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}