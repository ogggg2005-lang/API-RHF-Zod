"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { defaultQuery, SearchQuerySchema } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
	onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({
	onSearch,
}: ProductSearchFormProps) {
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
		<form onSubmit={handleSubmit(onSearch)} noValidate>
			<div className="search-field">
				<label htmlFor="q">ค้นหา</label>
				<input
					id="q"
					type="search"
					{...register("q")}
					placeholder="phone"
				/>
			</div>

			<div className="limit-field">
				<label htmlFor="limit">จำนวนรายการ</label>
				<input
					id="limit"
					type="number"
					required
					min={1}
					max={30}
					{...register("limit", { valueAsNumber: true })}
					aria-invalid={!!errors.limit}
					aria-describedby="limit-error"
				/>
				<span id="limit-error" role="alert">
					{errors.limit?.message}
				</span>
			</div>

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
			</button>
		</form>
	);
}
