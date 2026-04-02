
const sizes = {
    // logo
    logo:{
        md: 30,
    },

    // navbar

    navbar:{
        height:70,
        paddingX:24,
        gap: 24,
        logoHeight: 36,

    },

    // footer

    footer: {
        paddingX: 24,
        paddingY: 28,
        gap: 18,
        logoHeight: 40,
    },

    // pages

    page: {
        maxWidth: 1100,
        paddingX: 24,
        paddingY: 28,
        sectionGap: 22,
        cardRadius: 14,
    },

    // buttons

    buttons: {
        radius: 999,
        paddingY: 10,
        paddingX: 14,
        fontSize: 14,
    },

    // icons

    icons:{
        xs: 15,
        md: 25,
        lg: 30,
    },

    // font sizes 

    fonts:{
        xs: 5,
        sm: 8,
        md: 15,
        lg: 24,
        xl: 32, 

    },

    // admin (dashboard/backoffice)
    admin: {
        gaps: {
            sm: 4,
            md: 10,
            lg: 12,
            xl: 14,
        },
        customers: {
            profileGap: 14,
            cardPadding: 12,
            detailsGap: 4,
            badgeMarginTop: 8,
            orderSectionGap: 10,
            nameFontSize: 16,
            nameFontWeight: 850,
            sectionTitleFontWeight: 800,
        },
        login: {
            maxWidth: 960,
            padding: 18,
            containerGap: 14,
            headerGap: 6,
            formGap: 12,
            actionsGap: 10,
            kickerFontSize: 12,
            kickerLetterSpacing: 0.6,
            titleFontSize: 28,
            titleFontWeight: 900,
        },
        dashboard: {
            gridGap: 14,
            errorGap: 12,
            skeletonGap: 10,
            activityCardRadius: 14,
            activityCardPadding: 10,
            activityCardGap: 2,
        },
        orders: {
            updateRowGap: 10,
        },
        products: {
            formMediaMarginTop: 12,
            formMediaGap: 10,
            previewRadius: 16,
            previewMaxHeight: 220,
            actionsGap: 10,
        },
        charts: {
            barHeight: 140,
            barRadius: 12,
            barGap: 10,
            barLabelGap: 6,
            barLabelFontSize: 12,
        },
    },


}


export default sizes;
