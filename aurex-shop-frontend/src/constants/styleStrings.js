export const styleStrings = {
  layout: {
    grid: (gap, extra) => ({
      display: 'grid',
      ...(gap !== undefined ? { gap } : null),
      ...(extra || null),
    }),
    flexRow: (gap, extra) => ({
      display: 'flex',
      ...(gap !== undefined ? { gap } : null),
      ...(extra || null),
    }),
  },
};

export default styleStrings;

