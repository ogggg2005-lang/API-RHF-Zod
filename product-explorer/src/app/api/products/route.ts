import { NextResponse } from "next/server";
import fallbackData from "@/data/products-fallback.json";

const API_BASE = "https://dummyjson.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = searchParams.get("limit") ?? "10";
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sortBy") ?? "title";

  const params = new URLSearchParams();
  params.set("limit", limit);
  params.set("sortBy", sortBy);
  params.set("order", "asc");
  params.set("select", "id,title,thumbnail,price,stock,category");

  let targetUrl = `${API_BASE}/products/search?${params.toString()}&q=${encodeURIComponent(q)}`;
  if (category) {
    targetUrl = `${API_BASE}/products/category/${encodeURIComponent(category)}?${params.toString()}`;
  }

  try {
    const res = await fetch(targetUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Upstream error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch dummyjson failed, returning fallback:", error);
    return NextResponse.json(fallbackData);
  }
}