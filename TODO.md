# Trust Badges Feature — Implementation Plan

## Goal
Allow admin and seller to edit/change the Trustbadge shown on a product, based on the
certification badges assigned to the shop (seller) that owns the product.

## Backend (already implemented)
- [x] Prisma `User.trustBadges` field + migration
- [x] `sellerDashboardService`: parse/write `trustBadges` JSON in get/update profile
- [x] `sellerManagementService`: include `trustBadges` in seller list + `updateSellerTrustBadges()`
- [x] `sellerManagementController`: `updateSellerTrustBadgesController`
- [x] `sellerManagementRoutes`: `PATCH /:id/trust-badges`
- [x] `productService`: include `user: { select: { trustBadges } }` for product listings/details

## Frontend
### Already implemented
- [x] `types/product.ts`: `user?.trustBadges`
- [x] `TrustBadges/TrustBadges.tsx`: dynamic `badges` prop rendering
- [x] `ProductCard/ProductCard.tsx`: pass `product.user.trustBadges` to `<TrustBadges>`
- [x] `sellerService.ts`: `trustBadges: string[]` on profile + `updateProfile` param
- [x] `adminService.ts`: `updateSellerTrustBadges()` method
- [x] Seller Settings UI — Trust Badges section with toggle buttons (Settings.tsx)

### Remaining
- [ ] Admin Sellers UI — "Manage Trust Badges" action + modal (Sellers.tsx)
- [ ] ProductDetails page — render `<TrustBadges>` from `product.user.trustBadges`
- [ ] Build & verify (frontend)
