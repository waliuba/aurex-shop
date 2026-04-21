
const year = new Date().getFullYear();

export const textStrings = {

    currency: {
        symbol: "$",
    },

    common: {
        dotSeparator: "·",
        slashSeparator: "/",
        arrowRight: "→",
        emDash: "—",
        on: "On",
        off: "Off",
        menu: "Menu",
        close: "Close",
    },

    

    // tittle

    tittle:{
        // appname

        head : "Aurex",
        // reg tittle
        hero_tittle : "Register",
        hero_sub_tittle: " Create an account to save your details and checkout faster.",
        // login tittles
        hero_tittle2: "Login",
        hero_sub_tittle2: "Welcome back. Sign in to continue."


    },
    // navbar links

    navbar:  {
    home: "Home",
    shop: "Shop",
    about: "About Us",
    contact: "Contact",
    ariaLabelPrimary: "Primary",
    registerCta: "Register",
    actions: {
        cartButton: (count) => `Cart (${count})`,
        dashboard: "Dashboard",
        logout: "Logout",
    },
    },

    footer: {
        ariaLabel: "Footer",

        // tagline

        tagline: "Quality pieces, curated with care. Shop the latest and timeless essentials.",

        // footer-links

        Shipping: "Shipping",
        Returns : "Returns",
        Faq : "Faq",

        sections: {
            company: "Company",
            support: "Support",
        },
    },

    cartModal: {
        title: "Cart",
        subtotal: "Subtotal",
        clear: "Clear",
        checkout: "Checkout",
        empty: "Your cart is empty.",
        remove: "Remove",
        skuLabel: (id) => `SKU: ${id}`,
    },

    errors: {
        boundary: {
            title: "Something went wrong",
            body: "Try refreshing the page. If it keeps happening, sign out and sign in again.",
        },
    },

    pages: {
        auth: {
            signInRequiredTitle: "Sign in required",
            signInRequiredMessage: "Please login to continue.",
        },
        home: {
            title: "Aurex Shop",
            subtitle:
                "Discover curated essentials with a clean, modern look. Shop new arrivals, explore categories, and find pieces that fit your style.",
            ctas: {
                browseShop: "Browse Shop",
                learnMore: "Learn More",
            },
            featuredTitle: "Featured",
            featuredItems: [
                { name: "Everyday Tote", desc: "Minimal, durable, and ready to go.", price: "$29" },
                { name: "Classic Tee", desc: "Soft fabric with a clean silhouette.", price: "$19" },
                { name: "Street Cap", desc: "Easy fit with a premium finish.", price: "$14" },
                { name: "Weekend Hoodie", desc: "Cozy layer for cool evenings.", price: "$39" },
            ],
            carousel: {
                prev: "Prev",
                next: "Next",
                ariaLabel: "Featured products",
                roleDescription: "carousel",
                slideRoleDescription: "slide",
                slideAriaLabel: (name, price) => `${name}, ${price}`,
            },
        },
        about: {
            title: "About Aurex",
            subtitle:
                "Aurex is built around clean design and curated essentials. The goal is simple: make it easy to find quality pieces that look good and feel right.",
            style: {
                title: "Our Style",
                body:
                    "We keep the palette calm and premium, focus on typography, and let the product speak. This project is structured to scale: you can plug in real products, categories, and payments later without changing the visual system.",
            },
        },

        // SHOP PAGE

        shop: {
            title: "Shop",
            subtitle: "A simple product grid to match your current styling. Replace these items with real data when you're ready.",
            productsTitle: "Products",
            loadingProducts: "Loading products...",
            emptyProducts: "No products yet. Add some from the admin panel.",
            errors: {
                failedToLoadProducts: "Failed to load products",
            },
        },

        // CONTACT PAGE

        contact: {
            title: "Contact",
            subtitle: "Send us a message and we'll get back to you.",
            messageTitle: "Message",
            form: {
                name: { label: "Name", placeholder: "Your name" },
                email: { label: "Email", placeholder: "you@example.com" },
                message: { label: "Message", placeholder: "How can we help?" },
                submit: "Send Message",
            },
        },

        // FAQ

        faq: {
            title: "FAQ",
            subtitle: "Quick answers to common questions.",
            askQuestion: "Ask a question",
            questionsTitle: "Questions",
            items: [
                {
                    q: "Do you offer cash on delivery?",
                    a: "Add your payment options here. This is placeholder content.",
                },
                {
                    q: "How long does delivery take?",
                    a: "Standard delivery is usually 2-5 business days depending on location.",
                },
                {
                    q: "Can I return an item?",
                    a: "Yes - see the Returns page for the full policy and steps.",
                },
            ],
        },


        
        shipping: {
            title: "Shipping",
            subtitle: "Clear, simple shipping information. Update these details to match your real delivery options.",
            continueShopping: "Continue shopping",
            deliveryTimes: {
                title: "Delivery times",
                body: "Standard delivery: 2-5 business days. Express delivery: 1-2 business days (where available).",
            },
            fees: {
                title: "Shipping fees",
                body: "Shipping fees are calculated at checkout based on location and order size.",
            },
        },
        returns: {
            title: "Returns",
            subtitle: "Simple return policy UI. Replace the text with your real policy.",
            contactSupport: "Contact support",
            window: {
                title: "Return window",
                body: "Returns accepted within 7-14 days of delivery if items are unused and in original condition.",
            },
            howTo: {
                title: "How to return",
                body: "Reach out via the Contact page with your order details, then follow the provided instructions.",
            },
        },

        orders: {
            title: "My orders",
            subtitle: "Track your recent purchases.",
            sectionTitle: "Orders",
            continueShopping: "Continue shopping",
            loadingOrders: "Loading your orders...",
            emptyOrders: "No orders yet.",
            errors: {
                failedToLoadOrders: "Failed to load orders",
            },
            orderTitle: (shortId) => `Order ${shortId}`,
            labels: {
                status: "Status:",
                total: "Total:",
            },
        },

        checkout: {
            title: "Checkout",
            subtitle: "Confirm your shipping details and place your order.",
            defaults: {
                country: "Kenya",
                paymentMethod: "M-Pesa",
            },
            paymentMethods: ["M-Pesa", "Card", "Cash on Delivery"],
            summary: {
                title: "Order summary",
                itemsLabel: "Items:",
                subtotalLabel: "Subtotal:",
                backToShop: "Back to shop",
                reviewCart: "Review cart",
            },
            form: {
                title: "Shipping & payment",
                loginHint: "You must be logged in to place an order.",
                fields: {
                    address: { label: "Address", placeholder: "Street / building / apartment" },
                    city: { label: "City", placeholder: "Nairobi" },
                    postalCode: { label: "Postal code", placeholder: "00100" },
                    country: { label: "Country" },
                    paymentMethod: { label: "Payment method" },
                },
            },
            submit: "Place order",
            submitting: "Placing order...",
            errors: {
                loginRequired: "Please login to checkout.",
                emptyCart: "Your cart is empty.",
                missingShippingFields: "Please fill in all shipping fields.",
                checkoutFailed: "Checkout failed",
            },
            success: {
                fallbackId: "Success",
                orderCreated: (id) => `Order created: ${id}`,
            },
        },
    },

    declaration: { 
        
        // copyright

        

      Copyright:  `\u00A9 ${year} Aurex. All rights reserved.`,

    //   madewith

    madewith: "Made with care."

    },

    // register

    reg : {

       
        sectiontile : "Create account",

        // registration form


        form: {

            // name
            name: {
                label : "Full name",
                placeholder : "Your name",
            },

            // email

            email: {
                label: "Email",
                placeholder : "you@example.com",


            },

            // password

            password: {
                label: "Password",
                placeholder: "Create a password", 
            }


        },

        submitting: "Registering...",
        errors: {
            registrationFailed: "Registration failed",
        },
        success: {
            registeredSuccessfully: "Registered successfully. You can now login.",
        }

       


    },


     // btns

        btns : {

            // reg btn
            register: "Register",
            login: "I have an account",

            // login btn
            login2: "Login",
            register2: "Create account",

            // shop
            cart : "Add to cart",
            outOfStock: "Out of stock",
            check_out : "Checkout",

            
        },

    // login

    login : {


        sectiontile: "Account",

        // form

        form: {
            email :{
                label: "Email",
                placeholder: "you@example.com",
            },
            password : {
                label: "Password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            }
        },

        submitting: "Signing in...",
        errors: {
            loginFailed: "Login failed",
        }


    },

    userDashboard: {
        topbar: {
            menu: "Menu",
            searchPlaceholder: "Search (products, orders...)",
            themeToggle: {
                ariaLabel: "Toggle theme",
                title: "Toggle theme",
                light: "Light",
                dark: "Dark",
            },
            notifications: {
                ariaLabel: "Notifications",
                title: "Notifications",
                icon: "🔔",
                panelTitle: "Notifications",
                empty: "No notifications yet.",
                actions: {
                    markAllRead: "Mark all read",
                    close: "Close",
                },
            },
            avatarFallback: "U",
            account: "Account",
            menuItems: {
                profile: "Profile",
                settings: "Settings",
                logout: "Logout",
            },
        },

        orders: {
            header: {
                kicker: "Orders",
                title: "Order history & tracking",
            },
            summary: {
                totalSpentLabel: "Total spent:",
                pendingLabel: "Pending:",
            },
            empty: {
                prefix: "No orders yet.",
                browseLink: "Browse products",
            },
            table: {
                headers: {
                    order: "Order",
                    date: "Date",
                    status: "Status",
                    total: "Total",
                    actions: "Actions",
                },
                view: "View",
            },
            details: {
                modalTitle: "Order details",
                orderLabel: "Order",
                cards: {
                    date: "Date",
                    items: "Items",
                    total: "Total",
                },
                itemsTitle: "Items",
                qtyLabel: "Qty:",
                unitLabel: "Unit:",
                downloadInvoice: "Download invoice",
            },
            invoice: {
                documentTitle: "Invoice",
                storeName: "Aurex Shop",
                subtitle: (shortId) => `Invoice for order ${shortId}`,
                labels: {
                    date: "Date",
                    status: "Status",
                    total: "Total",
                },
                table: {
                    item: "Item",
                    qty: "Qty",
                    price: "Price",
                },
                totalLine: (total) => `Total: ${total}`,
            },
            notifications: {
                syncedTitle: "Orders synced",
                syncedMessage: (shortId, status) => `Latest order ${shortId} is ${status}.`,
            },
        },

        settings: {
            header: {
                kicker: "Settings",
                title: "Preferences & account controls",
            },
            summary: {
                themeLabel: "Theme:",
                notificationsLabel: "Notifications:",
                unreadLabel: "Unread:",
            },
            appearance: {
                title: "Appearance",
                description: "Light/dark mode with persistence.",
                currentLabel: "Current:",
                toggle: "Toggle theme",
            },
            notifications: {
                title: "Notifications",
                description: "Order updates and system alerts.",
                enableLabel: "Enable notifications",
                actions: {
                    markAllRead: "Mark all read",
                    clear: "Clear",
                },
                toasts: {
                    markAllRead: "Marked all notifications as read.",
                    cleared: "Cleared notifications.",
                },
            },
            danger: {
                title: "Danger zone",
                description: "Delete your account permanently.",
                deleteAccount: "Delete account",
            },
            deleteModal: {
                title: "Delete account",
                body: "This will permanently remove your user account. Orders remain in the database for admin reporting.",
                cancel: "Cancel",
                deleting: "Deleting...",
                confirm: "Confirm delete",
                toasts: {
                    deletedTitle: "Account deleted",
                    deletedMessage: "Your account was deleted successfully.",
                    failedTitle: "Delete failed",
                    tryAgain: "Try again.",
                },
            },
        },

        products: {
            header: {
                kicker: "Products",
                title: "Search, compare & shop your catalog",
                openStorefront: "Open storefront",
            },
            filters: {
                search: {
                    label: "Search",
                    placeholder: "e.g. navy, slim, linen...",
                },
                category: {
                    label: "Category",
                    allLabel: "All",
                },
                priceRange: {
                    label: "Price range",
                    minPlaceholder: "Min",
                    maxPlaceholder: "Max",
                },
                sort: {
                    label: "Sort",
                    options: {
                        newest: "Newest",
                        priceAsc: "Price (low → high)",
                        priceDesc: "Price (high → low)",
                    },
                },
            },
            results: {
                showing: (count) => `Showing ${count} product${count === 1 ? "" : "s"}`,
                resetFilters: "Reset filters",
                empty: "No products found.",
            },
            summary: {
                featuredLabel: "Featured pick",
                selectedLabel: "Selected product",
                quickBuyLabel: "Quick buy ready",
            },
            card: {
                noDescription: "No description",
                priceLabel: "Price",
                uncategorized: "Uncategorized",
                stockLabel: "Stock:",
                quickView: "Quick view",
                buyNow: "Buy now",
                viewDetails: "View details",
                sizeLabel: "Size",
                colorLabel: "Color",
                lowStock: "Low stock",
                inStock: "In stock",
                outOfStock: "Out of stock",
            },
            details: {
                title: "Product details",
                about: "About this product",
                categoryLabel: "Category",
                sizeLabel: "Size",
                colorLabel: "Color",
                stockLabel: "Available stock",
                close: "Close",
                buyNow: "Buy now",
            },
            notifications: {
                addedToCartTitle: "Added to cart",
                addedToCartMessage: (name) => `${name} was added to your cart.`,
            },
        },

        profile: {
            header: {
                kicker: "Profile",
                title: "Manage your account",
                openAdminDashboard: "Open admin dashboard",
            },
            avatar: {
                title: "Profile picture",
                description: "Upload a photo to personalize your dashboard.",
                previewAlt: "Profile picture preview",
                choose: "Choose picture",
                change: "Change picture",
                remove: "Remove picture",
                hint: "PNG, JPG, WEBP, or GIF. The image is resized before saving.",
            },
            basic: {
                title: "Basic information",
                description: "Update your personal details and contact information.",
                fields: {
                    name: "Name",
                    email: "Email",
                    username: "Username",
                    phone: "Phone",
                    location: "Location",
                    bio: "Bio",
                },
                placeholders: {
                    username: "your_username",
                    phone: "+254 7xx xxx xxx",
                    location: "Nairobi, Kenya",
                    bio: "Tell us a little about yourself",
                },
                roleLabel: "Role:",
                save: "Save changes",
                saving: "Saving...",
            },
            security: {
                title: "Security",
                description: "Change your password.",
                fields: {
                    currentPassword: "Current password",
                    newPassword: "New password",
                },
                changePassword: "Change password",
                updating: "Updating...",
            },
            password: {
                minLength: 6,
                errors: {
                    tooShort: (min) => `New password must be at least ${min} characters.`,
                },
            },
            errors: {
                failedToLoad: "Failed to load profile",
                couldNotLoadTitle: "Couldn’t load profile",
                invalidAvatarType: "Please choose an image file.",
                avatarReadFailed: "Could not read the selected image.",
                avatarTooLarge: "Profile picture is too large after processing. Please choose a smaller image.",
            },
            toasts: {
                profileSavedTitle: "Saved",
                profileSavedMessage: "Profile updated successfully.",
                profileSaveFailedTitle: "Update failed",
                avatarRemovedTitle: "Profile picture removed",
                avatarRemovedMessage: "Your profile picture has been cleared.",
                passwordChangedTitle: "Updated",
                passwordChangedMessage: "Password changed successfully.",
                passwordChangeFailedTitle: "Password change failed",
                tryAgain: "Try again.",
            },
        },

        overview: {
            accountStatus: {
                activeMinOrders: 3,
                active: "Active",
                new: "New",
            },
            recent: {
                orderStatus: (shortId, status) => `Order ${shortId} is ${status}`,
            },
            errors: {
                couldNotLoad: "Couldn't load your dashboard",
            },
            actions: {
                retry: "Retry",
            },
            cards: {
                allTime: "All time",
                totalOrders: "Total Orders",
                totalSpending: "Total Spending",
                accountStatus: "Account Status",
                accountStatusHints: {
                    new: "Complete a few purchases to unlock perks",
                    active: "You're in good standing",
                },
            },
            trend: {
                kicker: "Spending trend",
                title: "Last 6 months",
                monthlyChangeLabel: "Monthly change:",
            },
            insights: {
                kicker: "Insights",
                mostPurchasedCategory: "Most purchased category",
                tip: "Explore the full catalog to discover more tailored picks and restock-ready essentials.",
                browseShop: "Browse shop",
            },
            activity: {
                kicker: "Recent activity",
                title: "Latest updates",
                viewAllOrders: "View all orders",
                empty: "No activity yet.",
            },
        },
    },

    // admin
    
    admin: {
        actions: {
            close: "Close",
            retry: "Retry",
            cancel: "Cancel",
            save: "Save",
            clear: "Clear",
            edit: "Edit",
            delete: "Delete",
            logout: "Logout",
            backToStore: "Back to store",
            markAllRead: "Mark all read",
        },

        common: {
            failedToLoad: "Failed to load data",
            noResults: "No results",
            saving: "Saving...",
            deleting: "Deleting...",
            signingIn: "Signing in...",
        },

        // admin side-bar
        nav: {
            dashboard: "Dashboard",
            products: "Products",
            orders: "Orders",
            customers: "Customers",
            inventory: "Inventory",
            profile: "Profile",
            ariaLabel: "Admin navigation",
        },

        // admin header
        brand: {
            app: "Aurex",
            adminLabel: "Admin",
        },

        // top navigation-bar
        topbar: {
            title: "Admin Dashboard",
            notificationsAria: "Notifications",
            notificationsIcon: "🔔",
            notificationsTitle: "Notifications",
            noNotifications: "No notifications",
            defaultUserName: "Admin",
        },

        // loginpage
        login: {
            brand: "Aurex",
            title: "Admin Sign In",
            description: "Admin credentials ARE Required.",
            cardTitle: "Login",
            emailLabel: "Email",
            passwordLabel: "Password",
            signIn: "Sign in",
            checkingCredentials: "Checking credentials",
            tip: {
                prefix: "Tip: default demo is",
                email: "admin@aurex.com",
                password: "aurexadmin",
            },
            errors: {
                loginFailed: "Login failed",
                twoFactorRequired: "Two-factor code required",
            },
            twoFactorLabel: "2FA code",
            twoFactorPlaceholder: "123456",
        },

        profile: {
            title: "Admin profile",
            loading: "Loading profile...",
            unknownAdmin: "Admin",
            avatarAlt: "Admin avatar",
            editProfile: "Edit profile",
            changeAvatar: "Change avatar",
            usernameLabel: "Username:",
            adminIdLabel: "Admin ID:",
            noUsername: "Not set",
            actions: {
                edit: "Edit",
            },
            roles: {
                super_admin: "Super Admin",
                moderator: "Moderator",
                staff: "Staff",
            },
            errors: {
                failedToSave: "Failed to save changes",
                nameRequired: "Full name is required",
                emailInvalid: "Enter a valid email",
                usernameInvalid: "Username must be 3-30 characters (a-z, 0-9, _)",
                avatarType: "Please choose an image file",
                avatarTooLarge: "Image too large (max 200KB)",
                avatarReadFailed: "Failed to read image",
                passwordRequired: "Current password and new password are required",
                passwordWeak: "Password must be at least 8 characters",
                passwordMismatch: "Passwords do not match",
            },
            identity: {
                title: "Identity & contact",
                fields: {
                    name: "Full name",
                    email: "Email",
                    phone: "Phone number",
                    location: "Location",
                    username: "Username",
                    bio: "Bio / description",
                },
                placeholders: {
                    phone: "+254 7xx xxx xxx",
                    location: "Nairobi, KE",
                    username: "aurex_admin",
                    bio: "Write a short bio...",
                },
            },
            permissions: {
                title: "Role & permissions",
                currentRole: "Current role",
                manageEnabled: "Can manage",
                manageDisabled: "View only",
                noPermissions: "Permissions not available.",
                requestRoleChangeHint: "Need more access? Request a role change from a Super Admin.",
                flags: {
                    can_read: "Read access",
                    can_write: "Write access",
                    can_delete: "Delete access",
                    can_manage_users: "Manage users",
                    can_manage_system: "Manage system",
                },
                descriptions: {
                    can_read: "View resources and reports.",
                    can_write: "Create and update resources.",
                    can_delete: "Delete products, users, and orders.",
                    can_manage_users: "Grant roles and manage user accounts.",
                    can_manage_system: "Manage settings and critical operations.",
                },
            },
            security: {
                title: "Security",
                changePasswordTitle: "Change password",
                changePasswordHint: "Changing password revokes active sessions.",
                passwordChanged: "Password changed. You’ve been logged out.",
                twoFactorTitle: "Two-factor authentication (2FA)",
                twoFactorEnabled: "2FA is enabled on this account.",
                twoFactorDisabled: "Add a second factor for better security.",
                twoFactorSetupTitle: "Finish 2FA setup",
                twoFactorSetupHint: "Add the key to your authenticator app and enter the current code to enable.",
                manualKeyLabel: "Manual key:",
                otpauthLabel: "OTPAuth URL:",
                loginHistoryTitle: "Login history",
                loginHistoryEmpty: "No login history yet.",
                statusOn: "ON",
                statusOff: "OFF",
                fields: {
                    currentPassword: "Current password",
                    newPassword: "New password",
                    confirmPassword: "Confirm new password",
                    twoFactorCode: "2FA code",
                },
                placeholders: {
                    twoFactorCode: "123456",
                },
                actions: {
                    changePassword: "Update password",
                    setup2fa: "Set up 2FA",
                    enable2fa: "Enable 2FA",
                    disable2fa: "Disable 2FA",
                },
            },
            sessions: {
                title: "Active sessions",
                logoutAll: "Logout from all devices",
                logoutAllHint: "This will delete all admin tokens.",
                empty: "No active sessions found.",
                unknownDevice: "Unknown device",
                current: "Current",
                ipLabel: "IP:",
                lastActiveLabel: "Last active:",
            },
            activity: {
                title: "Activity & audit log",
                empty: "No activity yet.",
                columns: {
                    time: "Time",
                    action: "Action",
                    target: "Target",
                    description: "Description",
                },
                filters: {
                    from: "From",
                    to: "To",
                    actionType: "Action type",
                    actionTypePlaceholder: "admin.profile.update",
                },
                actions: {
                    apply: "Apply filters",
                    clear: "Clear filters",
                },
            },
            preferences: {
                title: "System preferences",
                fields: {
                    theme: "Theme",
                    language: "Language",
                    notifications: "Notifications",
                    dashboardLayout: "Dashboard layout",
                },
                hints: {
                    notifications: "Enable in-app notifications in the admin dashboard.",
                },
                options: {
                    themeDark: "Dark",
                    themeLight: "Light",
                    langEn: "English",
                    langSw: "Swahili",
                    layoutDefault: "Default",
                    layoutCompact: "Compact",
                    layoutComfortable: "Comfortable",
                },
            },
        },

        // admin dash
        dashboard: {
            title: "Dashboard",
            cards: {
                totalSales: "Total Sales",
                allTime: "All time",
                orders: "Orders",
                processed: "Processed",
                customers: "Customers",
                active: "Active",
                revenue: "Revenue",
                todayPrefix: "Today:",
                recentActivity: "Recent Activity",
                lowStockPrefix: "Low stock:",
            },
            notifications: {
                lowStockAlert: (count) => `Low stock alert: ${count} item(s) need restock.`,
            },
        },
        orders: {
            title: "Orders",
            loading: "Loading orders",
            columns: {
                order: "Order",
                customer: "Customer",
                date: "Date",
                total: "Total",
                status: "Status",
                update: "Update",
            },
            status: {
                pending: "Pending",
                shipped: "Shipped",
                delivered: "Delivered",
            },
            updating: {
                saving: "Saving...",
            },
            notifications: {
                statusUpdated: (id, status) => `Order ${id} updated to ${status}.`,
            },
        },
        products: {
            title: "Products",
            loading: "Loading products",
            newProduct: "New product",
            columns: {
                product: "Product",
                category: "Category",
                price: "Price",
                stock: "Stock",
                color: "Color",
                actions: "Actions",
            },
            form: {
                newTitle: "New product",
                editTitle: "Edit product",
                fields: {
                    name: { label: "Name", placeholder: "Navy Wool Suit" },
                    price: { label: "Price", placeholder: "249" },
                    size: { label: "Size", placeholder: "S / M / L" },
                    color: { label: "Color", placeholder: "Navy" },
                    stock: { label: "Stock", placeholder: "12" },
                    category: { label: "Category", placeholder: "Suits" },
                    description: { label: "Description", placeholder: "Write a short description of the product..." },
                    image: {
                        label: "Image",
                        helpText: "Upload an image .",
                        previewAlt: "Preview",
                    },
                },
                errors: {
                    failedToSave: "Failed to save product",
                    failedToReadImage: "Failed to read image",
                    invalidImageFile: "Please choose an image file.",
                    imageTooLarge: "Image is too large. Please choose a smaller file.",
                    imageProcessingUnsupported: "Image processing is not supported in this browser.",
                },
            },
            stock: {
                low: (count) => `Low (${count})`,
            },
            notifications: {
                deleted: (name) => `Product deleted: ${name}.`,
                saved: (mode, name) => `${mode}: ${name}.`,
                modes: {
                    updated: "Product updated",
                    created: "Product created",
                },
            },
        },
        inventory: {
            title: "Inventory",
            loading: "Loading inventory",
            columns: {
                product: "Product",
                category: "Category",
                stock: "Stock",
                alert: "Alert",
            },
            stock: {
                low: (count) => `Low (${count})`,
            },
            badges: {
                lowStock: "Low stock",
                ok: "OK",
            },
            notifications: {
                lowStockWarning: (count) => `Inventory warning: ${count} product(s) are low stock.`,
            },
        },
        customers: {
            title: "Customers",
            profileTitle: "Customer profile",
            orderHistoryTitle: "Order history",
            tierPrefix: "Tier:",
            tiers: {
                gold: "Gold",
                silver: "Silver",
            },
            loadingCustomers: "Loading customers",
            loadingOrderHistory: "Loading order history",
            emptyOrders: "No orders for this customer",
            columns: {
                customer: "Customer",
                email: "Email",
                tier: "Tier",
                order: "Order",
                date: "Date",
                status: "Status",
                total: "Total",
            },
        },
    }





};

export default textStrings;
