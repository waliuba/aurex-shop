
import sizes from './sizes';

// font family used across the app

const FontFamily = {
  headlines: 'Playfair Display',
  bodytxt: 'Lora',
  btns: 'Montserrat',
};

// font weight used across ....

const FontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};


// typography......


const fonts = {
  FontFamily,
  FontWeight,
  Typography: {
    // Heading
    heading: {
      fontFamily: FontFamily.headlines,
      fontWeight: FontWeight.bold,
      fontSize: sizes.fonts.xl,
    },

    // Sub-heading

    sub_heading : {
         fontFamily: FontFamily.headlines,
         fontWeight: FontWeight.semibold,
         fontSize: sizes.fonts.lg,
    },

    // Hero section

    hero : {

        fontFamily: FontFamily.headlines,
        fontWeight: FontWeight.semibold,
        fontSize: sizes.fonts.lg,
        
    },

    // Body

    body : {
        fontFamily : FontFamily.bodytxt,
          fontWeight: FontWeight.light,
          fontSize: sizes.fonts.md,

    },

    // btns

    btn : {
        fontFamily : FontFamily.btns,
          fontWeight: FontWeight.regular,
          fontSize: sizes.fonts.sm,
    }


  },
};

export { FontFamily, FontWeight };
export default fonts;
