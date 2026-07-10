export const validateProduct = (body: any) => {
  const errors: string[] = [];
  

  if (!body.name) errors.push("Product name is required.");

  if (!body.slug) errors.push("Slug is required.");

  if (!body.description)
    errors.push("Description is required.");

  if (!body.price || body.price <= 0)
    errors.push("Invalid price.");

  if (body.stock < 0)
    errors.push("Stock cannot be negative.");

  if (!body.categoryId)
    errors.push("Category is required.");

  if (!body.brandId)
    errors.push("Brand is required.");

  return errors;
};
