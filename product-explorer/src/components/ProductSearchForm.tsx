"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { defaultQuery, SearchQuerySchema } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <div className="panel-card">
      <h2 className="panel-title">ค้นหาสินค้า</h2>
      <form onSubmit={handleSubmit(onSearch)} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="q">ชื่อหรือคำค้นหา</label>
            <input
              id="q"
              type="search"
              {...register("q")}
              placeholder="เช่น phone, laptop..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="limit">จำนวนที่ต้องการแสดง (1-30)</label>
            <input
              id="limit"
              type="number"
              min={1}
              max={30}
              {...register("limit", { valueAsNumber: true })}
              aria-invalid={!!errors.limit}
            />
            <span className="error-text">{errors.limit?.message}</span>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
          </button>
        </div>
      </form>
    </div>
  );
}