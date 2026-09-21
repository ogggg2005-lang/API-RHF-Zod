"use client";

import { useState } from "react";
import ProductSearchForm from "./ProductSearchForm";
import { CATEGORIES, defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductList, SearchQuery } from "@/lib/products";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
	const [products, setProducts] = useState<Product[]>([]);
	const [status, setStatus] = useState<LoadState>("idle");
	const [errorMessage, setErrorMessage] = useState("");
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

	async function loadProducts(query: SearchQuery) {
		setStatus("loading");
		setErrorMessage("");

		try {
			showResult(await fetchProducts(query));
		} catch (error) {
			showError(error);
		}
	}

	return (
		<main>
			<h1>รายการสินค้า</h1>
			<ProductSearchForm onSearch={loadProducts} />
			<section aria-live="polite">
				{status === "idle" && <p>คลิกปุ่มโหลดข้อมูลเพื่อเริ่ม</p>}
				{status === "loading" && <p>กำลังโหลดข้อมูล</p>}
				{status === "error" && <p role="alert">{errorMessage}</p>}
				{status === "ready" && products.length === 0 && (
					<p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
				)}
				{status === "ready" && products.length > 0 && (
					<table>
						<thead>
							<tr>
								<th>รูปภาพ</th>
								<th>ชื่อสินค้า</th>
								<th>ราคา</th>
								<th>คงเหลือ</th>
								<th scope="col">
									<label className="category-heading" htmlFor="category">
										หมวดหมู่
									</label>
									<select
										id="category"
										value={selectedCategory}
										onChange={(event) => {
											const category = event.target
												.value as (typeof CATEGORIES)[number];
											setSelectedCategory(category);
											if (category) {
												void loadProducts({ ...defaultQuery, category });
											}
										}}
									>
										<option value="">ทั้งหมด</option>
										{CATEGORIES.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
								</th>
							</tr>
						</thead>
						<tbody>
							{products.map((item) => (
								<tr key={item.id}>
									<td>
										<img
											src={item.thumbnail}
											alt={item.title}
											width={80}
											height={80}
										/>
									</td>
									<td>{item.title}</td>
									<td>{item.price}</td>
									<td>{item.stock}</td>
									<td>
										<span className="category-badge">{item.category}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</section>
		</main>
	);
}
