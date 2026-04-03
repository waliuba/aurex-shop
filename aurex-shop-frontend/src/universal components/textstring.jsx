
const year = new Date().getFullYear();


const Text = {

    

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

    pages: {
        home: {
            title: "Aurex Shop",
            subtitle:
                "Discover curated essentials with a clean, modern look. Shop new arrivals, explore categories, and find pieces that fit your style.",
            ctas: {
                browseShop: "Browse Shop",
                learnMore: "Learn More",
            },
            featuredTitle: "Featured",
            carousel: {
                prev: "Prev",
                next: "Next",
                ariaLabel: "Featured products",
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
            cart : "add to cart",
            check_out : "check_out ",

            
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
        }


    },

    // admin
    
    admin: {
        actions: {
            close: "Close",
            retry: "Retry",
            cancel: "Cancel",
            save: "Save",
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
            notificationsTitle: "Notifications",
            noNotifications: "No notifications",
            defaultUserName: "Admin",
        },

        // loginpage
        login: {
            brand: "Aurex",
            title: "Admin Sign In",
            description: "Use admin credentials to manage products, orders, customers, and inventory.",
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
                    image: {
                        label: "Image",
                        helpText: "Upload an image (preview stays local in mock mode).",
                        previewAlt: "Preview",
                    },
                },
                errors: {
                    failedToSave: "Failed to save product",
                },
            },
            stock: {
                low: (count) => `Low (${count})`,
            },
            notifications: {
                deleted: (name) => `Product deleted: ${name}.`,
                saved: (mode, name) => `${mode}: ${name}.`,
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





} 


export default Text;
