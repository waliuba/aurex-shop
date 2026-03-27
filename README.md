Aurex Shop Aurex Shop is a Kenyan-tailored suit store offering modern, well-fitted designs that blend global style with local taste at accessible prices. This project is a React-based frontend e-commerce application built to showcase suits, manage shopping carts, and provide a smooth checkout experience.

Objectives Alignment This app is designed to meet the following learning and development objectives:

Functional Components & State Management
Built entirely with React functional components.
Uses Context API for global state (cart, user session).
Ensures clean, modular, and maintainable code.
API Calls & Loading States
Fetches product data (suits) from a backend API.
Implements loading indicators (spinners/skeletons).
Handles errors gracefully with user-friendly messages.
Reusable UI Components
Common components like Button, ProductCard, InputField, and Modal.
Props-driven design for flexibility and consistency.
Promotes scalability and reduces duplication.
System Analysis Stakeholders

Customers: Browse suits, filter by size/color/price, purchase securely.
Admin: Manage inventory, update listings, track orders.
System: Handle authentication, payments, and responsive UI. Functional Requirements
User authentication (login/signup).
Product catalog with filters and search.
Shopping cart and checkout flow.
Payment integration (M-Pesa, cards).
Order tracking and history. Non-Functional Requirements
Performance: Fast loading, optimized images.
Scalability: Support growing catalog.
Security: Protect user data and payments.
Usability: Intuitive, mobile-first design.
System Design Architecture

React Functional Components:
Navbar, ProductList, ProductCard, Cart, CheckoutForm, OrderSummary.
State Management: Context API for cart + user session.
Routing: React Router for navigation (Home → Catalog → Cart → Checkout). Data Flow
API Endpoints:
GET /products → fetch suits.
POST /orders → submit checkout.
Loading/Error Handling:
Skeleton loaders while fetching.
Error messages for failed requests.
UI/UX Design

Homepage: Hero section with featured suits.
Catalog: Filters (size, color, price), sorting options.
Product Detail Page: Zoomable images, size chart, reviews.
Cart/Checkout: Clear steps, progress indicator.
Mobile-first: Optimized for small screens.
Example Workflow

User opens catalog → ProductList fetches suits via API, shows loading skeletons.
User selects a suit → ProductCard updates cart state using Context API.
User goes to cart → Cart displays reusable CartItem components.
User checks out → CheckoutForm submits order via API, shows loading state.
Order confirmed → Modal displays success message.
Tech Stack

Frontend: React, Context API, React Router.

Styling: TailwindCSS / Material UI.

Summary Aurex Shop is more than just a suit store — it’s a React learning project that demonstrates:

Functional components with state management.

API integration with loading/error handling.

Reusable UI components for scalability.
