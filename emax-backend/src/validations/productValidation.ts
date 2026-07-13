export const validateProduct = (body: any): string[] => {
  const errors: string[] = [];

  // Ensure request body exists
  if (!body || typeof body !== "object") {
    return ["No product data received."];
  }

  if (!body.name?.trim()) {
    errors.push("Product name is required.");
  }

  if (!body.slug?.trim()) {
    errors.push("Slug is required.");
  }

  if (!body.description?.trim()) {
    errors.push("Description is required.");
  }

  const price = Number(body.price);

  if (isNaN(price) || price <= 0) {
    errors.push("Price must be greater than zero.");
  }

  const stock = Number(body.stock);

  if (isNaN(stock) || stock < 0) {
    errors.push("Stock cannot be negative.");
  }

  if (!body.categoryId) {
    errors.push("Category is required.");
  }

  if (!body.brandId) {
    errors.push("Brand is required.");
  }

  return errors;
};