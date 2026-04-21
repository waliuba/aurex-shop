# Admin bootstrap

## 1) Public registration

`POST /api/auth/register` always creates a normal user (`role: "user"`). Public sign-up cannot create admins.

## 2) Create the first admin (bootstrap)

1. Set these in `Backend/.env`:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_NAME` (optional)
2. Run the seed script from `Backend/`:
   - `npm run seed:admin`

If the admin email already exists, the script will skip creating it.

## 3) Promote users to admin (after bootstrap)

After logging in as an admin (token required), promote a user:

- `PUT /api/users/:id/role`
- Body: `{ "role": "admin" }`
- Header: `Authorization: Bearer <JWT>`

