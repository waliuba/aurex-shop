

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
    },

    footer: {

        // tagline

        tagline: "Quality pieces, curated with care. Shop the latest and timeless essentials.",

        // footer-links

        Shipping: "Shipping",
        Returns : "Returns",
        Faq : "Faq",
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


    }





} 

export default Text;
